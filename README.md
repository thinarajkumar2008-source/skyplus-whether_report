# SkyPulse Weather App 🌦️

A modern, responsive, and feature-rich weather dashboard application built with vanilla HTML5, CSS3, and modern JavaScript. SkyPulse provides real-time current conditions, a 24-hour hourly forecast timeline, and a 7-day extended forecast with dynamic adaptive glassmorphism styling.

![SkyPulse Weather Dashboard](assets/preview.png)

---

## 🚀 Key Features

### 1. API Connectivity & Architecture
- **Dual Weather API Integration:**
  - **Open-Meteo Global Weather API (Default):** High-precision real-time meteorological data with zero API key configuration needed. Works instantly worldwide out of the box.
  - **OpenWeatherMap (OWM 2.5 API):** Fully supported for official OpenWeatherMap telemetry. Users can enter their personal API key in the in-app **API Setup** modal.
- **Fail-Safe Fallback:** If an OpenWeatherMap API key fails or hits rate limits, the app automatically switches to live Open-Meteo data so the interface never crashes or displays blank cards.
- **Unified Data Normalizer:** All API responses are transformed into a clean, normalized schema for maintainability and modularity.

### 2. Current Atmospheric Overview
- **Hero Card:** City name, administrative region, country, and local timestamp.
- **Temperature Display:** Current temperature with instant **°C / °F** unit toggle.
- **Detailed Stats:** Feels-like temperature, daily high/low temperatures, and animated condition badges.
- **Vector SVG Icons:** Crisp, scalable SVG weather graphics that render offline without third-party image latency.

### 3. Comprehensive Atmospheric Metrics
- **Wind Speed & Direction:** Speed in km/h or mph with compass cardinal directions (e.g. `SSE 13 km/h`).
- **Humidity:** Percentage indicator with a visual gradient progress bar and comfort status.
- **UV Index:** Solar radiation level with safety tags (`Low`, `Moderate`, `High`, `Very High`) and exposure guidelines.
- **Air Pressure:** Real-time atmospheric pressure in hPa.
- **Visibility:** Visual distance in kilometers or miles.
- **Sun Schedule:** Sunrise and sunset times.

### 4. Forecast Capabilities
- **24-Hour Hourly Forecast:** Horizontal scrollable card slider showing upcoming hourly temperatures, conditions, and precipitation probabilities (`%`).
- **Interactive Temperature Curve:** Toggleable canvas graph rendering a smooth quadratic Bezier temperature curve across the day.
- **7-Day Extended Forecast:** Daily breakdown showing day name, weather icon, condition description, and high/low temperature bounds.

### 5. Search & Geolocation
- **Live Autocomplete Search:** Instant city suggestions with administrative region and country codes as you type.
- **Quick City Pills:** One-click shortcuts for popular global hubs (London, New York, Tokyo, Paris, Sydney, Dubai).
- **HTML5 Geolocation:** "Locate Me" button to retrieve local atmospheric data for the user's current GPS coordinates.
- **Persistence:** Remembers the last viewed location and selected temperature unit (`°C` / `°F`) using `localStorage`.

### 6. 100 Countries Global Weather Hub 🌍
- **Curated 100 Nations Dataset:** Comprehensive coverage spanning Europe (26), Asia (26), Americas (22), Africa (20), and Oceania (6).
- **Global Overview Stats:** Real-time summary widgets showcasing the Warmest Country, Coldest Country, Global Average Temperature, and Monitored Nations count.
- **Instant Search & Continent Filtering:** Filter countries dynamically by name, capital city, or continent pills (`All`, `Europe`, `Asia`, `Americas`, `Africa`, `Oceania`).
- **Sorting Options:** Sort alphabetically (A-Z, Z-A) or by temperature (Warmest First, Coldest First).
- **Interactive Deep-Dive:** Clicking any of the 100 country cards instantly loads its complete 24-hour hourly curve and 7-day forecast into the main dashboard.
- **Batch Live Fetching & Caching:** Batched coordinates query to Open-Meteo with localStorage caching for instant startup.

### 7. Responsive UI & Dynamic Themes
- **Adaptive Ambient Themes:** Background colors and glows dynamically adjust to the current weather condition (`sunny`, `cloudy`, `rainy`, `stormy`, `snowy`, `night`).
- **Glassmorphism Design:** Modern translucent cards, backdrop filters, and typography.
- **Fully Responsive:** Adapts from mobile phone screens to tablets and wide desktop monitors.

---

## 📁 Project Structure

```text
weather-app/
├── index.html          # Semantic HTML5 markup, dashboard & 100 Countries Hub
├── start.bat           # One-click Windows desktop server launcher
├── server.js           # Lightweight zero-dependency HTTP server
├── css/
│   └── style.css       # Glassmorphism design, responsive grid, 100-country cards & themes
├── js/
│   ├── api.js          # Open-Meteo & OpenWeatherMap API normalization service
│   ├── countries.js    # 100 Countries global dataset, batch fetcher, filters & stats
│   ├── icons.js        # High-definition standalone SVG weather icons library
│   └── app.js          # App controller, state management, search, and chart
├── assets/
│   └── preview.png     # Application preview screenshot
└── README.md           # Documentation and setup guide
```

---

## 🛠️ How to Run

No heavy build steps or package installations are required!

### Option 1: Direct Browser Launch
1. Double-click `index.html` or drag it into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
2. The app will immediately load live weather data for London.

### Option 2: Local HTTP Server (Recommended)
You can serve the directory using any lightweight web server:

```bash
# Using Node.js (npx serve)
npx serve .

# Or using Python 3
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

---

## ⚙️ Configuring OpenWeatherMap (Optional)

1. Click the **API Setup** button in the top navigation bar.
2. Select **OpenWeatherMap (2.5 API)**.
3. Paste your OpenWeatherMap API Key and click **Save Key**.
4. Click **Apply & Refresh**.

If you do not have an API key, the default **Open-Meteo Global API** provides full real-time global weather and forecasts without registration or keys.
