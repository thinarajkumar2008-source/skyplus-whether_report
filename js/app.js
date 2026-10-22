/**
 * SkyPulse 2.0 - Main Application Controller
 * Design Direction: Atmospheric Aurora
 * High-performance meteorological dashboard, canvas atmospheric simulator,
 * weather intelligence storytelling, 7-day expandable forecast with range bars,
 * 100-country surveillance hub with interactive Leaflet map, favorites, and comparison.
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
    favorites: loadFavorites(),
    debounceTimer: null,
    showGraph: false,
    viewMode: 'grid', // 'grid' | 'map'
    worldSearch: '',
    worldRegion: 'All',
    worldSort: 'name-asc',
    worldType: 'All', // 'All' | 'sovereign' | 'territory'
    activeAuthView: 'signIn',
    leafletMap: null,
    mapMarkers: [],
    compareCities: ['London', 'Tokyo', 'New York']
  };

  // DOM Elements Cache
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
    sparkleIcon: document.getElementById('sparkleIcon'),
    compareNavIcon: document.getElementById('compareNavIcon'),
    compareModalIcon: document.getElementById('compareModalIcon'),
    gridIcon: document.getElementById('gridIcon'),
    mapIcon: document.getElementById('mapIcon'),
    favStarIcon: document.getElementById('favStarIcon'),
    favCityBtn: document.getElementById('favCityBtn'),

    // Intelligence icons
    intelUmbrellaIcon: document.getElementById('intelUmbrellaIcon'),
    intelOutdoorIcon: document.getElementById('intelOutdoorIcon'),
    intelWindIcon: document.getElementById('intelWindIcon'),
    intelTrendIcon: document.getElementById('intelTrendIcon'),

    // Search & Geolocation
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    geoBtn: document.getElementById('geoBtn'),
    suggestionsDropdown: document.getElementById('suggestionsDropdown'),
    suggestionsList: document.getElementById('suggestionsList'),
    quickChips: document.getElementById('quickChips'),
    favoritesChips: document.getElementById('favoritesChips'),

    // Banners & Status
    apiStatusBanner: document.getElementById('apiStatusBanner'),
    apiStatusText: document.getElementById('apiStatusText'),
    bannerConfigLink: document.getElementById('bannerConfigLink'),
    loadingState: document.getElementById('loadingState'),
    weatherLoaderWrapper: document.getElementById('weatherLoaderWrapper'),
    weatherLoaderSymbol: document.getElementById('weatherLoaderSymbol'),
    weatherLoaderHalo: document.getElementById('weatherLoaderHalo'),
    loadingTitle: document.getElementById('loadingTitle'),
    loadingSubtext: document.getElementById('loadingSubtext'),
    errorBanner: document.getElementById('errorBanner'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    mainDashboard: document.getElementById('mainDashboard'),

    // Hero Overview
    cityName: document.getElementById('cityName'),
    locationSub: document.getElementById('locationSub'),
    localTime: document.getElementById('localTime'),
    badgeCondition: document.getElementById('badgeCondition'),
    weatherMoodBadge: document.getElementById('weatherMoodBadge'),
    moodText: document.getElementById('moodText'),
    currentTemp: document.getElementById('currentTemp'),
    displayUnit: document.getElementById('displayUnit'),
    feelsLike: document.getElementById('feelsLike'),
    tempMax: document.getElementById('tempMax'),
    tempMin: document.getElementById('tempMin'),
    conditionText: document.getElementById('conditionText'),
    updateTimestamp: document.getElementById('updateTimestamp'),

    // Weather Intelligence & Storytelling
    narrativeText: document.getElementById('narrativeText'),
    umbrellaStatus: document.getElementById('umbrellaStatus'),
    umbrellaDesc: document.getElementById('umbrellaDesc'),
    outdoorStatus: document.getElementById('outdoorStatus'),
    outdoorDesc: document.getElementById('outdoorDesc'),
    windStatus: document.getElementById('windStatus'),
    windDesc: document.getElementById('windDesc'),
    trendStatus: document.getElementById('trendStatus'),
    trendDesc: document.getElementById('trendDesc'),

    // Detailed Metrics
    windSpeed: document.getElementById('windSpeed'),
    windUnit: document.getElementById('windUnit'),
    windDirection: document.getElementById('windDirection'),
    compassNeedle: document.getElementById('compassNeedle'),
    humidity: document.getElementById('humidity'),
    humidityBar: document.getElementById('humidityBar'),
    humidityStatus: document.getElementById('humidityStatus'),
    uvIndex: document.getElementById('uvIndex'),
    uvBadge: document.getElementById('uvBadge'),
    uvAdvice: document.getElementById('uvAdvice'),
    pressure: document.getElementById('pressure'),
    pressureTrend: document.getElementById('pressureTrend'),
    visibility: document.getElementById('visibility'),
    visUnit: document.getElementById('visUnit'),
    visStatus: document.getElementById('visStatus'),
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

    // Comparison Modal
    compareNavBtn: document.getElementById('compareNavBtn'),
    compareModal: document.getElementById('compareModal'),
    closeCompareBtn: document.getElementById('closeCompareBtn'),
    compareSelect1: document.getElementById('compareSelect1'),
    compareSelect2: document.getElementById('compareSelect2'),
    compareSelect3: document.getElementById('compareSelect3'),
    compareTableContainer: document.getElementById('compareTableContainer'),

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

    // Worldwide Countries Global Weather Hub
    worldHubNavBtn: document.getElementById('worldHubNavBtn'),
    worldSection: document.getElementById('worldSection'),
    viewGridBtn: document.getElementById('viewGridBtn'),
    viewMapBtn: document.getElementById('viewMapBtn'),
    worldMapWrapper: document.getElementById('worldMapWrapper'),
    worldWeatherMap: document.getElementById('worldWeatherMap'),
    refreshWorldBtn: document.getElementById('refreshWorldBtn'),
    worldRefreshIcon: document.getElementById('worldRefreshIcon'),
    worldSyncBtnText: document.getElementById('worldSyncBtnText'),
    statWarmest: document.getElementById('statWarmest'),
    statColdest: document.getElementById('statColdest'),
    statAverage: document.getElementById('statAverage'),
    statCount: document.getElementById('statCount'),
    distBarTrack: document.getElementById('distBarTrack'),
    distLegend: document.getElementById('distLegend'),
    worldSearchInput: document.getElementById('worldSearchInput'),
    clearWorldSearchBtn: document.getElementById('clearWorldSearchBtn'),
    worldRegionChips: document.getElementById('worldRegionChips'),
    worldTypeSelect: document.getElementById('worldTypeSelect'),
    worldSortSelect: document.getElementById('worldSortSelect'),
    worldGrid: document.getElementById('worldGrid'),
    worldEmptyState: document.getElementById('worldEmptyState'),
    resetWorldFiltersBtn: document.getElementById('resetWorldFiltersBtn'),
    progStatusBar: document.getElementById('progStatusBar'),
    progStatusText: document.getElementById('progStatusText'),
    fetchMoreBtn: document.getElementById('fetchMoreBtn'),

    // Canvas & Dynamic Climate Backdrop
    atmosphereCanvas: document.getElementById('atmosphereCanvas'),
    backdropLayerA: document.getElementById('backdropLayerA'),
    backdropLayerB: document.getElementById('backdropLayerB'),

    // User Authentication & Header Dropdown
    userAuthWrap: document.getElementById('userAuthWrap'),
    authNavBtn: document.getElementById('authNavBtn'),
    authNavIcon: document.getElementById('authNavIcon'),
    authNavText: document.getElementById('authNavText'),
    userDropdownMenu: document.getElementById('userDropdownMenu'),
    userAvatarSmall: document.getElementById('userAvatarSmall'),
    userHeaderName: document.getElementById('userHeaderName'),
    userHeaderEmail: document.getElementById('userHeaderEmail'),
    dropAccountBtn: document.getElementById('dropAccountBtn'),
    dropFavoritesBtn: document.getElementById('dropFavoritesBtn'),
    dropFavCount: document.getElementById('dropFavCount'),
    dropSignOutBtn: document.getElementById('dropSignOutBtn'),

    // Split-Screen Authentication Modal
    authModal: document.getElementById('authModal'),
    closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
    authFeedback: document.getElementById('authFeedback'),
    viewSignIn: document.getElementById('viewSignIn'),
    viewSignUp: document.getElementById('viewSignUp'),
    viewForgot: document.getElementById('viewForgot'),
    viewAccount: document.getElementById('viewAccount'),

    // Auth Hero Live Preview
    authHeroWeather: document.getElementById('authHeroWeather'),
    authHeroIcon: document.getElementById('authHeroIcon'),
    authPreviewCity: document.getElementById('authPreviewCity'),
    authPreviewCond: document.getElementById('authPreviewCond'),
    authPreviewTemp: document.getElementById('authPreviewTemp'),

    // Sign In Form Elements
    signInForm: document.getElementById('signInForm'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    loginRememberMe: document.getElementById('loginRememberMe'),
    toggleLoginPwd: document.getElementById('toggleLoginPwd'),
    signInSubmitBtn: document.getElementById('signInSubmitBtn'),
    guestContinueBtn: document.getElementById('guestContinueBtn'),
    toForgotBtn: document.getElementById('toForgotBtn'),
    toSignUpBtn: document.getElementById('toSignUpBtn'),

    // Registration (Sign Up) Form Elements
    signUpForm: document.getElementById('signUpForm'),
    regName: document.getElementById('regName'),
    regEmail: document.getElementById('regEmail'),
    regPassword: document.getElementById('regPassword'),
    toggleRegPwd: document.getElementById('toggleRegPwd'),
    pwdStrengthBar: document.getElementById('pwdStrengthBar'),
    pwdStrengthText: document.getElementById('pwdStrengthText'),
    regConfirmPassword: document.getElementById('regConfirmPassword'),
    regTerms: document.getElementById('regTerms'),
    signUpSubmitBtn: document.getElementById('signUpSubmitBtn'),
    guestContinueRegBtn: document.getElementById('guestContinueRegBtn'),
    toSignInFromRegBtn: document.getElementById('toSignInFromRegBtn'),

    // Password Recovery Form Elements
    forgotForm: document.getElementById('forgotForm'),
    forgotEmail: document.getElementById('forgotEmail'),
    forgotSubmitBtn: document.getElementById('forgotSubmitBtn'),
    resetTokenBox: document.getElementById('resetTokenBox'),
    resetTokenInput: document.getElementById('resetTokenInput'),
    resetNewPwd: document.getElementById('resetNewPwd'),
    applyNewPwdBtn: document.getElementById('applyNewPwdBtn'),
    toSignInFromForgotBtn: document.getElementById('toSignInFromForgotBtn'),

    // Account Profile & Preferences Elements
    accountAvatarLarge: document.getElementById('accountAvatarLarge'),
    accountUserName: document.getElementById('accountUserName'),
    accountUserEmail: document.getElementById('accountUserEmail'),
    accountAuthTag: document.getElementById('accountAuthTag'),
    accountDefaultCity: document.getElementById('accountDefaultCity'),
    accountPrefUnit: document.getElementById('accountPrefUnit'),
    accountFavCount: document.getElementById('accountFavCount'),
    accountFavsList: document.getElementById('accountFavsList'),
    toggleCloudSyncBtn: document.getElementById('toggleCloudSyncBtn'),
    cloudChevron: document.getElementById('cloudChevron'),
    cloudSyncDrawer: document.getElementById('cloudSyncDrawer'),
    sbUrlInput: document.getElementById('sbUrlInput'),
    sbKeyInput: document.getElementById('sbKeyInput'),
    saveSupabaseConfigBtn: document.getElementById('saveSupabaseConfigBtn'),
    saveAccountPrefsBtn: document.getElementById('saveAccountPrefsBtn'),
    accountSignOutBtn: document.getElementById('accountSignOutBtn')
  };

  /**
   * Application Initialization
   */
  async function init() {
    renderStaticIcons();
    initUnitToggle();
    initAtmosphericSimulator();
    renderFavorites();
    initEventListeners();
    initSettingsModal();
    initComparisonModal();
    initWorldWeather();
    initAuth();
    preloadClimateImages();

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
    if (elements.brandIcon) elements.brandIcon.innerHTML = WeatherIcons.get('cloud-sun');
    if (elements.searchIcon) elements.searchIcon.innerHTML = WeatherIcons.get('search');
    if (elements.geoIcon) elements.geoIcon.innerHTML = WeatherIcons.get('crosshair');
    if (elements.settingsIcon) elements.settingsIcon.innerHTML = WeatherIcons.get('settings');
    if (elements.pinIcon) elements.pinIcon.innerHTML = WeatherIcons.get('map-pin');
    if (elements.favStarIcon) elements.favStarIcon.innerHTML = WeatherIcons.get('star');
    if (elements.windIcon) elements.windIcon.innerHTML = WeatherIcons.get('wind');
    if (elements.humidityIcon) elements.humidityIcon.innerHTML = WeatherIcons.get('droplet');
    if (elements.uvIcon) elements.uvIcon.innerHTML = WeatherIcons.get('sun-uv');
    if (elements.pressureIcon) elements.pressureIcon.innerHTML = WeatherIcons.get('gauge');
    if (elements.visibilityIcon) elements.visibilityIcon.innerHTML = WeatherIcons.get('eye');
    if (elements.sunCycleIcon) elements.sunCycleIcon.innerHTML = WeatherIcons.get('sunrise');
    if (elements.sparkleIcon) elements.sparkleIcon.innerHTML = WeatherIcons.get('sparkles');
    if (elements.compareNavIcon) elements.compareNavIcon.innerHTML = WeatherIcons.get('compare');
    if (elements.compareModalIcon) elements.compareModalIcon.innerHTML = WeatherIcons.get('compare');
    if (elements.gridIcon) elements.gridIcon.innerHTML = WeatherIcons.get('grid');
    if (elements.mapIcon) elements.mapIcon.innerHTML = WeatherIcons.get('map');

    // Intelligence icons
    if (elements.intelUmbrellaIcon) elements.intelUmbrellaIcon.innerHTML = WeatherIcons.get('umbrella');
    if (elements.intelOutdoorIcon) elements.intelOutdoorIcon.innerHTML = WeatherIcons.get('activity');
    if (elements.intelWindIcon) elements.intelWindIcon.innerHTML = WeatherIcons.get('wind');
    if (elements.intelTrendIcon) elements.intelTrendIcon.innerHTML = WeatherIcons.get('thermometer');

    // Authentication icons
    if (elements.authNavIcon) elements.authNavIcon.innerHTML = WeatherIcons.get('user');
    const loginMail = document.getElementById('loginMailIcon');
    if (loginMail) loginMail.innerHTML = WeatherIcons.get('mail');
    const loginLock = document.getElementById('loginLockIcon');
    if (loginLock) loginLock.innerHTML = WeatherIcons.get('lock');
    const regUser = document.getElementById('regUserIcon');
    if (regUser) regUser.innerHTML = WeatherIcons.get('user');
    const regMail = document.getElementById('regMailIcon');
    if (regMail) regMail.innerHTML = WeatherIcons.get('mail');
    const regLock = document.getElementById('regLockIcon');
    if (regLock) regLock.innerHTML = WeatherIcons.get('lock');
    const regConfirmLock = document.getElementById('regConfirmLockIcon');
    if (regConfirmLock) regConfirmLock.innerHTML = WeatherIcons.get('lock');
    const forgotMail = document.getElementById('forgotMailIcon');
    if (forgotMail) forgotMail.innerHTML = WeatherIcons.get('mail');
  }

  /**
   * Living Atmospheric Canvas Simulator
   * Generates dynamic particle atmosphere matching real weather state.
   */
  function initAtmosphericSimulator() {
    const canvas = elements.atmosphereCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 45;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = Math.random() * 0.6 + 0.2;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.alphaSpeed = Math.random() * 0.01 + 0.005;
      }
      update(category) {
        if (category === 'rainy' || category === 'stormy') {
          this.y += 6 + this.size * 2;
          this.x += 1.2;
          if (this.y > height) {
            this.y = -10;
            this.x = Math.random() * width;
          }
        } else if (category === 'snowy') {
          this.y += 0.8 + this.size * 0.3;
          this.x += Math.sin(this.y * 0.02) * 0.8;
          if (this.y > height) {
            this.y = -10;
            this.x = Math.random() * width;
          }
        } else {
          // Sunny / Night / Cloudy gentle motes
          this.x += this.vx;
          this.y += this.vy * 0.4;
          this.alpha += this.alphaSpeed;
          if (this.alpha > 0.7 || this.alpha < 0.15) {
            this.alphaSpeed = -this.alphaSpeed;
          }
          if (this.x < 0 || this.x > width || this.y > height) {
            this.reset();
            this.y = -5;
          }
        }
      }
      draw(category) {
        ctx.save();
        ctx.beginPath();
        if (category === 'rainy' || category === 'stormy') {
          ctx.strokeStyle = `rgba(53, 215, 255, ${this.alpha * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + 2, this.y + 12);
          ctx.stroke();
        } else if (category === 'snowy') {
          ctx.fillStyle = `rgba(226, 238, 255, ${this.alpha * 0.85})`;
          ctx.arc(this.x, this.y, this.size * 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (category === 'sunny') {
          ctx.fillStyle = `rgba(251, 191, 36, ${this.alpha * 0.5})`;
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Night stars / Aurora motes
          ctx.fillStyle = `rgba(186, 230, 253, ${this.alpha * 0.6})`;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const category = state.weatherData && state.weatherData.current 
        ? state.weatherData.current.category 
        : 'sunny';

      for (let p of particles) {
        p.update(category);
        p.draw(category);
      }
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /**
   * Favorites Persistence
   */
  function loadFavorites() {
    try {
      const saved = localStorage.getItem('sky_pulse_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['London, UK', 'Tokyo, Japan', 'New York, USA'];
  }

  function saveFavorites() {
    try {
      localStorage.setItem('sky_pulse_favorites', JSON.stringify(state.favorites));
    } catch (e) {}
    if (typeof SkyPulseAuth !== 'undefined' && SkyPulseAuth.isAuthenticated()) {
      SkyPulseAuth.updateProfile({ favorites: state.favorites });
    }
    renderFavorites();
    updateFavoriteButtonState();
    updateAuthProfileFavs();
  }

  function toggleCurrentFavorite() {
    const locName = elements.cityName.textContent;
    const country = elements.locationSub.textContent;
    const fullKey = `${locName}, ${country}`.trim();

    const idx = state.favorites.findIndex(f => f.toLowerCase() === fullKey.toLowerCase() || f.toLowerCase().includes(locName.toLowerCase()));
    if (idx >= 0) {
      state.favorites.splice(idx, 1);
    } else {
      state.favorites.push(fullKey);
    }
    saveFavorites();
  }

  function updateFavoriteButtonState() {
    if (!elements.favCityBtn) return;
    const currentName = elements.cityName.textContent;
    const isFav = state.favorites.some(f => f.toLowerCase().includes(currentName.toLowerCase()));

    elements.favCityBtn.classList.toggle('is-active', isFav);
    if (elements.favStarIcon) {
      elements.favStarIcon.innerHTML = isFav 
        ? WeatherIcons.get('star-filled') 
        : WeatherIcons.get('star');
    }
    elements.favCityBtn.title = isFav ? 'Remove from favorites' : 'Save to favorites';
  }

  function renderFavorites() {
    if (!elements.favoritesChips) return;
    elements.favoritesChips.innerHTML = '';

    if (!state.favorites || state.favorites.length === 0) {
      elements.favoritesChips.innerHTML = '<span class="empty-fav-hint">Star any city to pin here</span>';
      return;
    }

    state.favorites.forEach(city => {
      const chip = document.createElement('button');
      chip.className = 'city-chip fav-chip';
      chip.innerHTML = `<span>★</span><span>${city.split(',')[0]}</span>`;
      chip.addEventListener('click', () => {
        searchAndSelectFirst(city);
      });
      elements.favoritesChips.appendChild(chip);
    });
  }

  /**
   * Fetch and display weather data
   */
  async function loadWeatherData(loc, weatherHint) {
    const hint = weatherHint || loc.condition || loc.icon || loc.category;
    showLoading(true, hint);
    hideError();

    try {
      const data = await WeatherAPI.getWeather(loc.lat, loc.lon, loc);
      state.weatherData = data;
      state.currentLocation = loc;
      
      // Save location
      localStorage.setItem('sky_pulse_location', JSON.stringify(loc));

      renderWeatherDashboard(data);
      updateProviderNotice(data);
      updateFavoriteButtonState();
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
    // 1. Dynamic Climate Backdrop & Theme update
    const climateCategory = data.current.climate || data.current.category || 'sunny';
    setClimateBackground(climateCategory, data);

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

    elements.updateTimestamp.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // 3. Hero Card
    elements.badgeCondition.textContent = data.current.condition;
    elements.heroIcon.innerHTML = WeatherIcons.get(data.current.icon);
    elements.conditionText.textContent = data.current.condition;

    // 4. Weather Intelligence & Storytelling
    renderWeatherIntelligence(data);

    // 5. Update Temperatures across Hero & Forecasts
    updateTemperatures();

    // 6. Detailed Metrics
    renderMetrics(data.current);

    // 7. Hourly Forecast
    renderHourlyForecast(data.hourly);

    // 8. 7-Day Extended Forecast with Range Bars
    renderDailyForecast(data.daily);

    // 9. Canvas curve if visible
    if (state.showGraph) {
      drawHourlyChart(data.hourly);
    }
  }

  /**
   * Weather Intelligence & Storytelling Generator
   * Computes human-friendly insights from forecast trends.
   */
  function renderWeatherIntelligence(data) {
    if (!data || !data.hourly || data.hourly.length === 0) return;

    const hourly = data.hourly;
    const current = data.current;

    // 1. Next 24 Hours Story Narrative
    let maxTemp = -999, maxTime = '';
    let minTemp = 999, minTime = '';
    let rainHours = [];

    hourly.slice(0, 24).forEach(h => {
      if (h.temp > maxTemp) { maxTemp = h.temp; maxTime = h.timeFormatted; }
      if (h.temp < minTemp) { minTemp = h.temp; minTime = h.timeFormatted; }
      if (h.pop >= 30) rainHours.push(h.timeFormatted);
    });

    const formattedMax = formatTemp(maxTemp);
    const formattedMin = formatTemp(minTemp);

    let narrative = `Expect temperatures to peak at ${formattedMax}°${state.unit} near ${maxTime || 'midday'} before cooling to ${formattedMin}°${state.unit} overnight. `;
    if (rainHours.length > 0) {
      narrative += `Precipitation is likely around ${rainHours[0]}, with precipitation probability up to ${Math.max(...hourly.map(h => h.pop || 0))}%.`;
    } else {
      narrative += `Conditions remain predominantly dry with steady atmospheric pressure.`;
    }

    if (elements.narrativeText) elements.narrativeText.textContent = narrative;

    // 2. Umbrella Advisory
    const maxPopNext12 = Math.max(...hourly.slice(0, 12).map(h => h.pop || 0));
    if (maxPopNext12 >= 50) {
      elements.umbrellaStatus.textContent = 'Likely Needed';
      elements.umbrellaDesc.textContent = `${maxPopNext12}% rain probability ahead in next 12h`;
    } else if (maxPopNext12 >= 25) {
      elements.umbrellaStatus.textContent = 'Keep Handy';
      elements.umbrellaDesc.textContent = `${maxPopNext12}% risk of passing showers`;
    } else {
      elements.umbrellaStatus.textContent = 'Not Required';
      elements.umbrellaDesc.textContent = 'Minimal precipitation risk (<20%)';
    }

    // 3. Outdoor Conditions Rating
    const windSpeed = current.windSpeed;
    const temp = current.temp;
    const isRaining = current.precipitation > 0 || maxPopNext12 > 50;

    if (isRaining) {
      elements.outdoorStatus.textContent = 'Indoor Preferred';
      elements.outdoorDesc.textContent = 'Active precipitation or high rain risk';
    } else if (temp >= 16 && temp <= 26 && windSpeed < 25) {
      elements.outdoorStatus.textContent = 'Optimal / Excellent';
      elements.outdoorDesc.textContent = 'Comfortable temperature and calm air';
    } else if (temp > 32 || temp < 4 || windSpeed > 40) {
      elements.outdoorStatus.textContent = 'Challenging';
      elements.outdoorDesc.textContent = 'Extreme temperature or gusty winds';
    } else {
      elements.outdoorStatus.textContent = 'Fair / Moderate';
      elements.outdoorDesc.textContent = 'Acceptable for jogging or outdoor walks';
    }

    // 4. Wind Dynamics & Beaufort Category
    let beaufort = 'Gentle Breeze';
    if (windSpeed < 5) beaufort = 'Calm';
    else if (windSpeed < 12) beaufort = 'Light Air';
    else if (windSpeed < 20) beaufort = 'Gentle Breeze';
    else if (windSpeed < 30) beaufort = 'Moderate Breeze';
    else if (windSpeed < 45) beaufort = 'Fresh / Gusty';
    else beaufort = 'Strong Gale';

    const cardinal = getWindCardinal(current.windDirection);
    elements.windStatus.textContent = beaufort;
    elements.windDesc.textContent = `${current.windSpeed} km/h (${cardinal}) bearing`;

    // 5. Temperature Trajectory
    const nextDayMax = data.daily && data.daily[1] ? data.daily[1].tempMax : current.temp;
    const diff = nextDayMax - current.tempMax;
    if (diff >= 2) {
      elements.trendStatus.textContent = 'Warming Trend';
      elements.trendDesc.textContent = `Rising by ~${Math.abs(diff)}° tomorrow`;
    } else if (diff <= -2) {
      elements.trendStatus.textContent = 'Cooling Trend';
      elements.trendDesc.textContent = `Dropping by ~${Math.abs(diff)}° tomorrow`;
    } else {
      elements.trendStatus.textContent = 'Stable Pattern';
      elements.trendDesc.textContent = 'Minimal day-over-day temperature shift';
    }

    // 6. Atmospheric Mood
    let mood = 'Calm & Pleasant';
    const cat = current.category;
    if (cat === 'stormy') mood = 'Storm Alert Active';
    else if (cat === 'rainy') mood = 'Refreshing Precipitation';
    else if (cat === 'snowy') mood = 'Winter Chill & Frost';
    else if (cat === 'sunny') mood = 'Crisp, Radiant & Sunlit';
    else if (cat === 'night') mood = 'Nocturnal Starlit Serenity';
    else mood = 'Overcast & Atmospheric';

    if (elements.moodText) elements.moodText.textContent = `Atmospheric Mood: ${mood}`;
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
    updateMapMarkerPopups();
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
    elements.windDirection.textContent = `Bearing: ${current.windDirection}° (${cardinal})`;

    // Rotate compass needle
    if (elements.compassNeedle) {
      elements.compassNeedle.style.transform = `rotate(${current.windDirection}deg)`;
    }

    // Humidity
    elements.humidity.textContent = current.humidity;
    elements.humidityBar.style.width = `${Math.min(100, current.humidity)}%`;
    if (current.humidity < 40) {
      elements.humidityStatus.textContent = 'Dry atmospheric moisture';
    } else if (current.humidity <= 70) {
      elements.humidityStatus.textContent = 'Optimal humidity balance';
    } else {
      elements.humidityStatus.textContent = 'High relative moisture / Humid';
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
      elements.uvAdvice.textContent = 'Seek shade during peak midday';
    }

    // Pressure
    elements.pressure.textContent = current.pressure;
    if (elements.pressureTrend) {
      elements.pressureTrend.textContent = current.pressure > 1013 
        ? 'High pressure / Stable fair skies' 
        : 'Low pressure / Cloud development likely';
    }

    // Visibility
    if (state.unit === 'F') {
      const mi = Math.round(current.visibility * 0.621371);
      elements.visibility.textContent = mi;
      elements.visUnit.textContent = 'mi';
    } else {
      elements.visibility.textContent = current.visibility;
      elements.visUnit.textContent = 'km';
    }

    if (elements.visStatus) {
      elements.visStatus.textContent = current.visibility >= 10 
        ? 'Crystal clear optical clarity' 
        : 'Slight atmospheric haze / mist';
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
   * Render 7-Day Extended Forecast with Temperature Range Bars & Expandable Drawers
   */
  function renderDailyForecast(daily) {
    elements.dailyList.innerHTML = '';

    if (!daily || daily.length === 0) {
      elements.dailyList.innerHTML = '<p class="metric-sub">Daily forecast unavailable.</p>';
      return;
    }

    // Calculate overall min & max across all 7 days to position range bars proportionally
    let allMin = Math.min(...daily.map(d => d.tempMin));
    let allMax = Math.max(...daily.map(d => d.tempMax));
    let span = allMax - allMin || 1;

    daily.forEach((day, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'daily-item-wrapper';

      const leftPct = Math.max(0, Math.min(100, Math.round(((day.tempMin - allMin) / span) * 100)));
      const widthPct = Math.max(12, Math.min(100 - leftPct, Math.round(((day.tempMax - day.tempMin) / span) * 100)));

      wrapper.innerHTML = `
        <div class="daily-item" role="button" tabindex="0">
          <span class="daily-day">${day.dayName}</span>
          <div class="daily-icon">${WeatherIcons.get(day.icon)}</div>
          <span class="daily-condition" title="${day.condition}">${day.condition}</span>
          <div class="temp-range-wrap">
            <span class="temp-lo">${formatTemp(day.tempMin)}°</span>
            <div class="range-bar-track">
              <div class="range-bar-fill" style="left: ${leftPct}%; width: ${widthPct}%;"></div>
            </div>
            <span class="temp-hi">${formatTemp(day.tempMax)}°</span>
          </div>
          <div class="expand-chevron">${WeatherIcons.get('chevron-down')}</div>
        </div>

        <div class="daily-expanded-drawer">
          <div class="drawer-inner">
            <div class="drawer-time-col">
              <span class="drawer-time-label">Morning</span>
              <span class="drawer-time-temp">${formatTemp(day.tempMin + Math.round((day.tempMax - day.tempMin) * 0.3))}°</span>
              <span class="drawer-time-sub">Sunrise: ${day.sunrise || '--:--'}</span>
            </div>
            <div class="drawer-time-col">
              <span class="drawer-time-label">Afternoon</span>
              <span class="drawer-time-temp">${formatTemp(day.tempMax)}°</span>
              <span class="drawer-time-sub">Peak temp</span>
            </div>
            <div class="drawer-time-col">
              <span class="drawer-time-label">Evening</span>
              <span class="drawer-time-temp">${formatTemp(day.tempMin + Math.round((day.tempMax - day.tempMin) * 0.5))}°</span>
              <span class="drawer-time-sub">Sunset: ${day.sunset || '--:--'}</span>
            </div>
            <div class="drawer-time-col">
              <span class="drawer-time-label">Precipitation</span>
              <span class="drawer-time-temp">${day.popMax || 0}%</span>
              <span class="drawer-time-sub">UV Max: ${day.uvMax || 0}</span>
            </div>
          </div>
        </div>
      `;

      // Accordion click toggle
      const itemRow = wrapper.querySelector('.daily-item');
      itemRow.addEventListener('click', () => {
        wrapper.classList.toggle('is-expanded');
      });

      itemRow.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          wrapper.classList.toggle('is-expanded');
        }
      });

      elements.dailyList.appendChild(wrapper);
    });
  }

  /**
   * Draw Temperature Curve on Canvas (Bezier Spline)
   */
  function drawHourlyChart(hourly) {
    const canvas = elements.tempChart;
    if (!canvas || !hourly || hourly.length === 0) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width || 600) * dpr;
    canvas.height = 120 * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = rect.width || 600;
    const height = 120;
    ctx.clearRect(0, 0, width, height);

    const pointsCount = Math.min(14, hourly.length);
    const temps = hourly.slice(0, pointsCount).map(h => formatTemp(h.temp));
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;
    const range = maxTemp - minTemp || 1;

    const paddingX = 32;
    const paddingY = 26;
    const graphWidth = width - (paddingX * 2);
    const graphHeight = height - (paddingY * 2);

    const stepX = graphWidth / (pointsCount - 1);
    const coordinates = temps.map((t, i) => {
      const x = paddingX + (i * stepX);
      const y = paddingY + graphHeight - ((t - minTemp) / range * graphHeight);
      return { x, y, temp: t, time: hourly[i].timeFormatted };
    });

    // Draw Smooth Bezier Spline
    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].y);
    for (let i = 0; i < coordinates.length - 1; i++) {
      const xc = (coordinates[i].x + coordinates[i + 1].x) / 2;
      const yc = (coordinates[i].y + coordinates[i + 1].y) / 2;
      ctx.quadraticCurveTo(coordinates[i].x, coordinates[i].y, xc, yc);
    }
    ctx.lineTo(coordinates[coordinates.length - 1].x, coordinates[coordinates.length - 1].y);

    // Line Stroke with Electric Cyan
    ctx.strokeStyle = '#35D7FF';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // Gradient Area Fill
    ctx.lineTo(coordinates[coordinates.length - 1].x, height);
    ctx.lineTo(coordinates[0].x, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(53, 215, 255, 0.35)');
    gradient.addColorStop(0.6, 'rgba(121, 103, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(121, 103, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Points & Labels
    coordinates.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = '#F4F7FF';
      ctx.font = '700 11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.temp}°`, pt.x, pt.y - 9);
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
      btn.classList.toggle('active', btn.dataset.unit === state.unit);
      btn.addEventListener('click', () => {
        setUnit(btn.dataset.unit);
      });
    });
  }

  function setUnit(newUnit) {
    if (!newUnit) return;
    state.unit = newUnit;
    localStorage.setItem('weather_unit', state.unit);
    elements.unitButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.unit === state.unit);
    });
    if (elements.accountPrefUnit) {
      elements.accountPrefUnit.value = state.unit;
    }
    updateTemperatures();
    if (state.weatherData) {
      renderMetrics(state.weatherData.current);
      renderWeatherIntelligence(state.weatherData);
    }
    renderWorldWeatherGrid();
    updateWorldStats();
    if (state.leafletMap) updateMapMarkerPopups();
    if (typeof SkyPulseAuth !== 'undefined' && SkyPulseAuth.isAuthenticated()) {
      SkyPulseAuth.updateProfile({ preferredUnit: state.unit });
    }
  }

  /**
   * Event Listeners (Search, Geolocation, Chips, Modals)
   */
  function initEventListeners() {
    // Favorite Star Button in Hero
    if (elements.favCityBtn) {
      elements.favCityBtn.addEventListener('click', toggleCurrentFavorite);
    }

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
        let hint = null;
        if (typeof WorldWeather !== 'undefined') {
          const match = WorldWeather.getAll().find(c => cityName.toLowerCase().includes(c.city.toLowerCase()));
          if (match) hint = match.condition || match.icon;
        }
        searchAndSelectFirst(cityName, hint);
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

    // View Mode Toggle (Grid vs Map)
    if (elements.viewGridBtn && elements.viewMapBtn) {
      elements.viewGridBtn.addEventListener('click', () => {
        setViewMode('grid');
      });
      elements.viewMapBtn.addEventListener('click', () => {
        setViewMode('map');
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
          updateWorldDistribution();
          initOrUpdateWorldMap();
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

    // Worldwide Countries Region Filter Pills
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

    // Worldwide Countries Type Selector (Sovereign vs Territory)
    if (elements.worldTypeSelect) {
      elements.worldTypeSelect.addEventListener('change', e => {
        state.worldType = e.target.value;
        renderWorldWeatherGrid();
      });
    }

    // Worldwide Countries Sort Selector
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
        state.worldType = 'All';
        elements.worldSearchInput.value = '';
        if (elements.worldTypeSelect) elements.worldTypeSelect.value = 'All';
        elements.clearWorldSearchBtn.classList.add('hidden');
        elements.worldRegionChips.querySelectorAll('.region-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.region === 'All');
        });
        renderWorldWeatherGrid();
      });
    }
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'grid') {
      elements.viewGridBtn.classList.add('active');
      elements.viewMapBtn.classList.remove('active');
      elements.worldGrid.classList.remove('hidden');
      elements.worldMapWrapper.classList.add('hidden');
    } else {
      elements.viewGridBtn.classList.remove('active');
      elements.viewMapBtn.classList.add('active');
      elements.worldGrid.classList.add('hidden');
      elements.worldMapWrapper.classList.remove('hidden');
      initOrUpdateWorldMap();
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
          loadWeatherData(loc, loc.condition || loc.icon);
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
  async function searchAndSelectFirst(query, weatherHint) {
    showLoading(true, weatherHint);
    try {
      const results = await WeatherAPI.searchLocations(query);
      if (results && results.length > 0) {
        const topResult = results[0];
        elements.searchInput.value = `${topResult.name}, ${topResult.countryCode || topResult.country}`;
        await loadWeatherData(topResult, weatherHint);
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
   * City Comparison Matrix Modal
   */
  function initComparisonModal() {
    if (elements.compareNavBtn) {
      elements.compareNavBtn.addEventListener('click', openComparisonModal);
    }
    if (elements.closeCompareBtn) {
      elements.closeCompareBtn.addEventListener('click', closeComparisonModal);
    }
    if (elements.compareModal) {
      elements.compareModal.addEventListener('click', e => {
        if (e.target === elements.compareModal) closeComparisonModal();
      });
    }

    // Dropdown change listeners
    [elements.compareSelect1, elements.compareSelect2, elements.compareSelect3].forEach(sel => {
      if (sel) {
        sel.addEventListener('change', renderComparisonTable);
      }
    });
  }

  function openComparisonModal() {
    populateComparisonDropdowns();
    renderComparisonTable();
    elements.compareModal.classList.remove('hidden');
  }

  function closeComparisonModal() {
    elements.compareModal.classList.add('hidden');
  }

  function populateComparisonDropdowns() {
    if (typeof WorldWeather === 'undefined') return;
    const countries = WorldWeather.getAll();

    const optionsHtml = countries.map(c => 
      `<option value="${c.city}">${c.flag} ${c.city}, ${c.country}</option>`
    ).join('');

    const activeCity = elements.cityName ? elements.cityName.textContent : 'London';

    if (elements.compareSelect1) {
      elements.compareSelect1.innerHTML = optionsHtml;
      const match = countries.find(c => c.city.toLowerCase() === activeCity.toLowerCase());
      elements.compareSelect1.value = match ? match.city : 'London';
    }

    if (elements.compareSelect2) {
      elements.compareSelect2.innerHTML = optionsHtml;
      elements.compareSelect2.value = 'Tokyo';
    }

    if (elements.compareSelect3) {
      elements.compareSelect3.innerHTML = '<option value="">-- None --</option>' + optionsHtml;
      elements.compareSelect3.value = 'New York';
    }
  }

  function renderComparisonTable() {
    if (!elements.compareTableContainer || typeof WorldWeather === 'undefined') return;

    const countries = WorldWeather.getAll();
    const city1Name = elements.compareSelect1 ? elements.compareSelect1.value : 'London';
    const city2Name = elements.compareSelect2 ? elements.compareSelect2.value : 'Tokyo';
    const city3Name = elements.compareSelect3 ? elements.compareSelect3.value : '';

    const c1 = countries.find(c => c.city === city1Name) || countries[0];
    const c2 = countries.find(c => c.city === city2Name) || countries[1];
    const c3 = city3Name ? countries.find(c => c.city === city3Name) : null;

    const selectedList = [c1, c2, c3].filter(Boolean);

    let html = `
      <table class="compare-table">
        <thead>
          <tr>
            <th class="compare-metric-col">Meteorological Metric</th>
            ${selectedList.map(c => `<th>${c.flag} ${c.city} (${c.country})</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="compare-metric-col">Current Temperature</td>
            ${selectedList.map(c => `<td class="compare-val-col" style="color:var(--accent-cyan); font-size:1.15rem;">${formatTemp(c.temp)}°${state.unit}</td>`).join('')}
          </tr>
          <tr>
            <td class="compare-metric-col">Condition</td>
            ${selectedList.map(c => `<td class="compare-val-col">${c.condition}</td>`).join('')}
          </tr>
          <tr>
            <td class="compare-metric-col">Relative Humidity</td>
            ${selectedList.map(c => `<td>💧 ${c.humidity}%</td>`).join('')}
          </tr>
          <tr>
            <td class="compare-metric-col">Wind Velocity</td>
            ${selectedList.map(c => {
              const windVal = state.unit === 'F' ? `${Math.round(c.wind * 0.621371)} mph` : `${c.wind} km/h`;
              return `<td>💨 ${windVal}</td>`;
            }).join('')}
          </tr>
          <tr>
            <td class="compare-metric-col">Continental Region</td>
            ${selectedList.map(c => `<td>${c.region}</td>`).join('')}
          </tr>
          <tr>
            <td class="compare-metric-col">Coordinates</td>
            ${selectedList.map(c => `<td style="font-size:0.75rem; color:var(--text-muted);">${c.lat.toFixed(2)}°, ${c.lon.toFixed(2)}°</td>`).join('')}
          </tr>
        </tbody>
      </table>
    `;

    elements.compareTableContainer.innerHTML = html;
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
      elements.apiStatusBanner.style.background = 'rgba(53, 215, 255, 0.08)';
      elements.apiStatusBanner.style.borderColor = 'rgba(53, 215, 255, 0.2)';
    }
    elements.forecastProviderPill.textContent = WeatherAPI.getProvider() === 'openweathermap' ? 'OWM Forecast' : 'Open-Meteo 7-Day';
  }

  let loadingDebounceTimer = null;

  function showLoading(show, weatherHint) {
    if (show) {
      clearTimeout(loadingDebounceTimer);
      // Fast threshold: only display loading symbol if network fetch takes longer than 80ms
      // Cached data returns in <1ms and completes immediately without any loading delay!
      loadingDebounceTimer = setTimeout(() => {
        let hint = weatherHint;
        if (!hint && state.weatherData && state.weatherData.current) {
          hint = state.weatherData.current.climate || state.weatherData.current.category || state.weatherData.current.condition || state.weatherData.current.icon;
        }

        const category = resolveLoaderCategory(hint);

        // Inject the weather-adaptive dynamic SVG icon (e.g. rotating Sun, falling Raindrops, Snowflake, etc.)
        if (elements.weatherLoaderSymbol && typeof WeatherIcons !== 'undefined' && WeatherIcons.getLoader) {
          elements.weatherLoaderSymbol.innerHTML = WeatherIcons.getLoader(category);
        }

        // Update the glowing ambient halo theme
        if (elements.weatherLoaderWrapper) {
          elements.weatherLoaderWrapper.className = `weather-loader-wrapper theme-${category}`;
        }

        // Update descriptive atmospheric status text
        const meta = getLoaderMeta(category);
        if (elements.loadingTitle) elements.loadingTitle.textContent = meta.title;
        if (elements.loadingSubtext) elements.loadingSubtext.textContent = meta.sub;

        if (elements.loadingState) elements.loadingState.classList.remove('hidden');
        if (elements.mainDashboard) {
          elements.mainDashboard.style.opacity = '0.65';
          elements.mainDashboard.style.pointerEvents = 'none';
        }
      }, 80);
    } else {
      clearTimeout(loadingDebounceTimer);
      if (elements.loadingState) elements.loadingState.classList.add('hidden');
      if (elements.mainDashboard) {
        elements.mainDashboard.style.opacity = '1';
        elements.mainDashboard.style.pointerEvents = 'auto';
      }
    }
  }

  function resolveLoaderCategory(hint) {
    if (!hint) return 'sunny';
    const str = String(hint).toLowerCase();
    if (str.includes('cold') || str.includes('snow') || str.includes('sleet') || str.includes('hail') || str.includes('freez') || str.includes('ice')) return 'snowy';
    if (str.includes('rain') || str.includes('drizzle') || str.includes('shower')) return 'rainy';
    if (str.includes('storm') || str.includes('thunder') || str.includes('lightning')) return 'stormy';
    if (str.includes('fog') || str.includes('mist') || str.includes('rime') || str.includes('haze')) return 'foggy';
    if (str.includes('night') || str.includes('moon')) return 'night';
    if (str.includes('wind') || str.includes('breeze')) return 'windy';
    if (str.includes('sun') || str.includes('clear')) return 'sunny';
    if (str.includes('cloud') || str.includes('overcast')) return 'cloudy';
    return 'sunny';
  }

  function getLoaderMeta(category) {
    switch (category) {
      case 'sunny':
        return {
          title: 'Solar Telemetry & Clear Skies...',
          sub: 'Rotating solar sensors & computing UV radiation'
        };
      case 'rainy':
        return {
          title: 'Tracking Rain & Precipitation...',
          sub: 'Measuring precipitation probability & falling droplets'
        };
      case 'stormy':
        return {
          title: 'Monitoring Storm Cells & Lightning...',
          sub: 'Tracking barometric drop & electric discharges'
        };
      case 'snowy':
        return {
          title: 'Analyzing Snowfall & Freezing Levels...',
          sub: 'Calibrating crystalline temperature boundaries'
        };
      case 'cloudy':
        return {
          title: 'Scanning Cloud Formations & Overcast...',
          sub: 'Evaluating cloud cover density & wind vectors'
        };
      case 'foggy':
        return {
          title: 'Measuring Mist & Fog Density...',
          sub: 'Calibrating horizontal visibility distance'
        };
      case 'night':
        return {
          title: 'Observing Nocturnal Atmospheric Trends...',
          sub: 'Synchronizing nighttime temperature curve'
        };
      case 'windy':
        return {
          title: 'Measuring Wind Velocity & Direction...',
          sub: 'Calculating cardinal compass bearings'
        };
      default:
        return {
          title: 'Fetching Atmospheric Telemetry...',
          sub: 'Synchronizing real-time global weather stream'
        };
    }
  }

  function showError(msg) {
    elements.errorMessage.textContent = msg;
    elements.errorBanner.classList.remove('hidden');
  }

  function hideError() {
    elements.errorBanner.classList.add('hidden');
  }

  /**
   * Initialize Worldwide Countries Global Hub (225+ Nations & Territories)
   */
  async function initWorldWeather() {
    if (typeof WorldWeather === 'undefined') return;

    renderWorldWeatherGrid();
    updateWorldStats();
    updateWorldDistribution();

    // Hook fetch more button for progressive batching
    if (elements.fetchMoreBtn) {
      elements.fetchMoreBtn.addEventListener('click', async () => {
        await fetchNextWorldBatch(25);
      });
    }

    // Hook global sync button
    if (elements.refreshWorldBtn) {
      elements.refreshWorldBtn.addEventListener('click', async () => {
        await fetchNextWorldBatch(25, true);
      });
    }

    // Non-blocking initial batch sync (first 25 countries)
    setTimeout(async () => {
      try {
        await fetchNextWorldBatch(25);
      } catch (err) {
        console.warn('Initial worldwide weather sync noticed:', err);
      }
    }, 1200);
  }

  async function fetchNextWorldBatch(count = 25, isRefresh = false) {
    if (typeof WorldWeather === 'undefined') return;
    if (WorldWeather.isFetching()) return;

    if (elements.fetchMoreBtn) {
      elements.fetchMoreBtn.disabled = true;
      elements.fetchMoreBtn.textContent = 'Syncing Live Telemetry...';
    }
    if (elements.refreshWorldBtn) {
      elements.refreshWorldBtn.classList.add('syncing');
      elements.refreshWorldBtn.disabled = true;
    }
    if (elements.worldSyncBtnText) {
      elements.worldSyncBtnText.textContent = 'Syncing...';
    }

    try {
      const res = await WorldWeather.fetchBatch(count);
      renderWorldWeatherGrid();
      updateWorldStats();
      updateWorldDistribution();
      initOrUpdateWorldMap();

      if (elements.progStatusText) {
        elements.progStatusText.textContent = `Synced ${res.totalLoaded} of ${res.totalCountries} worldwide nations and territories. Real data cached for 30 minutes.`;
      }

      if (elements.fetchMoreBtn) {
        if (res.totalLoaded >= res.totalCountries) {
          elements.fetchMoreBtn.textContent = 'All 227 Nations Synced ✓';
          elements.fetchMoreBtn.disabled = true;
        } else {
          elements.fetchMoreBtn.textContent = `Sync Next 25 Countries (${res.totalLoaded}/${res.totalCountries})`;
          elements.fetchMoreBtn.disabled = false;
        }
      }
    } catch (e) {
      console.warn('World weather batch fetch error:', e);
      if (elements.fetchMoreBtn) {
        elements.fetchMoreBtn.textContent = 'Retry Batch Sync';
        elements.fetchMoreBtn.disabled = false;
      }
    } finally {
      if (elements.refreshWorldBtn) {
        elements.refreshWorldBtn.classList.remove('syncing');
        elements.refreshWorldBtn.disabled = false;
      }
      if (elements.worldSyncBtnText) {
        elements.worldSyncBtnText.textContent = 'Sync Live Data';
      }
    }
  }

  /**
   * Render the Worldwide Countries Grid
   */
  function renderWorldWeatherGrid() {
    if (!elements.worldGrid || typeof WorldWeather === 'undefined') return;

    const list = WorldWeather.filterAndSort(state.worldSearch, state.worldRegion, state.worldSort, state.worldType);
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
      card.setAttribute('title', `Click to load full weather for ${c.city}, ${c.country} (${c.iso3 || c.code})`);

      const formattedTemp = formatTemp(c.temp);
      const formattedWind = state.unit === 'F'
        ? `${Math.round(c.wind * 0.621371)} mph`
        : `${c.wind} km/h`;

      const iconSvg = typeof WeatherIcons !== 'undefined' ? WeatherIcons.get(c.icon) : '';
      const typeTag = c.type === 'territory' ? 'Territory' : c.region;

      card.innerHTML = `
        <div class="country-card-top">
          <div class="country-identity">
            <span class="country-flag-icon">${c.flag}</span>
            <div class="country-names">
              <span class="country-name-txt">${c.country}</span>
              <span class="country-city-txt">${c.city} • ${c.iso3 || c.code}</span>
            </div>
          </div>
          <span class="country-region-tag ${c.type === 'territory' ? 'is-territory' : ''}">${typeTag}</span>
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
        loadWeatherData(location, c.condition || c.icon);
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
      elements.statAverage.textContent = `${formatTemp(stats.average)}°${state.unit} Planetary Avg`;
    }
    if (elements.statCount) {
      elements.statCount.textContent = `${stats.loadedCount} / ${stats.totalCount} Updated`;
    }
  }

  /**
   * Update Atmospheric Condition Distribution Segmented Bar
   */
  function updateWorldDistribution() {
    if (typeof WorldWeather === 'undefined' || !WorldWeather.getDistribution) return;
    const dist = WorldWeather.getDistribution();

    if (elements.distBarTrack) {
      elements.distBarTrack.innerHTML = dist.map(d => 
        `<div class="dist-segment dist-seg-${d.key}" style="width: ${d.pct}%;" title="${d.label}: ${d.count} countries (${d.pct}%)"></div>`
      ).join('');
    }

    if (elements.distLegend) {
      elements.distLegend.innerHTML = dist.map(d => `
        <div class="dist-legend-item">
          <span class="dist-legend-dot" style="background: ${d.color};"></span>
          <span>${d.label}: <strong>${d.pct}%</strong> (${d.count})</span>
        </div>
      `).join('');
    }
  }

  /**
   * Initialize or Update Leaflet World Map (227 Countries)
   */
  function initOrUpdateWorldMap() {
    if (typeof L === 'undefined' || !elements.worldWeatherMap || typeof WorldWeather === 'undefined') return;

    const countries = WorldWeather.getAll();

    if (!state.leafletMap) {
      // Create map
      state.leafletMap = L.map('worldWeatherMap', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 9,
        zoomControl: true
      });

      // CartoDB Dark Matter dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(state.leafletMap);
    }

    // Clear existing markers
    state.mapMarkers.forEach(m => state.leafletMap.removeLayer(m));
    state.mapMarkers = [];

    // Add markers for all countries
    countries.forEach(c => {
      const formattedTemp = formatTemp(c.temp);
      const formattedWind = state.unit === 'F' ? `${Math.round(c.wind * 0.621371)} mph` : `${c.wind} km/h`;
      const icon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-weather-pin">${c.flag} ${formattedTemp}°</div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const marker = L.marker([c.lat, c.lon], { icon }).addTo(state.leafletMap);

      const popupContent = `
        <div class="map-popup-card">
          <div class="map-popup-header">${c.flag} ${c.city}, ${c.country} (${c.iso3 || c.code})</div>
          <div class="map-popup-temp">${formattedTemp}°${state.unit}</div>
          <div class="map-popup-cond">${c.condition} • 💧 ${c.humidity}% • 💨 ${formattedWind}</div>
          <button class="map-popup-focus-btn" onclick="window.SkyPulseFocus('${c.city}', '${c.country}', ${c.lat}, ${c.lon}, '${c.condition}')">Focus in Hero</button>
        </div>
      `;

      marker.bindPopup(popupContent);
      state.mapMarkers.push(marker);
    });

    // Invalidate size in case tab switched
    setTimeout(() => {
      if (state.leafletMap) state.leafletMap.invalidateSize();
    }, 200);
  }

  function updateMapMarkerPopups() {
    if (!state.leafletMap || state.mapMarkers.length === 0) return;
    initOrUpdateWorldMap();
  }

  /* ==========================================================================
     DYNAMIC ATMOSPHERIC CLIMATE BACKDROP IMAGE SYSTEM
     Generates climate-specific visual imagery (Snowforest for cold, Luminous Sun for sunny, etc.)
     ========================================================================== */

  const CLIMATE_BACKDROPS = {
    cold: {
      url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 20%, #1e3a8a 0%, #0c1e38 60%, #070B16 100%)',
      theme: 'theme-snowy',
      title: 'Frosted Snow Forest & Cold Atmosphere'
    },
    snowy: {
      url: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 20%, #1e3a8a 0%, #0f172a 60%, #070B16 100%)',
      theme: 'theme-snowy',
      title: 'Snowy Alpine Landscape'
    },
    sunny: {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 15%, #b45309 0%, #1e3a8a 50%, #070B16 100%)',
      theme: 'theme-sunny',
      title: 'Radiant Sunlit Horizon'
    },
    rainy: {
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 20%, #0369a1 0%, #0c4a6e 55%, #070B16 100%)',
      theme: 'theme-rainy',
      title: 'Atmospheric Raindrops on Glass'
    },
    stormy: {
      url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 20%, #581c87 0%, #1e1b4b 60%, #070B16 100%)',
      theme: 'theme-stormy',
      title: 'Dramatic Violet Thunderstorm Shelf'
    },
    cloudy: {
      url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 20%, #334155 0%, #1e293b 60%, #070B16 100%)',
      theme: 'theme-cloudy',
      title: 'Rolling Overcast Cloudscape'
    },
    foggy: {
      url: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 20%, #475569 0%, #1e293b 60%, #070B16 100%)',
      theme: 'theme-foggy',
      title: 'Ethereal Misty Pine Forest'
    },
    night: {
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
      fallbackGrad: 'radial-gradient(ellipse at 50% 15%, #312e81 0%, #0f172a 65%, #070B16 100%)',
      theme: 'theme-night',
      title: 'Nocturnal Starlit Galaxy'
    }
  };

  let activeBackdrop = 'A';

  function setClimateBackground(climateCategory, weatherData) {
    const key = String(climateCategory || 'sunny').toLowerCase();
    const config = CLIMATE_BACKDROPS[key] || CLIMATE_BACKDROPS.sunny;

    const layerA = elements.backdropLayerA;
    const layerB = elements.backdropLayerB;

    if (!layerA || !layerB) return;

    const nextLayer = activeBackdrop === 'A' ? layerB : layerA;
    const prevLayer = activeBackdrop === 'A' ? layerA : layerB;

    nextLayer.style.backgroundImage = `url("${config.url}"), ${config.fallbackGrad}`;
    nextLayer.classList.add('active');
    prevLayer.classList.remove('active');

    activeBackdrop = activeBackdrop === 'A' ? 'B' : 'A';
    document.body.className = config.theme;
  }

  function preloadClimateImages() {
    Object.values(CLIMATE_BACKDROPS).forEach(cfg => {
      const img = new Image();
      img.src = cfg.url;
    });
  }

  function showGuestToast() {
    const existing = document.querySelector('.guest-toast-notice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'guest-toast-notice';
    toast.innerHTML = '<span>👋</span><span>Continuing as Guest Explorer. You can sign in anytime to sync your favorites.</span>';
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  /* ==========================================================================
     AUTHENTICATION, PROFILE & ROUTING CONTROLLER
     ========================================================================== */

  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return 'US';
    const parts = nameOrEmail.trim().split(/[\s@._-]+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameOrEmail.slice(0, 2).toUpperCase();
  }

  function showAuthFeedback(msg, type = 'error') {
    if (!elements.authFeedback) return;
    elements.authFeedback.textContent = msg;
    elements.authFeedback.className = `auth-feedback ${type}`;
    elements.authFeedback.classList.remove('hidden');
  }

  function hideAuthFeedback() {
    if (elements.authFeedback) {
      elements.authFeedback.classList.add('hidden');
      elements.authFeedback.textContent = '';
    }
  }

  function checkPasswordStrength(password) {
    if (!password) return { score: 0, text: 'Password strength: Empty', color: 'transparent', width: '0%' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, text: 'Password strength: Weak', color: '#EF4444', width: '25%' };
    if (score === 2 || score === 3) return { score: 2, text: 'Password strength: Fair', color: '#F59E0B', width: '55%' };
    if (score === 4) return { score: 3, text: 'Password strength: Good', color: '#10B981', width: '80%' };
    return { score: 4, text: 'Password strength: Strong (Optimal)', color: '#35D7FF', width: '100%' };
  }

  function updateAuthHeroPreview() {
    if (elements.authHeroIcon) {
      elements.authHeroIcon.innerHTML = state.weatherData 
        ? WeatherIcons.get(state.weatherData.current.icon) 
        : WeatherIcons.get('cloud-sun');
    }
    if (elements.authPreviewCity) {
      elements.authPreviewCity.textContent = state.currentLocation 
        ? `${state.currentLocation.name}, ${state.currentLocation.countryCode || state.currentLocation.country}`
        : 'London, UK';
    }
    if (elements.authPreviewCond) {
      elements.authPreviewCond.textContent = state.weatherData 
        ? state.weatherData.current.condition 
        : 'Real-time Telemetry';
    }
    if (elements.authPreviewTemp) {
      const tempVal = state.weatherData ? formatTemp(state.weatherData.current.temp) : '18';
      elements.authPreviewTemp.textContent = `${tempVal}°${state.unit}`;
    }
  }

  function openAuthModal(view = 'signIn') {
    if (!elements.authModal) return;
    hideAuthFeedback();
    updateAuthHeroPreview();
    switchAuthView(view);
    elements.authModal.classList.remove('hidden');
  }

  function closeAuthModal() {
    if (!elements.authModal) return;
    elements.authModal.classList.add('hidden');
    hideAuthFeedback();
    if (window.location.pathname !== '/') {
      history.pushState(null, '', '/');
    }
  }

  function switchAuthView(viewName) {
    state.activeAuthView = viewName;
    hideAuthFeedback();

    const views = [
      { name: 'signIn', el: elements.viewSignIn, path: '/login' },
      { name: 'signUp', el: elements.viewSignUp, path: '/signup' },
      { name: 'forgot', el: elements.viewForgot, path: '/forgot-password' },
      { name: 'account', el: elements.viewAccount, path: '/account' }
    ];

    // If account requested but user is not logged in, divert to sign in with message
    if (viewName === 'account' && (!SkyPulseAuth || !SkyPulseAuth.isAuthenticated())) {
      viewName = 'signIn';
      showAuthFeedback('Please sign in or create an account to access your personal profile.', 'info');
    }

    views.forEach(v => {
      if (v.el) {
        v.el.classList.toggle('hidden', v.name !== viewName);
      }
    });

    const active = views.find(v => v.name === viewName);
    if (active && window.location.pathname !== active.path) {
      history.pushState(null, '', active.path);
    }

    if (viewName === 'account') {
      populateAccountProfile();
    }
  }

  function populateAccountCityOptions() {
    if (!elements.accountDefaultCity || typeof WorldWeather === 'undefined') return;
    const countries = WorldWeather.getAll();
    elements.accountDefaultCity.innerHTML = '<option value="">-- Select Default Weather Hub --</option>' +
      countries.map(c => `<option value="${c.city}, ${c.country}">${c.flag} ${c.city}, ${c.country}</option>`).join('');
  }

  function populateAccountProfile() {
    if (typeof SkyPulseAuth === 'undefined') return;
    const user = SkyPulseAuth.getUser();
    if (!user) return;

    const initials = getInitials(user.name || user.email);
    if (elements.accountAvatarLarge) elements.accountAvatarLarge.textContent = initials;
    if (elements.accountUserName) elements.accountUserName.textContent = user.name || 'SkyPulse Explorer';
    if (elements.accountUserEmail) elements.accountUserEmail.textContent = user.email;
    if (elements.accountAuthTag) {
      elements.accountAuthTag.textContent = user.authProvider === 'supabase' 
        ? 'Supabase Cloud Sync' 
        : 'Encrypted Local Vault';
    }

    if (elements.accountPrefUnit) {
      elements.accountPrefUnit.value = user.preferredUnit || state.unit;
    }

    if (elements.accountDefaultCity) {
      elements.accountDefaultCity.value = user.defaultCity || '';
    }

    updateAuthProfileFavs();
  }

  function updateAuthProfileFavs() {
    if (!elements.accountFavsList) return;
    const favs = state.favorites || [];
    if (elements.accountFavCount) elements.accountFavCount.textContent = `${favs.length} locations`;

    if (favs.length === 0) {
      elements.accountFavsList.innerHTML = '<span class="empty-fav-hint">No saved locations yet. Star any country or city!</span>';
      return;
    }

    elements.accountFavsList.innerHTML = favs.map(f => `
      <div class="fav-item-row">
        <span class="fav-item-name" onclick="window.SkyPulseSearchFav('${f}')">⭐ ${f}</span>
        <button class="fav-remove-btn" title="Remove" onclick="window.SkyPulseRemoveFav('${f}')">&times;</button>
      </div>
    `).join('');
  }

  window.SkyPulseSearchFav = function(name) {
    closeAuthModal();
    searchAndSelectFirst(name);
  };

  window.SkyPulseRemoveFav = function(name) {
    const idx = state.favorites.indexOf(name);
    if (idx >= 0) {
      state.favorites.splice(idx, 1);
      saveFavorites();
      updateAuthProfileFavs();
    }
  };

  function updateAuthUI(user) {
    const isAuthenticated = !!user;

    // Header nav button
    if (elements.authNavBtn) {
      if (isAuthenticated) {
        const initials = getInitials(user.name || user.email);
        elements.authNavText.textContent = user.name ? user.name.split(' ')[0] : 'Account';
        elements.authNavIcon.innerHTML = `<span class="user-avatar-tiny">${initials}</span>`;
        elements.authNavBtn.classList.add('is-authenticated');
      } else {
        elements.authNavText.textContent = 'Sign In';
        elements.authNavIcon.innerHTML = WeatherIcons.get('user');
        elements.authNavBtn.classList.remove('is-authenticated');
      }
    }

    // Header dropdown
    if (elements.userDropdownMenu) {
      if (isAuthenticated) {
        const initials = getInitials(user.name || user.email);
        if (elements.userAvatarSmall) elements.userAvatarSmall.textContent = initials;
        if (elements.userHeaderName) elements.userHeaderName.textContent = user.name || 'SkyPulse Explorer';
        if (elements.userHeaderEmail) elements.userHeaderEmail.textContent = user.email;
        if (elements.dropFavCount) elements.dropFavCount.textContent = state.favorites.length;
      }
    }

    // Sync user preferences if provided
    if (isAuthenticated) {
      if (user.preferredUnit && user.preferredUnit !== state.unit) {
        setUnit(user.preferredUnit);
      }
      if (user.favorites && Array.isArray(user.favorites) && user.favorites.length > 0) {
        // Merge favorites
        user.favorites.forEach(f => {
          if (!state.favorites.includes(f)) state.favorites.push(f);
        });
        saveFavorites();
      }
    }
  }

  function handleSpaRouting() {
    const path = window.location.pathname.toLowerCase();
    if (path === '/login') {
      openAuthModal('signIn');
    } else if (path === '/signup') {
      openAuthModal('signUp');
    } else if (path === '/forgot-password') {
      openAuthModal('forgot');
    } else if (path === '/account') {
      openAuthModal('account');
    }
  }

  /**
   * Main Auth Initialization
   */
  async function initAuth() {
    if (typeof SkyPulseAuth === 'undefined') return;

    // Listen to Auth State
    SkyPulseAuth.onAuthStateChange((event, user) => {
      updateAuthUI(user);
    });

    // Initialize vault / session
    await SkyPulseAuth.init();

    // Populate country dropdown for default hub
    populateAccountCityOptions();

    // Setup event handlers
    initAuthEventHandlers();

    // Handle initial SPA route
    handleSpaRouting();

    // Popstate navigation listener
    window.addEventListener('popstate', () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login') openAuthModal('signIn');
      else if (path === '/signup') openAuthModal('signUp');
      else if (path === '/forgot-password') openAuthModal('forgot');
      else if (path === '/account') openAuthModal('account');
      else if (elements.authModal && !elements.authModal.classList.contains('hidden')) {
        closeAuthModal();
      }
    });
  }

  function initAuthEventHandlers() {
    // 1. Header Auth Nav Button
    if (elements.authNavBtn) {
      elements.authNavBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (SkyPulseAuth.isAuthenticated()) {
          elements.userDropdownMenu.classList.toggle('hidden');
        } else {
          openAuthModal('signIn');
        }
      });
    }

    // Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (elements.userDropdownMenu && !elements.userDropdownMenu.classList.contains('hidden')) {
        if (!e.target.closest('#userAuthWrap')) {
          elements.userDropdownMenu.classList.add('hidden');
        }
      }
    });

    // Dropdown items
    if (elements.dropAccountBtn) {
      elements.dropAccountBtn.addEventListener('click', () => {
        elements.userDropdownMenu.classList.add('hidden');
        openAuthModal('account');
      });
    }

    if (elements.dropFavoritesBtn) {
      elements.dropFavoritesBtn.addEventListener('click', () => {
        elements.userDropdownMenu.classList.add('hidden');
        openAuthModal('account');
      });
    }

    if (elements.dropSignOutBtn) {
      elements.dropSignOutBtn.addEventListener('click', async () => {
        elements.userDropdownMenu.classList.add('hidden');
        await SkyPulseAuth.signOut();
        closeAuthModal();
      });
    }

    // Modal Close Button
    if (elements.closeAuthModalBtn) {
      elements.closeAuthModalBtn.addEventListener('click', closeAuthModal);
    }

    // Backdrop click
    if (elements.authModal) {
      elements.authModal.addEventListener('click', (e) => {
        if (e.target === elements.authModal) closeAuthModal();
      });
    }

    // View Navigation Switches
    if (elements.toSignUpBtn) {
      elements.toSignUpBtn.addEventListener('click', () => switchAuthView('signUp'));
    }
    if (elements.toSignInFromRegBtn) {
      elements.toSignInFromRegBtn.addEventListener('click', () => switchAuthView('signIn'));
    }
    if (elements.toForgotBtn) {
      elements.toForgotBtn.addEventListener('click', () => switchAuthView('forgot'));
    }
    if (elements.toSignInFromForgotBtn) {
      elements.toSignInFromForgotBtn.addEventListener('click', () => switchAuthView('signIn'));
    }

    // Show/Hide Password toggles
    if (elements.toggleLoginPwd && elements.loginPassword) {
      elements.toggleLoginPwd.addEventListener('click', () => {
        const isPass = elements.loginPassword.type === 'password';
        elements.loginPassword.type = isPass ? 'text' : 'password';
        elements.toggleLoginPwd.textContent = isPass ? '🙈' : '👁️';
      });
    }

    if (elements.toggleRegPwd && elements.regPassword) {
      elements.toggleRegPwd.addEventListener('click', () => {
        const isPass = elements.regPassword.type === 'password';
        elements.regPassword.type = isPass ? 'text' : 'password';
        elements.toggleRegPwd.textContent = isPass ? '🙈' : '👁️';
      });
    }

    // Password Strength Meter
    if (elements.regPassword && elements.pwdStrengthBar && elements.pwdStrengthText) {
      elements.regPassword.addEventListener('input', () => {
        const val = elements.regPassword.value;
        const res = checkPasswordStrength(val);
        elements.pwdStrengthBar.style.width = res.width;
        elements.pwdStrengthBar.style.backgroundColor = res.color;
        elements.pwdStrengthText.textContent = res.text;
      });
    }

    // 1. Sign In Handlers (Attached to Form submit, Button click & Enter key)
    async function handleSignIn(e) {
      if (e) e.preventDefault();
      hideAuthFeedback();

      const email = elements.loginEmail ? elements.loginEmail.value.trim() : '';
      const pwd = elements.loginPassword ? elements.loginPassword.value : '';
      const rememberMe = elements.loginRememberMe ? elements.loginRememberMe.checked : true;

      if (!email || !pwd) {
        showAuthFeedback('Please enter both your email address and password.', 'error');
        return;
      }

      if (elements.signInSubmitBtn) {
        elements.signInSubmitBtn.disabled = true;
        elements.signInSubmitBtn.innerHTML = '<span class="btn-text">Verifying Credentials...</span>';
      }

      try {
        const user = await SkyPulseAuth.signIn(email, pwd, rememberMe);
        const displayName = (user && (user.name || user.email)) || 'Explorer';
        showAuthFeedback(`Welcome back, ${displayName}! Synchronizing telemetry...`, 'success');
        setTimeout(() => {
          closeAuthModal();
        }, 700);
      } catch (err) {
        showAuthFeedback(err.message || 'Authentication failed. Please check credentials or register.', 'error');
      } finally {
        if (elements.signInSubmitBtn) {
          elements.signInSubmitBtn.disabled = false;
          elements.signInSubmitBtn.innerHTML = '<span class="btn-text">Sign In</span>';
        }
      }
    }

    if (elements.signInForm) elements.signInForm.addEventListener('submit', handleSignIn);
    if (elements.signInSubmitBtn) elements.signInSubmitBtn.addEventListener('click', handleSignIn);

    // 2. Registration (Sign Up) Handlers (Attached to Form submit, Button click & Enter key)
    async function handleSignUp(e) {
      if (e) e.preventDefault();
      hideAuthFeedback();

      const name = elements.regName ? elements.regName.value.trim() : '';
      const email = elements.regEmail ? elements.regEmail.value.trim() : '';
      const pwd = elements.regPassword ? elements.regPassword.value : '';
      const confirmPwd = elements.regConfirmPassword ? elements.regConfirmPassword.value : '';
      const terms = elements.regTerms ? elements.regTerms.checked : true;

      if (!name || !email || !pwd) {
        showAuthFeedback('Please fill out all required fields: Full Name, Email, and Password.', 'error');
        return;
      }

      if (pwd.length < 6) {
        showAuthFeedback('Password must be at least 6 characters long.', 'error');
        return;
      }

      if (pwd !== confirmPwd) {
        showAuthFeedback('Passwords do not match. Please re-enter your password.', 'error');
        return;
      }

      if (!terms) {
        showAuthFeedback('Please accept the SkyPulse terms and telemetry policy.', 'error');
        return;
      }

      if (elements.signUpSubmitBtn) {
        elements.signUpSubmitBtn.disabled = true;
        elements.signUpSubmitBtn.innerHTML = '<span class="btn-text">Creating Encrypted Vault...</span>';
      }

      try {
        const user = await SkyPulseAuth.signUp(name, email, pwd);
        const displayName = (user && (user.name || user.email)) || name;
        showAuthFeedback(`Account created successfully! Welcome to SkyPulse 3.0, ${displayName}.`, 'success');
        if (elements.loginEmail) elements.loginEmail.value = email;
        setTimeout(() => {
          closeAuthModal();
        }, 800);
      } catch (err) {
        showAuthFeedback(err.message || 'Registration failed.', 'error');
      } finally {
        if (elements.signUpSubmitBtn) {
          elements.signUpSubmitBtn.disabled = false;
          elements.signUpSubmitBtn.innerHTML = '<span class="btn-text">Create Account</span>';
        }
      }
    }

    if (elements.signUpForm) elements.signUpForm.addEventListener('submit', handleSignUp);
    if (elements.signUpSubmitBtn) elements.signUpSubmitBtn.addEventListener('click', handleSignUp);

    // 3. Continue as Guest Handlers
    function handleContinueAsGuest(e) {
      if (e) e.preventDefault();
      closeAuthModal();
      showGuestToast();
    }

    if (elements.guestContinueBtn) {
      elements.guestContinueBtn.addEventListener('click', handleContinueAsGuest);
    }
    if (elements.guestContinueRegBtn) {
      elements.guestContinueRegBtn.addEventListener('click', handleContinueAsGuest);
    }

    // Form: Forgot Password Request
    if (elements.forgotForm) {
      elements.forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAuthFeedback();

        const email = elements.forgotEmail.value.trim();
        if (!email) {
          showAuthFeedback('Please provide your registered email address.', 'error');
          return;
        }

        elements.forgotSubmitBtn.disabled = true;
        elements.forgotSubmitBtn.innerHTML = '<span class="btn-text">Generating Recovery Token...</span>';

        try {
          const res = await SkyPulseAuth.requestPasswordReset(email);
          if (res.error) {
            showAuthFeedback(res.error, 'error');
          } else {
            showAuthFeedback(res.message || 'Recovery code generated! Enter your new password below.', 'success');
            if (elements.resetTokenBox) {
              elements.resetTokenBox.classList.remove('hidden');
              if (res.token && elements.resetTokenInput) {
                elements.resetTokenInput.value = res.token;
              }
            }
          }
        } catch (err) {
          showAuthFeedback(err.message || 'Could not process password recovery.', 'error');
        } finally {
          elements.forgotSubmitBtn.disabled = false;
          elements.forgotSubmitBtn.innerHTML = '<span class="btn-text">Send Recovery Instructions</span>';
        }
      });
    }

    // Apply New Password with Recovery Token
    if (elements.applyNewPwdBtn) {
      elements.applyNewPwdBtn.addEventListener('click', async () => {
        hideAuthFeedback();
        const token = elements.resetTokenInput ? elements.resetTokenInput.value.trim() : '';
        const newPwd = elements.resetNewPwd ? elements.resetNewPwd.value : '';

        if (!token || !newPwd) {
          showAuthFeedback('Please provide both the verification token and your new password.', 'error');
          return;
        }

        if (newPwd.length < 6) {
          showAuthFeedback('New password must be at least 6 characters long.', 'error');
          return;
        }

        elements.applyNewPwdBtn.disabled = true;
        elements.applyNewPwdBtn.textContent = 'Updating Vault...';

        try {
          const res = await SkyPulseAuth.resetPassword(token, newPwd);
          if (res.error) {
            showAuthFeedback(res.error, 'error');
          } else {
            showAuthFeedback('Password updated successfully! Please sign in with your new credentials.', 'success');
            setTimeout(() => {
              switchAuthView('signIn');
            }, 1200);
          }
        } catch (err) {
          showAuthFeedback(err.message || 'Failed to update password.', 'error');
        } finally {
          elements.applyNewPwdBtn.disabled = false;
          elements.applyNewPwdBtn.textContent = 'Update Password';
        }
      });
    }

    // Supabase Cloud Sync Accordion Toggle
    if (elements.toggleCloudSyncBtn && elements.cloudSyncDrawer) {
      elements.toggleCloudSyncBtn.addEventListener('click', () => {
        elements.cloudSyncDrawer.classList.toggle('hidden');
        if (elements.cloudChevron) {
          elements.cloudChevron.textContent = elements.cloudSyncDrawer.classList.contains('hidden') ? '▼' : '▲';
        }
        if (!elements.cloudSyncDrawer.classList.contains('hidden')) {
          const cfg = SkyPulseAuth.getSupabaseConfig();
          if (cfg) {
            if (elements.sbUrlInput) elements.sbUrlInput.value = cfg.url || '';
            if (elements.sbKeyInput) elements.sbKeyInput.value = cfg.anonKey || '';
          }
        }
      });
    }

    // Save Supabase Configuration
    if (elements.saveSupabaseConfigBtn) {
      elements.saveSupabaseConfigBtn.addEventListener('click', () => {
        const url = elements.sbUrlInput ? elements.sbUrlInput.value.trim() : '';
        const key = elements.sbKeyInput ? elements.sbKeyInput.value.trim() : '';
        if (!url || !key) {
          showAuthFeedback('Please provide both Supabase Project URL and Anon Public Key.', 'error');
          return;
        }
        SkyPulseAuth.setSupabaseConfig(url, key);
        showAuthFeedback('Supabase configuration saved! Authenticate or refresh to link with cloud database.', 'success');
      });
    }

    // Save Account Preferences (Default Hub & Unit)
    if (elements.saveAccountPrefsBtn) {
      elements.saveAccountPrefsBtn.addEventListener('click', async () => {
        const defaultCity = elements.accountDefaultCity ? elements.accountDefaultCity.value : '';
        const prefUnit = elements.accountPrefUnit ? elements.accountPrefUnit.value : state.unit;

        if (prefUnit !== state.unit) {
          setUnit(prefUnit);
        }

        const updates = { defaultCity, preferredUnit: prefUnit };
        await SkyPulseAuth.updateProfile(updates);
        showAuthFeedback('Preferences updated and saved to your profile!', 'success');

        if (defaultCity) {
          searchAndSelectFirst(defaultCity);
        }
      });
    }

    // Account Profile Sign Out
    if (elements.accountSignOutBtn) {
      elements.accountSignOutBtn.addEventListener('click', async () => {
        await SkyPulseAuth.signOut();
        closeAuthModal();
      });
    }
  }

  // Global helper for Leaflet popups
  window.SkyPulseFocus = function (city, country, lat, lon, condition) {
    const location = {
      name: `${city}, ${country}`,
      country: country,
      admin: city,
      lat: lat,
      lon: lon
    };
    elements.searchInput.value = `${city}, ${country}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadWeatherData(location, condition);
  };

  // Start application on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
