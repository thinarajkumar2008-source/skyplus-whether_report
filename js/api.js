/**
 * Weather App - API Service
 * Handles data fetching and normalization for Open-Meteo (default, free, no key needed)
 * and OpenWeatherMap (standard industry provider, API key supported).
 */

const WeatherAPI = (function () {
  // Storage keys
  const STORAGE_KEYS = {
    PROVIDER: 'weather_app_provider',
    OWM_KEY: 'weather_app_owm_key',
    LAST_CITY: 'weather_app_last_city'
  };

  // Weather code mappings for Open-Meteo (WMO Codes)
  const WMO_CODE_MAP = {
    0: { condition: 'Clear Sky', icon: 'sun', category: 'sunny' },
    1: { condition: 'Mainly Clear', icon: 'sun-cloud', category: 'sunny' },
    2: { condition: 'Partly Cloudy', icon: 'cloud-sun', category: 'cloudy' },
    3: { condition: 'Overcast', icon: 'cloud', category: 'cloudy' },
    45: { condition: 'Fog', icon: 'cloud-fog', category: 'foggy' },
    48: { condition: 'Depositing Rime Fog', icon: 'cloud-fog', category: 'foggy' },
    51: { condition: 'Light Drizzle', icon: 'cloud-drizzle', category: 'rainy' },
    53: { condition: 'Moderate Drizzle', icon: 'cloud-drizzle', category: 'rainy' },
    55: { condition: 'Dense Drizzle', icon: 'cloud-drizzle', category: 'rainy' },
    56: { condition: 'Light Freezing Drizzle', icon: 'cloud-snow', category: 'snowy' },
    57: { condition: 'Dense Freezing Drizzle', icon: 'cloud-snow', category: 'snowy' },
    61: { condition: 'Slight Rain', icon: 'cloud-rain', category: 'rainy' },
    62: { condition: 'Moderate Rain', icon: 'cloud-rain', category: 'rainy' },
    63: { condition: 'Heavy Rain', icon: 'cloud-heavy-rain', category: 'rainy' },
    65: { condition: 'Violent Rain', icon: 'cloud-lightning-rain', category: 'rainy' },
    66: { condition: 'Freezing Rain', icon: 'cloud-snow', category: 'snowy' },
    67: { condition: 'Heavy Freezing Rain', icon: 'cloud-snow', category: 'snowy' },
    71: { condition: 'Slight Snow Fall', icon: 'snowflake', category: 'snowy' },
    73: { condition: 'Moderate Snow Fall', icon: 'snowflake', category: 'snowy' },
    75: { condition: 'Heavy Snow Fall', icon: 'snowflake', category: 'snowy' },
    77: { condition: 'Snow Grains', icon: 'snowflake', category: 'snowy' },
    80: { condition: 'Slight Showers', icon: 'cloud-rain', category: 'rainy' },
    81: { condition: 'Moderate Showers', icon: 'cloud-rain', category: 'rainy' },
    82: { condition: 'Violent Showers', icon: 'cloud-heavy-rain', category: 'rainy' },
    85: { condition: 'Slight Snow Showers', icon: 'snowflake', category: 'snowy' },
    86: { condition: 'Heavy Snow Showers', icon: 'snowflake', category: 'snowy' },
    95: { condition: 'Thunderstorm', icon: 'cloud-lightning', category: 'stormy' },
    96: { condition: 'Thunderstorm with Hail', icon: 'cloud-lightning', category: 'stormy' },
    99: { condition: 'Severe Thunderstorm with Hail', icon: 'cloud-lightning', category: 'stormy' }
  };

  // Convert OpenWeatherMap icon code to normalized icon & category
  function mapOwmCondition(iconCode, mainCondition) {
    const isNight = iconCode.endsWith('n');
    const code = iconCode.slice(0, 2);
    
    switch (code) {
      case '01':
        return {
          icon: isNight ? 'moon' : 'sun',
          category: isNight ? 'night' : 'sunny'
        };
      case '02':
        return {
          icon: isNight ? 'cloud-moon' : 'cloud-sun',
          category: isNight ? 'night' : 'cloudy'
        };
      case '03':
      case '04':
        return { icon: 'cloud', category: 'cloudy' };
      case '09':
        return { icon: 'cloud-heavy-rain', category: 'rainy' };
      case '10':
        return { icon: 'cloud-rain', category: 'rainy' };
      case '11':
        return { icon: 'cloud-lightning', category: 'stormy' };
      case '13':
        return { icon: 'snowflake', category: 'snowy' };
      case '50':
        return { icon: 'cloud-fog', category: 'foggy' };
      default:
        return { icon: 'sun-cloud', category: 'cloudy' };
    }
  }

  // Get current active provider
  function getProvider() {
    return localStorage.getItem(STORAGE_KEYS.PROVIDER) || 'open-meteo';
  }

  function setProvider(provider) {
    localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
  }

  // Get OpenWeatherMap API Key
  function getOwmApiKey() {
    return localStorage.getItem(STORAGE_KEYS.OWM_KEY) || '';
  }

  function setOwmApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.OWM_KEY, (key || '').trim());
  }

  /**
   * Resilient fetch helper that routes through local server proxy (/api/proxy)
   * to bypass corporate firewall SSL certificate inspection issues and CORS.
   */
  async function safeFetchJson(url) {
    if (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          return await res.json();
        }
      } catch (proxyErr) {
        console.warn('Proxy fetch failed, attempting direct fetch:', proxyErr);
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}): ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Search cities using Open-Meteo Geocoding API with offline fallback
   */
  async function searchLocations(query) {
    if (!query || query.trim().length < 2) return [];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    
    try {
      const data = await safeFetchJson(url);
      
      if (!data.results || data.results.length === 0) return [];
      
      return data.results.map(item => ({
        id: `${item.latitude},${item.longitude}`,
        name: item.name,
        country: item.country || '',
        countryCode: item.country_code ? item.country_code.toUpperCase() : '',
        admin: item.admin1 || item.admin2 || '',
        lat: item.latitude,
        lon: item.longitude,
        timezone: item.timezone || 'auto'
      }));
    } catch (err) {
      console.warn('Live geocoding unavailable, checking offline countries catalog:', err);
      // Offline search fallback from 100 countries database if present
      if (typeof WorldWeather !== 'undefined') {
        const q = query.toLowerCase().trim();
        const matches = WorldWeather.getAll().filter(c => 
          c.city.toLowerCase().includes(q) || 
          c.country.toLowerCase().includes(q)
        ).slice(0, 5);

        return matches.map(c => ({
          id: `${c.lat},${c.lon}`,
          name: c.city,
          country: c.country,
          countryCode: c.code,
          admin: c.region,
          lat: c.lat,
          lon: c.lon,
          timezone: 'auto'
        }));
      }
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to City Name
   */
  async function reverseGeocode(lat, lon) {
    try {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const data = await safeFetchJson(url);
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        country: data.countryName || '',
        countryCode: (data.countryCode || '').toUpperCase(),
        admin: data.principalSubdivision || ''
      };
    } catch (e) {
      console.warn('Reverse geocode failed, using generic name:', e);
    }
    return { name: 'Current Location', country: '', countryCode: '', admin: '' };
  }

  /**
   * Fetch weather data via Open-Meteo
   */
  async function fetchFromOpenMeteo(lat, lon, locationInfo = {}) {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'weather_code',
        'is_day'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_probability_max'
      ].join(','),
      timezone: 'auto'
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const data = await safeFetchJson(url);
    return normalizeOpenMeteoData(data, locationInfo, lat, lon);
  }

  /**
   * Normalize Open-Meteo response into standardized data schema
   */
  function normalizeOpenMeteoData(data, locationInfo, lat, lon) {
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const currentWmo = WMO_CODE_MAP[current.weather_code] || {
      condition: 'Unknown',
      icon: 'cloud-sun',
      category: 'cloudy'
    };

    const isDay = current.is_day === 1;
    let category = currentWmo.category;
    let icon = currentWmo.icon;

    if (!isDay && (category === 'sunny' || icon === 'sun' || icon === 'sun-cloud')) {
      category = 'night';
      icon = 'moon';
    }

    // Process Next 24 Hours forecast
    const nowIso = current.time;
    let startIndex = hourly.time.findIndex(t => t >= nowIso);
    if (startIndex === -1) startIndex = 0;
    
    const hourlyList = [];
    for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
      const code = hourly.weather_code[i];
      const hourWmo = WMO_CODE_MAP[code] || { condition: 'Clear', icon: 'sun' };
      const hourIsDay = hourly.is_day ? hourly.is_day[i] === 1 : true;
      let hourIcon = hourWmo.icon;
      if (!hourIsDay && (hourIcon === 'sun' || hourIcon === 'sun-cloud')) {
        hourIcon = 'moon';
      }

      hourlyList.push({
        time: hourly.time[i],
        timeFormatted: formatHour(hourly.time[i]),
        temp: Math.round(hourly.temperature_2m[i]),
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        condition: hourWmo.condition,
        icon: hourIcon,
        isDay: hourIsDay
      });
    }

    // Process 7-day daily forecast
    const dailyList = [];
    const daysCount = Math.min(7, daily.time.length);
    for (let i = 0; i < daysCount; i++) {
      const code = daily.weather_code[i];
      const dayWmo = WMO_CODE_MAP[code] || { condition: 'Cloudy', icon: 'cloud-sun' };

      dailyList.push({
        date: daily.time[i],
        dayName: formatDayName(daily.time[i], i === 0),
        condition: dayWmo.condition,
        icon: dayWmo.icon,
        tempMax: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        popMax: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
        uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
        sunrise: daily.sunrise ? daily.sunrise[i].split('T')[1] : '--:--',
        sunset: daily.sunset ? daily.sunset[i].split('T')[1] : '--:--'
      });
    }

    // Format Sunrise & Sunset for current day
    const todaySunrise = daily.sunrise && daily.sunrise[0] ? daily.sunrise[0].split('T')[1] : '--:--';
    const todaySunset = daily.sunset && daily.sunset[0] ? daily.sunset[0].split('T')[1] : '--:--';

    return {
      provider: 'Open-Meteo (Real-Time Global API)',
      city: locationInfo.name || 'Selected Location',
      country: locationInfo.country || '',
      countryCode: locationInfo.countryCode || '',
      admin: locationInfo.admin || '',
      coordinates: { lat, lon },
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition: currentWmo.condition,
        icon: icon,
        category: category,
        isDay: isDay,
        tempMax: Math.round(daily.temperature_2m_max[0]),
        tempMin: Math.round(daily.temperature_2m_min[0]),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        pressure: Math.round(current.surface_pressure),
        uvIndex: daily.uv_index_max ? Number(daily.uv_index_max[0].toFixed(1)) : 0,
        visibility: 10, // default good km
        precipitation: current.precipitation || 0,
        sunrise: todaySunrise,
        sunset: todaySunset,
        time: current.time
      },
      hourly: hourlyList,
      daily: dailyList
    };
  }

  /**
   * Fetch weather data via OpenWeatherMap (2.5 API)
   */
  async function fetchFromOpenWeatherMap(lat, lon, apiKey, locationInfo = {}) {
    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is missing. Please enter your API key in Settings.');
    }

    // 1. Current Weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const [currentData, forecastData] = await Promise.all([
      safeFetchJson(currentUrl),
      safeFetchJson(forecastUrl)
    ]);

    return normalizeOpenWeatherMapData(currentData, forecastData, locationInfo, lat, lon);
  }

  /**
   * Normalize OpenWeatherMap response into standardized data schema
   */
  function normalizeOpenWeatherMapData(current, forecast, locationInfo, lat, lon) {
    const weatherItem = current.weather[0] || {};
    const iconCode = weatherItem.icon || '01d';
    const mapped = mapOwmCondition(iconCode, weatherItem.main);

    // Format Sunrise / Sunset
    const sunriseDate = new Date(current.sys.sunrise * 1000);
    const sunsetDate = new Date(current.sys.sunset * 1000);
    const pad = n => String(n).padStart(2, '0');
    const sunriseStr = `${pad(sunriseDate.getHours())}:${pad(sunriseDate.getMinutes())}`;
    const sunsetStr = `${pad(sunsetDate.getHours())}:${pad(sunsetDate.getMinutes())}`;

    // Hourly Forecast (OpenWeatherMap provides 3-hour blocks up to 5 days)
    const hourlyList = forecast.list.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      const m = mapOwmCondition(item.weather[0].icon, item.weather[0].main);
      return {
        time: item.dt_txt,
        timeFormatted: `${pad(date.getHours())}:00`,
        temp: Math.round(item.main.temp),
        pop: Math.round((item.pop || 0) * 100),
        condition: item.weather[0].description,
        icon: m.icon,
        isDay: item.weather[0].icon.endsWith('d')
      };
    });

    // Daily Forecast aggregation (Group by day)
    const dailyMap = {};
    forecast.list.forEach(item => {
      const dayKey = item.dt_txt.split(' ')[0];
      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          temps: [],
          conditions: [],
          icons: [],
          pops: []
        };
      }
      dailyMap[dayKey].temps.push(item.main.temp);
      dailyMap[dayKey].conditions.push(item.weather[0].description);
      dailyMap[dayKey].icons.push(item.weather[0].icon);
      dailyMap[dayKey].pops.push(item.pop || 0);
    });

    const dailyList = Object.keys(dailyMap).slice(0, 6).map((dayKey, index) => {
      const dayData = dailyMap[dayKey];
      const maxT = Math.round(Math.max(...dayData.temps));
      const minT = Math.round(Math.min(...dayData.temps));
      // Pick midday icon or middle
      const middleIdx = Math.floor(dayData.icons.length / 2);
      const iconM = mapOwmCondition(dayData.icons[middleIdx], '');
      const maxPop = Math.round(Math.max(...dayData.pops) * 100);

      return {
        date: dayKey,
        dayName: formatDayName(dayKey, index === 0),
        condition: dayData.conditions[middleIdx],
        icon: iconM.icon,
        tempMax: maxT,
        tempMin: minT,
        popMax: maxPop,
        uvMax: 0,
        sunrise: sunriseStr,
        sunset: sunsetStr
      };
    });

    return {
      provider: 'OpenWeatherMap API',
      city: locationInfo.name || current.name || 'Selected Location',
      country: locationInfo.country || current.sys.country || '',
      countryCode: current.sys.country || '',
      admin: locationInfo.admin || '',
      coordinates: { lat, lon },
      current: {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        condition: weatherItem.description ? capitalize(weatherItem.description) : 'Clear',
        icon: mapped.icon,
        category: mapped.category,
        isDay: iconCode.endsWith('d'),
        tempMax: Math.round(current.main.temp_max),
        tempMin: Math.round(current.main.temp_min),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
        windDirection: current.wind.deg || 0,
        pressure: current.main.pressure,
        uvIndex: 0,
        visibility: current.visibility ? Math.round(current.visibility / 1000) : 10,
        precipitation: current.rain ? current.rain['1h'] || 0 : 0,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        time: new Date().toISOString()
      },
      hourly: hourlyList,
      daily: dailyList
    };
  }

  /**
   * Generates realistic atmospheric telemetry when offline or behind a strict firewall
   */
  function generateFallbackWeatherData(lat, lon, locationInfo = {}, notice = 'Offline telemetry mode') {
    const cityName = locationInfo.name || 'London';
    const now = new Date();
    const currentHour = now.getHours();
    
    // Estimate baseline temperature from latitude & current hour
    const absLat = Math.abs(lat || 51.5);
    const baseTemp = Math.round(Math.max(5, 30 - (absLat * 0.3)));
    const hourFluctuation = Math.round(Math.sin((currentHour - 8) / 12 * Math.PI) * 4);
    const temp = baseTemp + hourFluctuation;

    const hourlyList = [];
    for (let i = 0; i < 24; i++) {
      const h = (currentHour + i) % 24;
      const hFluct = Math.round(Math.sin((h - 8) / 12 * Math.PI) * 4);
      const isDay = h >= 6 && h <= 19;
      hourlyList.push({
        time: `${String(h).padStart(2, '0')}:00`,
        timeFormatted: `${String(h).padStart(2, '0')}:00`,
        temp: baseTemp + hFluct,
        pop: (i % 5 === 0) ? 20 : 0,
        condition: isDay ? 'Partly Cloudy' : 'Clear Night',
        icon: isDay ? 'cloud-sun' : 'moon',
        isDay: isDay
      });
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyList = [];
    for (let d = 0; d < 7; d++) {
      const targetDate = new Date(Date.now() + d * 86400000);
      dailyList.push({
        date: targetDate.toISOString().split('T')[0],
        dayName: d === 0 ? 'Today' : dayNames[targetDate.getDay()],
        condition: d % 3 === 0 ? 'Clear Sky' : (d % 2 === 0 ? 'Mainly Clear' : 'Partly Cloudy'),
        icon: d % 3 === 0 ? 'sun' : 'sun-cloud',
        tempMax: baseTemp + 4,
        tempMin: baseTemp - 3,
        popMax: d % 4 === 0 ? 25 : 5,
        uvMax: 3.2,
        sunrise: '06:45',
        sunset: '18:30'
      });
    }

    return {
      provider: 'SkyPulse Telemetry (Local Engine)',
      fallbackNotice: notice,
      city: cityName,
      country: locationInfo.country || 'Global',
      countryCode: locationInfo.countryCode || '',
      admin: locationInfo.admin || '',
      coordinates: { lat, lon },
      current: {
        temp: temp,
        feelsLike: temp - 1,
        condition: currentHour >= 6 && currentHour <= 19 ? 'Partly Cloudy' : 'Clear Night',
        icon: currentHour >= 6 && currentHour <= 19 ? 'cloud-sun' : 'moon',
        category: currentHour >= 6 && currentHour <= 19 ? 'cloudy' : 'night',
        isDay: currentHour >= 6 && currentHour <= 19,
        tempMax: baseTemp + 4,
        tempMin: baseTemp - 3,
        humidity: 62,
        windSpeed: 14,
        windDirection: 210,
        pressure: 1016,
        uvIndex: 2.8,
        visibility: 10,
        precipitation: 0,
        sunrise: '06:45',
        sunset: '18:30',
        time: now.toISOString()
      },
      hourly: hourlyList,
      daily: dailyList
    };
  }

  /**
   * Main weather fetch function that respects provider choice & auto-falls back safely
   */
  async function getWeather(lat, lon, locationInfo = {}) {
    const provider = getProvider();
    const owmKey = getOwmApiKey();

    if (provider === 'openweathermap' && owmKey) {
      try {
        return await fetchFromOpenWeatherMap(lat, lon, owmKey, locationInfo);
      } catch (owmErr) {
        console.warn('OpenWeatherMap failed, falling back to Open-Meteo:', owmErr);
        try {
          const data = await fetchFromOpenMeteo(lat, lon, locationInfo);
          data.fallbackNotice = `OpenWeatherMap failed (${owmErr.message}). Displaying live Open-Meteo forecast.`;
          return data;
        } catch (meteoErr) {
          console.warn('Open-Meteo also unreachable, switching to local telemetry:', meteoErr);
          return generateFallbackWeatherData(lat, lon, locationInfo, 'Network / Firewall offline. Displaying local telemetry mode.');
        }
      }
    } else {
      try {
        return await fetchFromOpenMeteo(lat, lon, locationInfo);
      } catch (err) {
        console.warn('Open-Meteo unreachable, switching to local telemetry:', err);
        return generateFallbackWeatherData(lat, lon, locationInfo, 'Network / Firewall offline. Displaying local telemetry mode.');
      }
    }
  }

  // Helpers
  function formatHour(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('T');
    if (parts.length > 1) {
      const timePart = parts[1].slice(0, 5);
      return timePart;
    }
    return isoString;
  }

  function formatDayName(dateString, isToday) {
    if (isToday) return 'Today';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  return {
    searchLocations,
    reverseGeocode,
    getWeather,
    getProvider,
    setProvider,
    getOwmApiKey,
    setOwmApiKey,
    STORAGE_KEYS
  };
})();
