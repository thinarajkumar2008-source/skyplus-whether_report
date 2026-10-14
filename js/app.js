/**
 * SkyPulse Weather App - Main Application Controller
 * Handles UI interactions, data binding, unit toggling, autocomplete,
 * canvas chart rendering, and API configuration.
 */

(function () {
  // Application State
  const state = {
    unit: localStorage.getItem('weather_unit') || 'C',
    weatherData: null,
    currentLocation: {
      name: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      admin: 'England',
      lat: 51.5085,
      lon: -0.1257
    },
    debounceTimer: null,
    showGraph: false,
    worldSearch: '',
    worldRegion: 'All',
    worldSort: 'name-asc'
  };

  // DOM Elements
  const elements = {
    // Icons
    brandIcon: document.getElementById('brandIcon'),
    searchIcon: document.getElementById('searchIcon'),
    geoIcon: document.getElementById('geoIcon'),
    settingsIcon: document.getElementById('settingsIcon'),
    pinIcon: document.getElementById('pinIcon'),
    heroIcon: document.getElementById('heroIcon'),
    windIcon: document.getElementById('windIcon'),
    humidityIcon: document.getElementById('humidityIcon'),
    uvIcon: document.getElementById('uvIcon'),
    pressureIcon: document.getElementById('pressureIcon'),
    visibilityIcon: document.getElementById('visibilityIcon'),
    sunCycleIcon: document.getElementById('sunCycleIcon'),

    // Search & Geolocation
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    geoBtn: document.getElementById('geoBtn'),
    suggestionsDropdown: document.getElementById('suggestionsDropdown'),
    suggestionsList: document.getElementById('suggestionsList'),
    quickChips: document.getElementById('quickChips'),

    // Banners & Status
    apiStatusBanner: document.getElementById('apiStatusBanner'),
    apiStatusText: document.getElementById('apiStatusText'),
    bannerConfigLink: document.getElementById('bannerConfigLink'),
    loadingState: document.getElementById('loadingState'),
    errorBanner: document.getElementById('errorBanner'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    mainDashboard: document.getElementById('mainDashboard'),

    // Hero Overview
    cityName: document.getElementById('cityName'),
    locationSub: document.getElementById('locationSub'),
    localTime: document.getElementById('localTime'),
    badgeCondition: document.getElementById('badgeCondition'),
    currentTemp: document.getElementById('currentTemp'),
    displayUnit: document.getElementById('displayUnit'),
    feelsLike: document.getElementById('feelsLike'),
    tempMax: document.getElementById('tempMax'),
    tempMin: document.getElementById('tempMin'),
    conditionText: document.getElementById('conditionText'),

    // Metrics
    windSpeed: document.getElementById('windSpeed'),
    windUnit: document.getElementById('windUnit'),
    windDirection: document.getElementById('windDirection'),
    humidity: document.getElementById('humidity'),
    humidityBar: document.getElementById('humidityBar'),
    humidityStatus: document.getElementById('humidityStatus'),
    uvIndex: document.getElementById('uvIndex'),
    uvBadge: document.getElementById('uvBadge'),
    uvAdvice: document.getElementById('uvAdvice'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    visUnit: document.getElementById('visUnit'),
    sunriseTime: document.getElementById('sunriseTime'),
    sunsetTime: document.getElementById('sunsetTime'),

    // Forecasts
    hourlySlider: document.getElementById('hourlySlider'),
    toggleGraphBtn: document.getElementById('toggleGraphBtn'),
    hourlyGraphContainer: document.getElementById('hourlyGraphContainer'),
    tempChart: document.getElementById('tempChart'),
    dailyList: document.getElementById('dailyList'),
    forecastProviderPill: document.getElementById('forecastProviderPill'),

    // Unit toggle
    unitButtons: document.querySelectorAll('.unit-btn'),

    // Settings Modal
    settingsBtn: document.getElementById('settingsBtn'),
    settingsModal: document.getElementById('settingsModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    providerRadios: document.querySelectorAll('input[name="apiProvider"]'),
    providerOpenMeteoOption: document.getElementById('providerOpenMeteoOption'),
    providerOwmOption: document.getElementById('providerOwmOption'),
    owmApiKeyInput: document.getElementById('owmApiKeyInput'),
    saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
    apiTestFeedback: document.getElementById('apiTestFeedback'),
    applySettingsBtn: document.getElementById('applySettingsBtn'),

    // 100 Countries Global Weather Hub Elements
    worldHubNavBtn: document.getElementById('worldHubNavBtn'),
    worldSection: document.getElementById('worldSection'),
    refreshWorldBtn: document.getElementById('refreshWorldBtn'),
    worldRefreshIcon: document.getElementById('worldRefreshIcon'),
    statWarmest: document.getElementById('statWarmest'),
    statColdest: document.getElementById('statColdest'),
    statAverage: document.getElementById('statAverage'),
    statCount: document.getElementById('statCount'),
    worldSearchInput: document.getElementById('worldSearchInput'),
    clearWorldSearchBtn: document.getElementById('clearWorldSearchBtn'),
    worldRegionChips: document.getElementById('worldRegionChips'),
    worldSortSelect: document.getElementById('worldSortSelect'),
    worldGrid: document.getElementById('worldGrid'),
    worldEmptyState: document.getElementById('worldEmptyState'),
    resetWorldFiltersBtn: document.getElementById('resetWorldFiltersBtn')
  };

  /**
   * Initialize Application
   */
  async function init() {
    renderStaticIcons();
    initUnitToggle();
    initEventListeners();
    initSettingsModal();
    initWorldWeather();

    // Check for saved location in localStorage
    const savedLoc = localStorage.getItem('sky_pulse_location');
    if (savedLoc) {
      try {
        state.currentLocation = JSON.parse(savedLoc);
      } catch (e) {
        // use default London
      }
    }

    // Load Initial Weather
    await loadWeatherData(state.currentLocation);
  }

  /**
   * Render SVG icons into UI placeholders
   */
  function renderStaticIcons() {
    elements.brandIcon.innerHTML = WeatherIcons.get('cloud-sun');
    elements.searchIcon.innerHTML = WeatherIcons.get('search');
    elements.geoIcon.innerHTML = WeatherIcons.get('crosshair');
    elements.settingsIcon.innerHTML = WeatherIcons.get('settings');
    elements.pinIcon.innerHTML = WeatherIcons.get('map-pin');
    elements.windIcon.innerHTML = WeatherIcons.get('wind');
    elements.humidityIcon.innerHTML = WeatherIcons.get('droplet');
    elements.uvIcon.innerHTML = WeatherIcons.get('sun-uv');
    elements.pressureIcon.innerHTML = WeatherIcons.get('gauge');
    elements.visibilityIcon.innerHTML = WeatherIcons.get('eye');
    elements.sunCycleIcon.innerHTML = WeatherIcons.get('sunrise');
  }

  /**
   * Fetch and display weather data
   */
  async function loadWeatherData(loc) {
    showLoading(true);
    hideError();

    try {
      const data = await WeatherAPI.getWeather(loc.lat, loc.lon, loc);
      state.weatherData = data;
      state.currentLocation = loc;
      
      // Save location
      localStorage.setItem('sky_pulse_location', JSON.stringify(loc));

      renderWeatherDashboard(data);
      updateProviderNotice(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
      showError(err.message || 'Unable to retrieve weather information. Check your internet connection or API settings.');
    } finally {
      showLoading(false);
    }
  }

  /**
   * Render the Weather Dashboard with received data
   */
  function renderWeatherDashboard(data) {
    // 1. Dynamic Theme update
    document.body.className = `theme-${data.current.category || 'cloudy'}`;

    // 2. Location & Date
    elements.cityName.textContent = data.city;
    const regionText = [data.admin, data.country].filter(Boolean).join(', ');
    elements.locationSub.textContent = regionText || 'Global Location';
    
    const now = new Date();
    elements.localTime.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // 3. Hero Card
    elements.badgeCondition.textContent = data.current.condition;
    elements.heroIcon.innerHTML = WeatherIcons.get(data.current.icon);
    elements.conditionText.textContent = data.current.condition;

    updateTemperatures();

    // 4. Detailed Metrics
    renderMetrics(data.current);

    // 5. Hourly Forecast
    renderHourlyForecast(data.hourly);

    // 6. 7-Day Forecast
    renderDailyForecast(data.daily);

    // 7. Render/Update canvas curve if visible
    if (state.showGraph) {
      drawHourlyChart(data.hourly);
    }
  }

  /**
   * Update temperature values based on current unit (°C / °F)
   */
  function updateTemperatures() {
    if (!state.weatherData) return;
    const current = state.weatherData.current;
    const unit = state.unit;

    elements.displayUnit.textContent = `°${unit}`;
    elements.currentTemp.textContent = formatTemp(current.temp);
    elements.feelsLike.textContent = `${formatTemp(current.feelsLike)}°`;
    elements.tempMax.textContent = `${formatTemp(current.tempMax)}°`;
    elements.tempMin.textContent = `${formatTemp(current.tempMin)}°`;

    // Re-render hourly & daily temps
    renderHourlyForecast(state.weatherData.hourly);
    renderDailyForecast(state.weatherData.daily);

    if (state.showGraph) {
      drawHourlyChart(state.weatherData.hourly);
    }

    // Refresh 100 countries temperatures to match unit
    renderWorldWeatherGrid();
    updateWorldStats();
  }

  /**
   * Render Weather Metrics
   */
  function renderMetrics(current) {
    // Wind
    if (state.unit === 'F') {
      const mph = Math.round(current.windSpeed * 0.621371);
      elements.windSpeed.textContent = mph;
      elements.windUnit.textContent = 'mph';
    } else {
      elements.windSpeed.textContent = current.windSpeed;
      elements.windUnit.textContent = 'km/h';
    }
    const cardinal = getWindCardinal(current.windDirection);
    elements.windDirection.textContent = `Direction: ${current.windDirection}° (${cardinal})`;

    // Humidity
    elements.humidity.textContent = current.humidity;
    elements.humidityBar.style.width = `${Math.min(100, current.humidity)}%`;
    if (current.humidity < 40) {
      elements.humidityStatus.textContent = 'Dry air conditions';
    } else if (current.humidity <= 70) {
      elements.humidityStatus.textContent = 'Comfortable humidity';
    } else {
      elements.humidityStatus.textContent = 'High moisture / Humid';
    }

    // UV Index
    const uv = current.uvIndex;
    elements.uvIndex.textContent = uv;
    if (uv <= 2) {
      elements.uvBadge.className = 'metric-tag tag-low';
      elements.uvBadge.textContent = 'Low';
      elements.uvAdvice.textContent = 'Safe for outdoor exposure';
    } else if (uv <= 5) {
      elements.uvBadge.className = 'metric-tag tag-moderate';
      elements.uvBadge.textContent = 'Moderate';
      elements.uvAdvice.textContent = 'Sun protection recommended';
    } else {
      elements.uvBadge.className = 'metric-tag tag-high';
      elements.uvBadge.textContent = 'Very High';
      elements.uvAdvice.textContent = 'Seek shade during midday';
    }

    // Air Pressure
    elements.pressure.textContent = current.pressure;

    // Visibility
    if (state.unit === 'F') {
      const mi = Math.round(current.visibility * 0.621371);
      elements.visibility.textContent = mi;
      elements.visUnit.textContent = 'mi';
    } else {
      elements.visibility.textContent = current.visibility;
      elements.visUnit.textContent = 'km';
    }

    // Sunrise & Sunset
    elements.sunriseTime.textContent = current.sunrise;
    elements.sunsetTime.textContent = current.sunset;
  }

  /**
   * Render Hourly Forecast Slider
   */
  function renderHourlyForecast(hourly) {
    elements.hourlySlider.innerHTML = '';

    if (!hourly || hourly.length === 0) {
      elements.hourlySlider.innerHTML = '<p class="metric-sub">Hourly forecast unavailable.</p>';
      return;
    }

    hourly.forEach((hour, idx) => {
      const pill = document.createElement('div');
      pill.className = `hour-pill ${idx === 0 ? 'is-current' : ''}`;
      
      const popHtml = hour.pop > 0 
        ? `<span class="hour-pop">${WeatherIcons.get('droplet')} ${hour.pop}%</span>`
        : '';

      pill.innerHTML = `
        <span class="hour-time">${idx === 0 ? 'Now' : hour.timeFormatted}</span>
        <div class="hour-icon">${WeatherIcons.get(hour.icon)}</div>
        <span class="hour-temp">${formatTemp(hour.temp)}°</span>
        ${popHtml}
      `;

      elements.hourlySlider.appendChild(pill);
    });
  }

  /**
   * Render 7-Day Forecast Rows
   */
  function renderDailyForecast(daily) {
    elements.dailyList.innerHTML = '';

    if (!daily || daily.length === 0) {
      elements.dailyList.innerHTML = '<p class="metric-sub">Daily forecast unavailable.</p>';
      return;
    }

    daily.forEach(day => {
      const row = document.createElement('div');
      row.className = 'daily-item';
      
      row.innerHTML = `
        <span class="daily-day">${day.dayName}</span>
        <div class="daily-icon">${WeatherIcons.get(day.icon)}</div>
        <span class="daily-condition" title="${day.condition}">${day.condition}</span>
        <div class="daily-temps">
          <span class="temp-hi">${formatTemp(day.tempMax)}°</span>
          <span class="temp-lo">${formatTemp(day.tempMin)}°</span>
        </div>
      `;

      elements.dailyList.appendChild(row);
    });
  }

  /**
   * Draw Temperature Curve on Canvas
   */
  function drawHourlyChart(hourly) {
    const canvas = elements.tempChart;
    if (!canvas || !hourly || hourly.length === 0) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width || 600) * dpr;
    canvas.height = 110 * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = rect.width || 600;
    const height = 110;
    ctx.clearRect(0, 0, width, height);

    const pointsCount = Math.min(12, hourly.length);
    const temps = hourly.slice(0, pointsCount).map(h => formatTemp(h.temp));
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;
    const range = maxTemp - minTemp || 1;

    const paddingX = 30;
    const paddingY = 24;
    const graphWidth = width - (paddingX * 2);
    const graphHeight = height - (paddingY * 2);

    const stepX = graphWidth / (pointsCount - 1);
    const coordinates = temps.map((t, i) => {
      const x = paddingX + (i * stepX);
      const y = paddingY + graphHeight - ((t - minTemp) / range * graphHeight);
      return { x, y, temp: t, time: hourly[i].timeFormatted };
    });

    // Draw Smooth Curve
    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].y);
    for (let i = 0; i < coordinates.length - 1; i++) {
      const xc = (coordinates[i].x + coordinates[i + 1].x) / 2;
      const yc = (coordinates[i].y + coordinates[i + 1].y) / 2;
      ctx.quadraticCurveTo(coordinates[i].x, coordinates[i].y, xc, yc);
    }
    ctx.lineTo(coordinates[coordinates.length - 1].x, coordinates[coordinates.length - 1].y);

    // Line Stroke
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Area Fill
    ctx.lineTo(coordinates[coordinates.length - 1].x, height);
    ctx.lineTo(coordinates[0].x, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Points & Labels
    coordinates.forEach(pt => {
      // Circle Dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Temperature text
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.temp}°`, pt.x, pt.y - 8);
    });
  }

  /**
   * Helper: Format temperature based on unit
   */
  function formatTemp(celsius) {
    if (state.unit === 'F') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  }

  /**
   * Helper: Convert degrees to compass cardinal
   */
  function getWindCardinal(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5);
    return directions[index % 16];
  }

  /**
   * Unit Switcher Initialization
   */
  function initUnitToggle() {
    elements.unitButtons.forEach(btn => {
      if (btn.dataset.unit === state.unit) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.addEventListener('click', () => {
        elements.unitButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.unit = btn.dataset.unit;
        localStorage.setItem('weather_unit', state.unit);
        updateTemperatures();
        if (state.weatherData) {
          renderMetrics(state.weatherData.current);
        }
      });
    });
  }

  /**
   * Event Listeners (Search, Geolocation, Chips, Modals)
   */
  function initEventListeners() {
    // Autocomplete Search Input
    elements.searchInput.addEventListener('input', e => {
      const val = e.target.value.trim();
      elements.clearSearchBtn.classList.toggle('hidden', val.length === 0);

      clearTimeout(state.debounceTimer);
      if (val.length < 2) {
        hideSuggestions();
        return;
      }

      state.debounceTimer = setTimeout(() => {
        handleSearchAutocomplete(val);
      }, 280);
    });

    // Clear search
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.clearSearchBtn.classList.add('hidden');
      hideSuggestions();
      elements.searchInput.focus();
    });

    // Search on Enter key
    elements.searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const query = elements.searchInput.value.trim();
        if (query) {
          searchAndSelectFirst(query);
          hideSuggestions();
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
      }
    });

    // Click outside to hide suggestions
    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrapper')) {
        hideSuggestions();
      }
    });

    // Geolocation button
    elements.geoBtn.addEventListener('click', handleCurrentLocation);

    // Quick City Chips
    elements.quickChips.addEventListener('click', e => {
      const chip = e.target.closest('.city-chip');
      if (chip) {
        const cityName = chip.dataset.city;
        searchAndSelectFirst(cityName);
      }
    });

    // Toggle Hourly Graph
    elements.toggleGraphBtn.addEventListener('click', () => {
      state.showGraph = !state.showGraph;
      elements.hourlyGraphContainer.classList.toggle('hidden', !state.showGraph);
      elements.toggleGraphBtn.textContent = state.showGraph ? 'Hide Curve' : 'View Curve';
      if (state.showGraph && state.weatherData) {
        setTimeout(() => drawHourlyChart(state.weatherData.hourly), 50);
      }
    });

    // Retry Button
    elements.retryBtn.addEventListener('click', () => {
      loadWeatherData(state.currentLocation);
    });

    // Banner config link
    elements.bannerConfigLink.addEventListener('click', openSettingsModal);

    // Resize listener for graph canvas
    window.addEventListener('resize', () => {
      if (state.showGraph && state.weatherData) {
        drawHourlyChart(state.weatherData.hourly);
      }
    });

    // 100 Countries Navigation Jump Button
    if (elements.worldHubNavBtn && elements.worldSection) {
      elements.worldHubNavBtn.addEventListener('click', () => {
        elements.worldSection.scrollIntoView({ behavior: 'smooth' });
        elements.worldSection.style.borderColor = 'var(--accent-cyan)';
        setTimeout(() => {
          elements.worldSection.style.borderColor = '';
        }, 1500);
      });
    }

    // Refresh 100 Countries Live Weather
    if (elements.refreshWorldBtn) {
      elements.refreshWorldBtn.addEventListener('click', async () => {
        elements.refreshWorldBtn.classList.add('syncing');
        elements.refreshWorldBtn.disabled = true;
        try {
          await WorldWeather.fetchLiveBatch();
          renderWorldWeatherGrid();
          updateWorldStats();
        } catch (e) {
          console.warn('World weather refresh failed:', e);
        } finally {
          elements.refreshWorldBtn.classList.remove('syncing');
          elements.refreshWorldBtn.disabled = false;
        }
      });
    }

    // 100 Countries Search Input
    if (elements.worldSearchInput) {
      elements.worldSearchInput.addEventListener('input', e => {
        const val = e.target.value;
        state.worldSearch = val;
        elements.clearWorldSearchBtn.classList.toggle('hidden', val.trim().length === 0);
        renderWorldWeatherGrid();
      });
    }

    // Clear 100 Countries Search
    if (elements.clearWorldSearchBtn) {
      elements.clearWorldSearchBtn.addEventListener('click', () => {
        elements.worldSearchInput.value = '';
        state.worldSearch = '';
        elements.clearWorldSearchBtn.classList.add('hidden');
        renderWorldWeatherGrid();
        elements.worldSearchInput.focus();
      });
    }

    // 100 Countries Region Filter Pills
    if (elements.worldRegionChips) {
      elements.worldRegionChips.addEventListener('click', e => {
        const chip = e.target.closest('.region-chip');
        if (chip) {
          elements.worldRegionChips.querySelectorAll('.region-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          state.worldRegion = chip.dataset.region || 'All';
          renderWorldWeatherGrid();
        }
      });
    }

    // 100 Countries Sort Selector
    if (elements.worldSortSelect) {
      elements.worldSortSelect.addEventListener('change', e => {
        state.worldSort = e.target.value;
        renderWorldWeatherGrid();
      });
    }

    // Reset Filters Button
    if (elements.resetWorldFiltersBtn) {
      elements.resetWorldFiltersBtn.addEventListener('click', () => {
        state.worldSearch = '';
        state.worldRegion = 'All';
        elements.worldSearchInput.value = '';
        elements.clearWorldSearchBtn.classList.add('hidden');
        elements.worldRegionChips.querySelectorAll('.region-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.region === 'All');
        });
        renderWorldWeatherGrid();
      });
    }
  }

  /**
   * Autocomplete search handler
   */
  async function handleSearchAutocomplete(query) {
    try {
      const results = await WeatherAPI.searchLocations(query);
      if (results.length === 0) {
        hideSuggestions();
        return;
      }

      elements.suggestionsList.innerHTML = '';
      results.forEach(loc => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        
        li.innerHTML = `
          <div>
            <span class="suggestion-city">${loc.name}</span>
            <span class="suggestion-region">${loc.admin ? loc.admin + ', ' : ''}${loc.country}</span>
          </div>
          ${loc.countryCode ? `<span class="suggestion-country">${loc.countryCode}</span>` : ''}
        `;

        li.addEventListener('click', () => {
          elements.searchInput.value = `${loc.name}, ${loc.countryCode || loc.country}`;
          hideSuggestions();
          loadWeatherData(loc);
        });

        elements.suggestionsList.appendChild(li);
      });

      elements.suggestionsDropdown.classList.remove('hidden');
    } catch (err) {
      console.warn('Search autocomplete error:', err);
      hideSuggestions();
    }
  }

  function hideSuggestions() {
    elements.suggestionsDropdown.classList.add('hidden');
  }

  /**
   * Search and automatically select the top matching result
   */
  async function searchAndSelectFirst(query) {
    showLoading(true);
    try {
      const results = await WeatherAPI.searchLocations(query);
      if (results && results.length > 0) {
        const topResult = results[0];
        elements.searchInput.value = `${topResult.name}, ${topResult.countryCode || topResult.country}`;
        await loadWeatherData(topResult);
      } else {
        showError(`No locations found for "${query}". Please check spelling.`);
      }
    } catch (err) {
      showError(`Search error: ${err.message}`);
    } finally {
      showLoading(false);
    }
  }

  /**
   * Geolocation Handler
   */
  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }

    showLoading(true);
    elements.geoBtn.classList.add('locating');

    navigator.geolocation.getCurrentPosition(
      async position => {
        elements.geoBtn.classList.remove('locating');
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Reverse geocode to find city name
          const rev = await WeatherAPI.reverseGeocode(lat, lon);
          const location = {
            name: rev.name,
            country: rev.country,
            countryCode: rev.countryCode,
            admin: rev.admin,
            lat: lat,
            lon: lon
          };
          elements.searchInput.value = location.name;
          await loadWeatherData(location);
        } catch (err) {
          await loadWeatherData({ name: 'My Location', country: '', lat, lon });
        } finally {
          showLoading(false);
        }
      },
      error => {
        elements.geoBtn.classList.remove('locating');
        showLoading(false);
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please allow location access or search by city name.';
        }
        showError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  /**
   * Settings Modal Initialization
   */
  function initSettingsModal() {
    elements.settingsBtn.addEventListener('click', openSettingsModal);
    elements.closeModalBtn.addEventListener('click', closeSettingsModal);
    
    // Close on clicking backdrop
    elements.settingsModal.addEventListener('click', e => {
      if (e.target === elements.settingsModal) closeSettingsModal();
    });

    // Provider radio switches
    elements.providerRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        updateModalProviderUI(radio.value);
      });
    });

    // Save OpenWeatherMap API Key
    elements.saveApiKeyBtn.addEventListener('click', () => {
      const key = elements.owmApiKeyInput.value.trim();
      WeatherAPI.setOwmApiKey(key);
      showTestFeedback('OpenWeatherMap API Key saved successfully!', 'success');
    });

    // Apply & Refresh
    elements.applySettingsBtn.addEventListener('click', async () => {
      const selected = document.querySelector('input[name="apiProvider"]:checked').value;
      WeatherAPI.setProvider(selected);

      if (selected === 'openweathermap') {
        const key = elements.owmApiKeyInput.value.trim();
        WeatherAPI.setOwmApiKey(key);
      }

      closeSettingsModal();
      await loadWeatherData(state.currentLocation);
    });
  }

  function openSettingsModal() {
    const currentProvider = WeatherAPI.getProvider();
    const currentKey = WeatherAPI.getOwmApiKey();

    elements.owmApiKeyInput.value = currentKey;
    elements.providerRadios.forEach(r => {
      r.checked = (r.value === currentProvider);
    });

    updateModalProviderUI(currentProvider);
    elements.apiTestFeedback.className = 'test-feedback hidden';
    elements.settingsModal.classList.remove('hidden');
  }

  function closeSettingsModal() {
    elements.settingsModal.classList.add('hidden');
  }

  function updateModalProviderUI(provider) {
    if (provider === 'open-meteo') {
      elements.providerOpenMeteoOption.classList.add('active');
      elements.providerOwmOption.classList.remove('active');
    } else {
      elements.providerOpenMeteoOption.classList.remove('active');
      elements.providerOwmOption.classList.add('active');
    }
  }

  function showTestFeedback(msg, type) {
    elements.apiTestFeedback.textContent = msg;
    elements.apiTestFeedback.className = `test-feedback ${type}`;
    elements.apiTestFeedback.classList.remove('hidden');
  }

  function updateProviderNotice(data) {
    if (data.fallbackNotice) {
      elements.apiStatusText.textContent = data.fallbackNotice;
      elements.apiStatusBanner.style.background = 'rgba(245, 158, 11, 0.15)';
      elements.apiStatusBanner.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    } else {
      elements.apiStatusText.textContent = `Connected to ${data.provider}`;
      elements.apiStatusBanner.style.background = 'rgba(56, 189, 248, 0.08)';
      elements.apiStatusBanner.style.borderColor = 'rgba(56, 189, 248, 0.2)';
    }
    elements.forecastProviderPill.textContent = WeatherAPI.getProvider() === 'openweathermap' ? 'OWM Forecast' : 'Open-Meteo 7-Day';
  }

  function showLoading(show) {
    elements.loadingState.classList.toggle('hidden', !show);
    elements.mainDashboard.style.opacity = show ? '0.4' : '1';
    elements.mainDashboard.style.pointerEvents = show ? 'none' : 'auto';
  }

  function showError(msg) {
    elements.errorMessage.textContent = msg;
    elements.errorBanner.classList.remove('hidden');
  }

  function hideError() {
    elements.errorBanner.classList.add('hidden');
  }

  /**
   * Initialize 100 Countries Global Hub
   */
  async function initWorldWeather() {
    if (typeof WorldWeather === 'undefined') return;

    renderWorldWeatherGrid();
    updateWorldStats();

    // Trigger non-blocking background live sync
    setTimeout(async () => {
      try {
        await WorldWeather.fetchLiveBatch();
        renderWorldWeatherGrid();
        updateWorldStats();
      } catch (err) {
        console.warn('Background world weather sync noticed:', err);
      }
    }, 1500);
  }

  /**
   * Render the 100 Countries Grid
   */
  function renderWorldWeatherGrid() {
    if (!elements.worldGrid || typeof WorldWeather === 'undefined') return;

    const list = WorldWeather.filterAndSort(state.worldSearch, state.worldRegion, state.worldSort);
    elements.worldGrid.innerHTML = '';

    if (list.length === 0) {
      if (elements.worldEmptyState) elements.worldEmptyState.classList.remove('hidden');
      return;
    }
    if (elements.worldEmptyState) elements.worldEmptyState.classList.add('hidden');

    const fragment = document.createDocumentFragment();

    list.forEach(c => {
      const card = document.createElement('div');
      card.className = 'country-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('title', `Click to load full weather for ${c.city}, ${c.country}`);

      const formattedTemp = formatTemp(c.temp);
      const formattedWind = state.unit === 'F'
        ? `${Math.round(c.wind * 0.621371)} mph`
        : `${c.wind} km/h`;

      const iconSvg = typeof WeatherIcons !== 'undefined' ? WeatherIcons.get(c.icon) : '';

      card.innerHTML = `
        <div class="country-card-top">
          <div class="country-identity">
            <span class="country-flag-icon">${c.flag}</span>
            <div class="country-names">
              <span class="country-name-txt">${c.country}</span>
              <span class="country-city-txt">${c.city}</span>
            </div>
          </div>
          <span class="country-region-tag">${c.region}</span>
        </div>
        <div class="country-weather-middle">
          <div class="country-temp-display">
            <span class="country-temp-num">${formattedTemp}</span>
            <span class="country-temp-deg">°${state.unit}</span>
          </div>
          <div class="country-icon-holder">${iconSvg}</div>
        </div>
        <div class="country-cond-txt" title="${c.condition}">${c.condition}</div>
        <div class="country-card-bottom">
          <span class="country-stat-item">💧 ${c.humidity}%</span>
          <span class="country-stat-item">💨 ${formattedWind}</span>
          <span class="country-click-hint">View Forecast →</span>
        </div>
      `;

      card.addEventListener('click', () => {
        const location = {
          name: `${c.city}, ${c.country}`,
          country: c.country,
          countryCode: c.code,
          admin: c.city,
          lat: c.lat,
          lon: c.lon
        };
        elements.searchInput.value = `${c.city}, ${c.country}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadWeatherData(location);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });

      fragment.appendChild(card);
    });

    elements.worldGrid.appendChild(fragment);
  }

  /**
   * Update Global Stats Overview Cards
   */
  function updateWorldStats() {
    if (typeof WorldWeather === 'undefined') return;
    const stats = WorldWeather.getStats();
    if (!stats) return;

    if (elements.statWarmest) {
      elements.statWarmest.textContent = `${stats.warmest.flag} ${stats.warmest.city} (${formatTemp(stats.warmest.temp)}°${state.unit})`;
    }
    if (elements.statColdest) {
      elements.statColdest.textContent = `${stats.coldest.flag} ${stats.coldest.city} (${formatTemp(stats.coldest.temp)}°${state.unit})`;
    }
    if (elements.statAverage) {
      elements.statAverage.textContent = `${formatTemp(stats.average)}°${state.unit} Global Avg`;
    }
    if (elements.statCount) {
      elements.statCount.textContent = `${stats.totalCount} Nations`;
    }
  }

  // Start application on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
