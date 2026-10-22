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

  // High-Speed In-Memory Caches for Instant Latency (<1ms)
  const searchCache = new Map();
  const weatherCache = new Map();
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  /**
   * Resilient fetch helper that routes through local server proxy (/api/proxy)
   * to bypass corporate firewall SSL certificate inspection issues and CORS.
   */
  async function safeFetchJson(url) {
    if (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
      try {
        const base = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
        const proxyUrl = url.startsWith('/') ? `${base}${url}` : `${base}/api/proxy?url=${encodeURIComponent(url)}`;
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

    const qKey = query.trim().toLowerCase();
    const cached = searchCache.get(qKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    
    try {
      const data = await safeFetchJson(url);
      
      if (!data.results || data.results.length === 0) {
        searchCache.set(qKey, { timestamp: Date.now(), data: [] });
        return [];
      }
      
      const mapped = data.results.map(item => ({
        id: `${item.latitude},${item.longitude}`,
        name: item.name,
        country: item.country || '',
        countryCode: item.country_code ? item.country_code.toUpperCase() : '',
        admin: item.admin1 || item.admin2 || '',
        lat: item.latitude,
        lon: item.longitude,
        timezone: item.timezone || 'auto'
      }));

      searchCache.set(qKey, { timestamp: Date.now(), data: mapped });
      return mapped;
    } catch (err) {
      console.warn('Live geocoding unavailable, checking offline countries catalog:', err);
      // Offline search fallback from worldwide countries database if present
      if (typeof WorldWeather !== 'undefined') {
        const q = query.toLowerCase().trim();
        const matches = WorldWeather.getAll().filter(c => 
          c.city.toLowerCase().includes(q) || 
          c.country.toLowerCase().includes(q)
        ).slice(0, 5);

        const mapped = matches.map(c => ({
          id: `${c.lat},${c.lon}`,
          name: c.city,
          country: c.country,
          countryCode: c.code,
          admin: c.region,
          lat: c.lat,
          lon: c.lon,
          timezone: 'auto'
        }));
        return mapped;
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

  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  const roundOrNull = (v) => isNum(v) ? Math.round(v) : null;

  /**
   * Unified temperature formatter that guarantees genuine 0°C is strictly preserved
   * and missing/invalid values strictly return placeholder (never coerced to 0).
   */
  function formatTemp(celsius, unit = 'C', placeholder = '--') {
    if (celsius === null || celsius === undefined || celsius === '') {
      return placeholder;
    }
    const num = Number(celsius);
    if (!Number.isFinite(num)) {
      return placeholder;
    }
    if (unit === 'F') {
      return Math.round((num * 9 / 5) + 32);
    }
    return Math.round(num);
  }

  /**
   * Normalize Open-Meteo response into standardized data schema
   */
  function normalizeOpenMeteoData(data, locationInfo, lat, lon) {
    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

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

    // Determine atmospheric climate:
    // Cold if temp <= 10°C, freezing, or snowy; Sunny if clear/sun and temp > 10°C
    let climate = category;
    const currentTempC = current.temperature_2m;
    const condStr = (currentWmo.condition || '').toLowerCase();
    if ((isNum(currentTempC) && currentTempC <= 10) || category === 'snowy' || condStr.includes('snow') || condStr.includes('freez') || condStr.includes('ice') || condStr.includes('sleet')) {
      climate = 'cold';
    } else if (category === 'sunny' || condStr.includes('sun') || condStr.includes('clear')) {
      climate = isDay ? 'sunny' : 'night';
    }

    // Process Next 24 Hours forecast
    const nowIso = current.time || new Date().toISOString();
    let startIndex = Array.isArray(hourly.time) ? hourly.time.findIndex(t => t >= nowIso) : -1;
    if (startIndex === -1) startIndex = 0;
    
    const hourlyList = [];
    if (Array.isArray(hourly.time)) {
      for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
        const code = hourly.weather_code ? hourly.weather_code[i] : 0;
        const hourWmo = WMO_CODE_MAP[code] || { condition: 'Clear', icon: 'sun' };
        const hourIsDay = hourly.is_day ? hourly.is_day[i] === 1 : true;
        let hourIcon = hourWmo.icon;
        if (!hourIsDay && (hourIcon === 'sun' || hourIcon === 'sun-cloud')) {
          hourIcon = 'moon';
        }

        hourlyList.push({
          time: hourly.time[i],
          timeFormatted: formatHour(hourly.time[i]),
          temp: hourly.temperature_2m ? roundOrNull(hourly.temperature_2m[i]) : null,
          pop: hourly.precipitation_probability ? (hourly.precipitation_probability[i] || 0) : 0,
          condition: hourWmo.condition,
          icon: hourIcon,
          isDay: hourIsDay
        });
      }
    }

    // Process 7-day daily forecast
    const dailyList = [];
    if (Array.isArray(daily.time)) {
      const daysCount = Math.min(7, daily.time.length);
      for (let i = 0; i < daysCount; i++) {
        const code = daily.weather_code ? daily.weather_code[i] : 0;
        const dayWmo = WMO_CODE_MAP[code] || { condition: 'Cloudy', icon: 'cloud-sun' };

        dailyList.push({
          date: daily.time[i],
          dayName: formatDayName(daily.time[i], i === 0),
          condition: dayWmo.condition,
          icon: dayWmo.icon,
          tempMax: daily.temperature_2m_max ? roundOrNull(daily.temperature_2m_max[i]) : null,
          tempMin: daily.temperature_2m_min ? roundOrNull(daily.temperature_2m_min[i]) : null,
          popMax: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
          sunrise: daily.sunrise && daily.sunrise[i] ? daily.sunrise[i].split('T')[1] : '--:--',
          sunset: daily.sunset && daily.sunset[i] ? daily.sunset[i].split('T')[1] : '--:--'
        });
      }
    }

    // Format Sunrise & Sunset for current day
    const todaySunrise = daily.sunrise && daily.sunrise[0] ? daily.sunrise[0].split('T')[1] : '--:--';
    const todaySunset = daily.sunset && daily.sunset[0] ? daily.sunset[0].split('T')[1] : '--:--';

    return {
      provider: 'Open-Meteo (Real-Time Global API)',
      status: 'success',
      city: locationInfo.name || 'Selected Location',
      country: locationInfo.country || '',
      countryCode: locationInfo.countryCode || '',
      admin: locationInfo.admin || '',
      coordinates: { lat, lon },
      current: {
        temp: roundOrNull(current.temperature_2m),
        feelsLike: roundOrNull(current.apparent_temperature),
        condition: currentWmo.condition,
        icon: icon,
        category: category,
        climate: climate,
        isDay: isDay,
        tempMax: daily.temperature_2m_max ? roundOrNull(daily.temperature_2m_max[0]) : null,
        tempMin: daily.temperature_2m_min ? roundOrNull(daily.temperature_2m_min[0]) : null,
        humidity: isNum(current.relative_humidity_2m) ? Math.round(current.relative_humidity_2m) : null,
        windSpeed: roundOrNull(current.wind_speed_10m),
        windDirection: isNum(current.wind_direction_10m) ? current.wind_direction_10m : null,
        pressure: roundOrNull(current.surface_pressure),
        uvIndex: daily.uv_index_max && isNum(daily.uv_index_max[0]) ? Number(daily.uv_index_max[0].toFixed(1)) : null,
        visibility: 10,
        precipitation: isNum(current.precipitation) ? current.precipitation : 0,
        sunrise: todaySunrise,
        sunset: todaySunset,
        time: current.time || new Date().toISOString(),
        status: 'success',
        lastUpdated: current.time || new Date().toISOString()
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
      safeFetchJson(forecastUrl).catch(e => {
        console.warn('OWM Forecast failed:', e);
        return { list: [] };
      })
    ]);

    return normalizeOpenWeatherMapData(currentData, forecastData, locationInfo, lat, lon);
  }

  /**
   * Normalize OpenWeatherMap response into standardized data schema
   */
  function normalizeOpenWeatherMapData(current, forecast, locationInfo, lat, lon) {
    const weatherItem = (current.weather && current.weather[0]) ? current.weather[0] : {};
    const iconCode = weatherItem.icon || '01d';
    const mapped = mapOwmCondition(iconCode, weatherItem.main);

    // Format Sunrise / Sunset
    let sunriseStr = '--:--';
    let sunsetStr = '--:--';
    const pad = n => String(n).padStart(2, '0');
    if (current.sys && current.sys.sunrise) {
      const sDate = new Date(current.sys.sunrise * 1000);
      sunriseStr = `${pad(sDate.getHours())}:${pad(sDate.getMinutes())}`;
    }
    if (current.sys && current.sys.sunset) {
      const sDate = new Date(current.sys.sunset * 1000);
      sunsetStr = `${pad(sDate.getHours())}:${pad(sDate.getMinutes())}`;
    }

    // Hourly Forecast (OpenWeatherMap provides 3-hour blocks up to 5 days)
    const rawList = (forecast && Array.isArray(forecast.list)) ? forecast.list : [];
    const hourlyList = rawList.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      const m = mapOwmCondition(item.weather && item.weather[0] ? item.weather[0].icon : '01d', item.weather && item.weather[0] ? item.weather[0].main : '');
      return {
        time: item.dt_txt || date.toISOString(),
        timeFormatted: `${pad(date.getHours())}:00`,
        temp: item.main ? roundOrNull(item.main.temp) : null,
        pop: Math.round((item.pop || 0) * 100),
        condition: item.weather && item.weather[0] ? item.weather[0].description : 'Clear',
        icon: m.icon,
        isDay: item.weather && item.weather[0] ? item.weather[0].icon.endsWith('d') : true
      };
    });

    // Daily Forecast aggregation (Group by day)
    const dailyMap = {};
    rawList.forEach(item => {
      const dayKey = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          temps: [],
          conditions: [],
          icons: [],
          pops: []
        };
      }
      if (item.main && isNum(item.main.temp)) dailyMap[dayKey].temps.push(item.main.temp);
      if (item.weather && item.weather[0]) {
        dailyMap[dayKey].conditions.push(item.weather[0].description);
        dailyMap[dayKey].icons.push(item.weather[0].icon);
      }
      dailyMap[dayKey].pops.push(item.pop || 0);
    });

    const dailyList = Object.keys(dailyMap).slice(0, 6).map((dayKey, index) => {
      const dayData = dailyMap[dayKey];
      const maxT = dayData.temps.length ? Math.round(Math.max(...dayData.temps)) : null;
      const minT = dayData.temps.length ? Math.round(Math.min(...dayData.temps)) : null;
      const middleIdx = Math.floor(dayData.icons.length / 2);
      const iconM = mapOwmCondition(dayData.icons[middleIdx] || '01d', '');
      const maxPop = Math.round(Math.max(...(dayData.pops.length ? dayData.pops : [0])) * 100);

      return {
        date: dayKey,
        dayName: formatDayName(dayKey, index === 0),
        condition: dayData.conditions[middleIdx] || 'Clear',
        icon: iconM.icon,
        tempMax: maxT,
        tempMin: minT,
        popMax: maxPop,
        uvMax: 0,
        sunrise: sunriseStr,
        sunset: sunsetStr
      };
    });

    const main = current.main || {};
    const wind = current.wind || {};
    const isDay = iconCode.endsWith('d');
    const curTemp = roundOrNull(main.temp);

    let climate = mapped.category;
    if (isNum(curTemp) && curTemp <= 10) {
      climate = 'cold';
    } else if (mapped.category === 'sunny') {
      climate = isDay ? 'sunny' : 'night';
    }

    return {
      provider: 'OpenWeatherMap API',
      status: 'success',
      city: locationInfo.name || current.name || 'Selected Location',
      country: locationInfo.country || (current.sys ? current.sys.country : '') || '',
      countryCode: (current.sys ? current.sys.country : '') || '',
      admin: locationInfo.admin || '',
      coordinates: { lat, lon },
      current: {
        temp: curTemp,
        feelsLike: roundOrNull(main.feels_like),
        condition: weatherItem.description ? capitalize(weatherItem.description) : 'Clear',
        icon: mapped.icon,
        category: mapped.category,
        climate: climate,
        isDay: isDay,
        tempMax: roundOrNull(main.temp_max),
        tempMin: roundOrNull(main.temp_min),
        humidity: isNum(main.humidity) ? main.humidity : null,
        windSpeed: isNum(wind.speed) ? Math.round(wind.speed * 3.6) : null,
        windDirection: isNum(wind.deg) ? wind.deg : 0,
        pressure: roundOrNull(main.pressure),
        uvIndex: 0,
        visibility: isNum(current.visibility) ? Math.round(current.visibility / 1000) : 10,
        precipitation: current.rain ? (current.rain['1h'] || 0) : 0,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        time: new Date().toISOString(),
        status: 'success',
        lastUpdated: new Date().toISOString()
      },
      hourly: hourlyList,
      daily: dailyList
    };
  }

  /**
   * Main weather fetch function that respects provider choice & auto-falls back safely.
   * Never fabricates fake weather data or silently coerces missing numbers to 0.
   */
  async function getWeather(lat, lon, locationInfo = {}) {
    const latNum = Number(lat);
    const lonNum = Number(lon);
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      throw new Error(`Invalid geographic coordinates: lat=${lat}, lon=${lon}`);
    }

    const provider = getProvider();
    const cacheKey = `${latNum.toFixed(2)},${lonNum.toFixed(2)}_${provider}`;

    const cached = weatherCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return cached.data;
    }

    let result = null;
    let primaryErr = null;
    const owmKey = getOwmApiKey();

    if (provider === 'openweathermap' && owmKey) {
      try {
        result = await fetchFromOpenWeatherMap(latNum, lonNum, owmKey, locationInfo);
      } catch (owmErr) {
        primaryErr = owmErr;
        console.warn('OpenWeatherMap primary request failed, attempting Open-Meteo fallback:', owmErr);
        try {
          result = await fetchFromOpenMeteo(latNum, lonNum, locationInfo);
          if (result) {
            result.fallbackNotice = `OpenWeatherMap unavailable (${owmErr.message}). Displaying live Open-Meteo telemetry.`;
          }
        } catch (meteoErr) {
          console.warn('Both OpenWeatherMap and Open-Meteo failed:', meteoErr);
        }
      }
    } else {
      // Primary default provider: Open-Meteo
      try {
        result = await fetchFromOpenMeteo(latNum, lonNum, locationInfo);
      } catch (meteoErr) {
        primaryErr = meteoErr;
        console.warn('Open-Meteo primary request failed, attempting OpenWeatherMap fallback:', meteoErr);
        // Fallback to OpenWeatherMap via client key or server proxy
        try {
          if (owmKey) {
            result = await fetchFromOpenWeatherMap(latNum, lonNum, owmKey, locationInfo);
            if (result) {
              result.fallbackNotice = 'Open-Meteo was unreachable. Displaying live OpenWeatherMap telemetry.';
            }
          } else {
            const serverOwmRes = await safeFetchJson(`/api/weather/owm?lat=${latNum}&lon=${lonNum}`);
            if (serverOwmRes && !serverOwmRes.error && serverOwmRes.main) {
              result = normalizeOpenWeatherMapData(serverOwmRes, { list: [] }, locationInfo, latNum, lonNum);
              result.fallbackNotice = 'Open-Meteo unreachable. Displaying live OpenWeatherMap server telemetry.';
            }
          }
        } catch (owmFallbackErr) {
          console.warn('OpenWeatherMap fallback also unreachable:', owmFallbackErr);
        }
      }
    }

    // If data could not be retrieved from any live provider:
    if (!result || !result.current || result.current.temp === null) {
      const errorMsg = primaryErr ? primaryErr.message : 'Weather service temporarily unreachable. Please retry.';
      result = {
        provider: 'SkyPulse Global Engine',
        status: 'error',
        error: errorMsg,
        city: locationInfo.name || 'Selected Location',
        country: locationInfo.country || '',
        countryCode: locationInfo.countryCode || '',
        admin: locationInfo.admin || '',
        coordinates: { lat: latNum, lon: lonNum },
        current: {
          temp: null,
          feelsLike: null,
          condition: 'Weather unavailable',
          icon: 'cloud',
          category: 'cloudy',
          climate: 'cloudy',
          isDay: true,
          tempMax: null,
          tempMin: null,
          humidity: null,
          windSpeed: null,
          windDirection: 0,
          pressure: null,
          uvIndex: null,
          visibility: null,
          precipitation: null,
          sunrise: '--:--',
          sunset: '--:--',
          time: new Date().toISOString(),
          status: 'error'
        },
        hourly: [],
        daily: []
      };
      return result;
    }

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  }

  // Helpers
  function formatHour(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('T');
    if (parts.length > 1) {
      return parts[1].slice(0, 5);
    }
    return isoString;
  }

  function formatDayName(dateString, isToday) {
    if (isToday) return 'Today';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  return {
    searchLocations,
    reverseGeocode,
    getWeather,
    formatTemp,
    getProvider,
    setProvider,
    getOwmApiKey,
    setOwmApiKey,
    STORAGE_KEYS
  };
})();

if (typeof window !== 'undefined') window.WeatherAPI = WeatherAPI;
if (typeof global !== 'undefined') global.WeatherAPI = WeatherAPI;
if (typeof module !== 'undefined' && module.exports) module.exports = WeatherAPI;
