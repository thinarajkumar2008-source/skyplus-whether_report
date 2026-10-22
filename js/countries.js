/**
 * SkyPulse Weather App - 100 Countries Global Weather Hub
 * Curated dataset of 100 nations worldwide with live atmospheric telemetry.
 */

const WorldWeather = (function () {
  const STORAGE_KEY = 'sky_pulse_world_cache';

  // 100 Curated Countries spanning Europe, Asia, Americas, Africa, and Oceania
  const COUNTRIES = [
    // --- EUROPE (26) ---
    { id: 1, country: 'United Kingdom', city: 'London', flag: '🇬🇧', region: 'Europe', code: 'GB', lat: 51.5074, lon: -0.1278, temp: 15, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 72, wind: 14 },
    { id: 2, country: 'France', city: 'Paris', flag: '🇫🇷', region: 'Europe', code: 'FR', lat: 48.8566, lon: 2.3522, temp: 17, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 65, wind: 11 },
    { id: 3, country: 'Germany', city: 'Berlin', flag: '🇩🇪', region: 'Europe', code: 'DE', lat: 52.5200, lon: 13.4050, temp: 14, condition: 'Overcast', icon: 'cloud', humidity: 70, wind: 16 },
    { id: 4, country: 'Italy', city: 'Rome', flag: '🇮🇹', region: 'Europe', code: 'IT', lat: 41.9028, lon: 12.4964, temp: 22, condition: 'Clear Sky', icon: 'sun', humidity: 58, wind: 9 },
    { id: 5, country: 'Spain', city: 'Madrid', flag: '🇪🇸', region: 'Europe', code: 'ES', lat: 40.4168, lon: -3.7038, temp: 21, condition: 'Clear Sky', icon: 'sun', humidity: 45, wind: 8 },
    { id: 6, country: 'Netherlands', city: 'Amsterdam', flag: '🇳🇱', region: 'Europe', code: 'NL', lat: 52.3676, lon: 4.9041, temp: 14, condition: 'Cloudy', icon: 'cloud', humidity: 76, wind: 19 },
    { id: 7, country: 'Switzerland', city: 'Bern', flag: '🇨🇭', region: 'Europe', code: 'CH', lat: 46.9480, lon: 7.4474, temp: 13, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 68, wind: 7 },
    { id: 8, country: 'Sweden', city: 'Stockholm', flag: '🇸🇪', region: 'Europe', code: 'SE', lat: 59.3293, lon: 18.0686, temp: 9, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 69, wind: 13 },
    { id: 9, country: 'Norway', city: 'Oslo', flag: '🇳🇴', region: 'Europe', code: 'NO', lat: 59.9139, lon: 10.7522, temp: 8, condition: 'Overcast', icon: 'cloud', humidity: 74, wind: 10 },
    { id: 10, country: 'Poland', city: 'Warsaw', flag: '🇵🇱', region: 'Europe', code: 'PL', lat: 52.2297, lon: 21.0122, temp: 12, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 67, wind: 15 },
    { id: 11, country: 'Portugal', city: 'Lisbon', flag: '🇵🇹', region: 'Europe', code: 'PT', lat: 38.7223, lon: -9.1393, temp: 23, condition: 'Sunny', icon: 'sun', humidity: 60, wind: 14 },
    { id: 12, country: 'Greece', city: 'Athens', flag: '🇬🇷', region: 'Europe', code: 'GR', lat: 37.9838, lon: 23.7275, temp: 24, condition: 'Clear Sky', icon: 'sun', humidity: 50, wind: 12 },
    { id: 13, country: 'Ireland', city: 'Dublin', flag: '🇮🇪', region: 'Europe', code: 'IE', lat: 53.3498, lon: -6.2603, temp: 13, condition: 'Light Rain', icon: 'cloud-rain', humidity: 82, wind: 22 },
    { id: 14, country: 'Austria', city: 'Vienna', flag: '🇦🇹', region: 'Europe', code: 'AT', lat: 48.2082, lon: 16.3738, temp: 15, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 64, wind: 11 },
    { id: 15, country: 'Belgium', city: 'Brussels', flag: '🇧🇪', region: 'Europe', code: 'BE', lat: 50.8503, lon: 4.3517, temp: 14, condition: 'Overcast', icon: 'cloud', humidity: 75, wind: 16 },
    { id: 16, country: 'Denmark', city: 'Copenhagen', flag: '🇩🇰', region: 'Europe', code: 'DK', lat: 55.6761, lon: 12.5683, temp: 11, condition: 'Cloudy', icon: 'cloud', humidity: 78, wind: 18 },
    { id: 17, country: 'Finland', city: 'Helsinki', flag: '🇫🇮', region: 'Europe', code: 'FI', lat: 60.1699, lon: 24.9384, temp: 7, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 73, wind: 15 },
    { id: 18, country: 'Czech Republic', city: 'Prague', flag: '🇨🇿', region: 'Europe', code: 'CZ', lat: 50.0755, lon: 14.4378, temp: 13, condition: 'Clear Sky', icon: 'sun', humidity: 66, wind: 10 },
    { id: 19, country: 'Hungary', city: 'Budapest', flag: '🇭🇺', region: 'Europe', code: 'HU', lat: 47.4979, lon: 19.0402, temp: 16, condition: 'Clear Sky', icon: 'sun', humidity: 61, wind: 9 },
    { id: 20, country: 'Romania', city: 'Bucharest', flag: '🇷🇴', region: 'Europe', code: 'RO', lat: 44.4268, lon: 26.1025, temp: 17, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 59, wind: 11 },
    { id: 21, country: 'Ukraine', city: 'Kyiv', flag: '🇺🇦', region: 'Europe', code: 'UA', lat: 50.4501, lon: 30.5234, temp: 11, condition: 'Overcast', icon: 'cloud', humidity: 71, wind: 14 },
    { id: 22, country: 'Turkey', city: 'Ankara', flag: '🇹🇷', region: 'Europe', code: 'TR', lat: 39.9334, lon: 32.8597, temp: 18, condition: 'Clear Sky', icon: 'sun', humidity: 48, wind: 10 },
    { id: 23, country: 'Iceland', city: 'Reykjavik', flag: '🇮🇸', region: 'Europe', code: 'IS', lat: 64.1466, lon: -21.9426, temp: 4, condition: 'Showers', icon: 'cloud-rain', humidity: 85, wind: 28 },
    { id: 24, country: 'Croatia', city: 'Zagreb', flag: '🇭🇷', region: 'Europe', code: 'HR', lat: 45.8150, lon: 15.9819, temp: 18, condition: 'Clear Sky', icon: 'sun', humidity: 62, wind: 8 },
    { id: 25, country: 'Serbia', city: 'Belgrade', flag: '🇷🇸', region: 'Europe', code: 'RS', lat: 44.7866, lon: 20.4489, temp: 19, condition: 'Sunny', icon: 'sun', humidity: 57, wind: 10 },
    { id: 26, country: 'Bulgaria', city: 'Sofia', flag: '🇧🇬', region: 'Europe', code: 'BG', lat: 42.6977, lon: 23.3219, temp: 16, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 63, wind: 9 },

    // --- ASIA (26) ---
    { id: 27, country: 'Japan', city: 'Tokyo', flag: '🇯🇵', region: 'Asia', code: 'JP', lat: 35.6762, lon: 139.6503, temp: 22, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 61, wind: 13 },
    { id: 28, country: 'China', city: 'Beijing', flag: '🇨🇳', region: 'Asia', code: 'CN', lat: 39.9042, lon: 116.4074, temp: 19, condition: 'Clear Sky', icon: 'sun', humidity: 45, wind: 11 },
    { id: 29, country: 'India', city: 'New Delhi', flag: '🇮🇳', region: 'Asia', code: 'IN', lat: 28.6139, lon: 77.2090, temp: 31, condition: 'Sunny', icon: 'sun', humidity: 52, wind: 9 },
    { id: 30, country: 'South Korea', city: 'Seoul', flag: '🇰🇷', region: 'Asia', code: 'KR', lat: 37.5665, lon: 126.9780, temp: 20, condition: 'Clear Sky', icon: 'sun', humidity: 55, wind: 10 },
    { id: 31, country: 'Singapore', city: 'Singapore', flag: '🇸🇬', region: 'Asia', code: 'SG', lat: 1.3521, lon: 103.8198, temp: 30, condition: 'Scattered Showers', icon: 'cloud-rain', humidity: 81, wind: 12 },
    { id: 32, country: 'Indonesia', city: 'Jakarta', flag: '🇮🇩', region: 'Asia', code: 'ID', lat: -6.2088, lon: 106.8456, temp: 31, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 78, wind: 10 },
    { id: 33, country: 'Thailand', city: 'Bangkok', flag: '🇹🇭', region: 'Asia', code: 'TH', lat: 13.7563, lon: 100.5018, temp: 32, condition: 'Tropical Rain', icon: 'cloud-rain', humidity: 79, wind: 11 },
    { id: 34, country: 'Malaysia', city: 'Kuala Lumpur', flag: '🇲🇾', region: 'Asia', code: 'MY', lat: 3.1390, lon: 101.6869, temp: 31, condition: 'Thunderstorm', icon: 'cloud-lightning', humidity: 83, wind: 8 },
    { id: 35, country: 'Vietnam', city: 'Hanoi', flag: '🇻🇳', region: 'Asia', code: 'VN', lat: 21.0285, lon: 105.8542, temp: 28, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 74, wind: 12 },
    { id: 36, country: 'Philippines', city: 'Manila', flag: '🇵🇭', region: 'Asia', code: 'PH', lat: 14.5995, lon: 120.9842, temp: 30, condition: 'Rain Showers', icon: 'cloud-rain', humidity: 80, wind: 14 },
    { id: 37, country: 'Saudi Arabia', city: 'Riyadh', flag: '🇸🇦', region: 'Asia', code: 'SA', lat: 24.7136, lon: 46.6753, temp: 35, condition: 'Sunny & Hot', icon: 'sun', humidity: 18, wind: 16 },
    { id: 38, country: 'United Arab Emirates', city: 'Abu Dhabi', flag: '🇦🇪', region: 'Asia', code: 'AE', lat: 24.4539, lon: 54.3773, temp: 34, condition: 'Clear Sky', icon: 'sun', humidity: 55, wind: 15 },
    { id: 39, country: 'Qatar', city: 'Doha', flag: '🇶🇦', region: 'Asia', code: 'QA', lat: 25.2854, lon: 51.5310, temp: 34, condition: 'Sunny', icon: 'sun', humidity: 58, wind: 17 },
    { id: 40, country: 'Israel', city: 'Jerusalem', flag: '🇮🇱', region: 'Asia', code: 'IL', lat: 31.7683, lon: 35.2137, temp: 26, condition: 'Clear Sky', icon: 'sun', humidity: 44, wind: 13 },
    { id: 41, country: 'Pakistan', city: 'Islamabad', flag: '🇵🇰', region: 'Asia', code: 'PK', lat: 33.6844, lon: 73.0479, temp: 29, condition: 'Sunny', icon: 'sun', humidity: 48, wind: 8 },
    { id: 42, country: 'Bangladesh', city: 'Dhaka', flag: '🇧🇩', region: 'Asia', code: 'BD', lat: 23.8103, lon: 90.4125, temp: 31, condition: 'Hazy Sun', icon: 'sun-cloud', humidity: 72, wind: 10 },
    { id: 43, country: 'Sri Lanka', city: 'Colombo', flag: '🇱🇰', region: 'Asia', code: 'LK', lat: 6.9271, lon: 79.8612, temp: 29, condition: 'Drizzle', icon: 'cloud-drizzle', humidity: 82, wind: 14 },
    { id: 44, country: 'Nepal', city: 'Kathmandu', flag: '🇳🇵', region: 'Asia', code: 'NP', lat: 27.7172, lon: 85.3240, temp: 22, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 60, wind: 6 },
    { id: 45, country: 'Kazakhstan', city: 'Astana', flag: '🇰🇿', region: 'Asia', code: 'KZ', lat: 51.1694, lon: 71.4491, temp: 9, condition: 'Breezy & Cool', icon: 'wind', humidity: 65, wind: 24 },
    { id: 46, country: 'Uzbekistan', city: 'Tashkent', flag: '🇺🇿', region: 'Asia', code: 'UZ', lat: 41.2995, lon: 69.2401, temp: 21, condition: 'Clear Sky', icon: 'sun', humidity: 40, wind: 9 },
    { id: 47, country: 'Kuwait', city: 'Kuwait City', flag: '🇰🇼', region: 'Asia', code: 'KW', lat: 29.3759, lon: 47.9774, temp: 36, condition: 'Clear Sky', icon: 'sun', humidity: 24, wind: 16 },
    { id: 48, country: 'Oman', city: 'Muscat', flag: '🇴🇲', region: 'Asia', code: 'OM', lat: 23.5880, lon: 58.3829, temp: 33, condition: 'Sunny', icon: 'sun', humidity: 52, wind: 14 },
    { id: 49, country: 'Jordan', city: 'Amman', flag: '🇯🇴', region: 'Asia', code: 'JO', lat: 31.9454, lon: 35.9284, temp: 25, condition: 'Clear Sky', icon: 'sun', humidity: 46, wind: 12 },
    { id: 50, country: 'Lebanon', city: 'Beirut', flag: '🇱🇧', region: 'Asia', code: 'LB', lat: 33.8938, lon: 35.5018, temp: 26, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 63, wind: 15 },
    { id: 51, country: 'Mongolia', city: 'Ulaanbaatar', flag: '🇲🇳', region: 'Asia', code: 'MN', lat: 47.8864, lon: 106.9057, temp: 3, condition: 'Chilly', icon: 'cloud', humidity: 55, wind: 18 },
    { id: 52, country: 'Taiwan', city: 'Taipei', flag: '🇹🇼', region: 'Asia', code: 'TW', lat: 25.0330, lon: 121.5654, temp: 27, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 76, wind: 15 },

    // --- AMERICAS (22) ---
    { id: 53, country: 'United States', city: 'Washington D.C.', flag: '🇺🇸', region: 'Americas', code: 'US', lat: 38.9072, lon: -77.0369, temp: 18, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 59, wind: 13 },
    { id: 54, country: 'Canada', city: 'Ottawa', flag: '🇨🇦', region: 'Americas', code: 'CA', lat: 45.4215, lon: -75.6972, temp: 12, condition: 'Overcast', icon: 'cloud', humidity: 68, wind: 15 },
    { id: 55, country: 'Mexico', city: 'Mexico City', flag: '🇲🇽', region: 'Americas', code: 'MX', lat: 19.4326, lon: -99.1332, temp: 21, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 51, wind: 9 },
    { id: 56, country: 'Brazil', city: 'Brasília', flag: '🇧🇷', region: 'Americas', code: 'BR', lat: -15.8267, lon: -47.9218, temp: 28, condition: 'Sunny', icon: 'sun', humidity: 54, wind: 12 },
    { id: 57, country: 'Argentina', city: 'Buenos Aires', flag: '🇦🇷', region: 'Americas', code: 'AR', lat: -34.6037, lon: -58.3816, temp: 19, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 62, wind: 16 },
    { id: 58, country: 'Colombia', city: 'Bogotá', flag: '🇨🇴', region: 'Americas', code: 'CO', lat: 4.7110, lon: -74.0721, temp: 17, condition: 'Rain Showers', icon: 'cloud-rain', humidity: 77, wind: 10 },
    { id: 59, country: 'Chile', city: 'Santiago', flag: '🇨🇱', region: 'Americas', code: 'CL', lat: -33.4489, lon: -70.6693, temp: 22, condition: 'Clear Sky', icon: 'sun', humidity: 49, wind: 11 },
    { id: 60, country: 'Peru', city: 'Lima', flag: '🇵🇪', region: 'Americas', code: 'PE', lat: -12.0464, lon: -77.0428, temp: 19, condition: 'Overcast & Fog', icon: 'cloud-fog', humidity: 82, wind: 13 },
    { id: 61, country: 'Cuba', city: 'Havana', flag: '🇨🇺', region: 'Americas', code: 'CU', lat: 23.1136, lon: -82.3666, temp: 29, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 73, wind: 16 },
    { id: 62, country: 'Jamaica', city: 'Kingston', flag: '🇯🇲', region: 'Americas', code: 'JM', lat: 17.9712, lon: -76.7936, temp: 31, condition: 'Sunny & Warm', icon: 'sun', humidity: 70, wind: 18 },
    { id: 63, country: 'Costa Rica', city: 'San José', flag: '🇨🇷', region: 'Americas', code: 'CR', lat: 9.9281, lon: -84.0907, temp: 24, condition: 'Passing Showers', icon: 'cloud-rain', humidity: 80, wind: 10 },
    { id: 64, country: 'Panama', city: 'Panama City', flag: '🇵🇦', region: 'Americas', code: 'PA', lat: 8.9824, lon: -79.5199, temp: 30, condition: 'Thunderstorm', icon: 'cloud-lightning', humidity: 84, wind: 12 },
    { id: 65, country: 'Ecuador', city: 'Quito', flag: '🇪🇨', region: 'Americas', code: 'EC', lat: -0.1807, lon: -78.4678, temp: 18, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 66, wind: 9 },
    { id: 66, country: 'Venezuela', city: 'Caracas', flag: '🇻🇪', region: 'Americas', code: 'VE', lat: 10.4806, lon: -66.9036, temp: 27, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 68, wind: 10 },
    { id: 67, country: 'Uruguay', city: 'Montevideo', flag: '🇺🇾', region: 'Americas', code: 'UY', lat: -34.9011, lon: -56.1645, temp: 18, condition: 'Breezy', icon: 'wind', humidity: 65, wind: 22 },
    { id: 68, country: 'Dominican Republic', city: 'Santo Domingo', flag: '🇩🇴', region: 'Americas', code: 'DO', lat: 18.4861, lon: -69.9312, temp: 30, condition: 'Sunny', icon: 'sun', humidity: 74, wind: 15 },
    { id: 69, country: 'Bolivia', city: 'La Paz', flag: '🇧🇴', region: 'Americas', code: 'BO', lat: -16.5000, lon: -68.1500, temp: 14, condition: 'Clear Sky', icon: 'sun', humidity: 42, wind: 11 },
    { id: 70, country: 'Guatemala', city: 'Guatemala City', flag: '🇬🇹', region: 'Americas', code: 'GT', lat: 14.6349, lon: -90.5069, temp: 23, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 67, wind: 12 },
    { id: 71, country: 'Paraguay', city: 'Asunción', flag: '🇵🇾', region: 'Americas', code: 'PY', lat: -25.2637, lon: -57.5759, temp: 29, condition: 'Warm & Sunny', icon: 'sun', humidity: 56, wind: 13 },
    { id: 72, country: 'El Salvador', city: 'San Salvador', flag: '🇸🇻', region: 'Americas', code: 'SV', lat: 13.6929, lon: -89.2182, temp: 28, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 71, wind: 10 },
    { id: 73, country: 'Honduras', city: 'Tegucigalpa', flag: '🇭🇳', region: 'Americas', code: 'HN', lat: 14.0723, lon: -87.1921, temp: 26, condition: 'Passing Clouds', icon: 'cloud-sun', humidity: 69, wind: 11 },
    { id: 74, country: 'Trinidad and Tobago', city: 'Port of Spain', flag: '🇹🇹', region: 'Americas', code: 'TT', lat: 10.6549, lon: -61.5019, temp: 30, condition: 'Scattered Showers', icon: 'cloud-rain', humidity: 78, wind: 17 },

    // --- AFRICA (20) ---
    { id: 75, country: 'Egypt', city: 'Cairo', flag: '🇪🇬', region: 'Africa', code: 'EG', lat: 30.0444, lon: 31.2357, temp: 30, condition: 'Sunny', icon: 'sun', humidity: 46, wind: 14 },
    { id: 76, country: 'South Africa', city: 'Pretoria', flag: '🇿🇦', region: 'Africa', code: 'ZA', lat: -25.7479, lon: 28.2293, temp: 25, condition: 'Clear Sky', icon: 'sun', humidity: 38, wind: 12 },
    { id: 77, country: 'Nigeria', city: 'Abuja', flag: '🇳🇬', region: 'Africa', code: 'NG', lat: 9.0765, lon: 7.3986, temp: 31, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 72, wind: 9 },
    { id: 78, country: 'Kenya', city: 'Nairobi', flag: '🇰🇪', region: 'Africa', code: 'KE', lat: -1.2921, lon: 36.8219, temp: 24, condition: 'Pleasant & Mild', icon: 'cloud-sun', humidity: 58, wind: 13 },
    { id: 79, country: 'Morocco', city: 'Rabat', flag: '🇲🇦', region: 'Africa', code: 'MA', lat: 34.0209, lon: -6.8416, temp: 23, condition: 'Sunny', icon: 'sun', humidity: 64, wind: 12 },
    { id: 80, country: 'Ghana', city: 'Accra', flag: '🇬🇭', region: 'Africa', code: 'GH', lat: 5.6037, lon: -0.1870, temp: 29, condition: 'Warm & Humid', icon: 'cloud-sun', humidity: 81, wind: 15 },
    { id: 81, country: 'Ethiopia', city: 'Addis Ababa', flag: '🇪🇹', region: 'Africa', code: 'ET', lat: 9.0300, lon: 38.7400, temp: 20, condition: 'Clear Sky', icon: 'sun', humidity: 52, wind: 9 },
    { id: 82, country: 'Tanzania', city: 'Dodoma', flag: '🇹🇿', region: 'Africa', code: 'TZ', lat: -6.1630, lon: 35.7516, temp: 28, condition: 'Breezy & Sunny', icon: 'sun', humidity: 47, wind: 18 },
    { id: 83, country: 'Algeria', city: 'Algiers', flag: '🇩🇿', region: 'Africa', code: 'DZ', lat: 36.7538, lon: 3.0588, temp: 24, condition: 'Clear Sky', icon: 'sun', humidity: 60, wind: 11 },
    { id: 84, country: 'Tunisia', city: 'Tunis', flag: '🇹🇳', region: 'Africa', code: 'TN', lat: 36.8065, lon: 10.1815, temp: 25, condition: 'Sunny', icon: 'sun', humidity: 57, wind: 14 },
    { id: 85, country: 'Uganda', city: 'Kampala', flag: '🇺🇬', region: 'Africa', code: 'UG', lat: 0.3476, lon: 32.5825, temp: 26, condition: 'Tropical Rain', icon: 'cloud-rain', humidity: 76, wind: 8 },
    { id: 86, country: 'Senegal', city: 'Dakar', flag: '🇸🇳', region: 'Africa', code: 'SN', lat: 14.7167, lon: -17.4677, temp: 29, condition: 'Ocean Breeze', icon: 'wind', humidity: 75, wind: 21 },
    { id: 87, country: 'Rwanda', city: 'Kigali', flag: '🇷🇼', region: 'Africa', code: 'RW', lat: -1.9706, lon: 30.1044, temp: 25, condition: 'Mild Clouds', icon: 'cloud-sun', humidity: 63, wind: 7 },
    { id: 88, country: 'Zimbabwe', city: 'Harare', flag: '🇿🇼', region: 'Africa', code: 'ZW', lat: -17.8216, lon: 31.0492, temp: 27, condition: 'Sunny & Warm', icon: 'sun', humidity: 41, wind: 13 },
    { id: 89, country: 'Ivory Coast', city: 'Yamoussoukro', flag: '🇨🇮', region: 'Africa', code: 'CI', lat: 6.8276, lon: -5.2893, temp: 30, condition: 'Humid & Overcast', icon: 'cloud', humidity: 80, wind: 8 },
    { id: 90, country: 'Cameroon', city: 'Yaoundé', flag: '🇨🇲', region: 'Africa', code: 'CM', lat: 3.8480, lon: 11.5021, temp: 27, condition: 'Rain Showers', icon: 'cloud-rain', humidity: 83, wind: 7 },
    { id: 91, country: 'Madagascar', city: 'Antananarivo', flag: '🇲🇬', region: 'Africa', code: 'MG', lat: -18.8792, lon: 47.5079, temp: 23, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 65, wind: 12 },
    { id: 92, country: 'Mauritius', city: 'Port Louis', flag: '🇲🇺', region: 'Africa', code: 'MU', lat: -20.1609, lon: 57.5012, temp: 26, condition: 'Coastal Sun', icon: 'sun', humidity: 71, wind: 19 },
    { id: 93, country: 'Angola', city: 'Luanda', flag: '🇦🇴', region: 'Africa', code: 'AO', lat: -8.8390, lon: 13.2894, temp: 28, condition: 'Partly Cloudy', icon: 'cloud-sun', humidity: 74, wind: 15 },
    { id: 94, country: 'Zambia', city: 'Lusaka', flag: '🇿🇲', region: 'Africa', code: 'ZM', lat: -15.3875, lon: 28.3228, temp: 28, condition: 'Clear Sky', icon: 'sun', humidity: 43, wind: 14 },

    // --- OCEANIA (6) ---
    { id: 95, country: 'Australia', city: 'Canberra', flag: '🇦🇺', region: 'Oceania', code: 'AU', lat: -35.2809, lon: 149.1300, temp: 18, condition: 'Clear Sky', icon: 'sun', humidity: 55, wind: 15 },
    { id: 96, country: 'New Zealand', city: 'Wellington', flag: '🇳🇿', region: 'Oceania', code: 'NZ', lat: -41.2865, lon: 174.7762, temp: 14, condition: 'Breezy & Cool', icon: 'wind', humidity: 74, wind: 26 },
    { id: 97, country: 'Fiji', city: 'Suva', flag: '🇫🇯', region: 'Oceania', code: 'FJ', lat: -18.1248, lon: 178.4501, temp: 28, condition: 'Tropical Showers', icon: 'cloud-rain', humidity: 82, wind: 17 },
    { id: 98, country: 'Papua New Guinea', city: 'Port Moresby', flag: '🇵🇬', region: 'Oceania', code: 'PG', lat: -9.4438, lon: 147.1803, temp: 31, condition: 'Warm & Sunny', icon: 'sun', humidity: 75, wind: 16 },
    { id: 99, country: 'Samoa', city: 'Apia', flag: '🇼🇸', region: 'Oceania', code: 'WS', lat: -13.8333, lon: -171.7667, temp: 29, condition: 'Passing Showers', icon: 'cloud-rain', humidity: 79, wind: 14 },
    { id: 100, country: 'Vanuatu', city: 'Port Vila', flag: '🇻🇺', region: 'Oceania', code: 'VU', lat: -17.7333, lon: 168.3273, temp: 28, condition: 'Mainly Clear', icon: 'sun-cloud', humidity: 76, wind: 15 }
  ];

  // WMO Code Map for Open-Meteo normalization
  const WMO_MAP = {
    0: { condition: 'Clear Sky', icon: 'sun' },
    1: { condition: 'Mainly Clear', icon: 'sun-cloud' },
    2: { condition: 'Partly Cloudy', icon: 'cloud-sun' },
    3: { condition: 'Overcast', icon: 'cloud' },
    45: { condition: 'Fog', icon: 'cloud-fog' },
    48: { condition: 'Rime Fog', icon: 'cloud-fog' },
    51: { condition: 'Light Drizzle', icon: 'cloud-drizzle' },
    53: { condition: 'Drizzle', icon: 'cloud-drizzle' },
    55: { condition: 'Dense Drizzle', icon: 'cloud-drizzle' },
    61: { condition: 'Slight Rain', icon: 'cloud-rain' },
    63: { condition: 'Moderate Rain', icon: 'cloud-rain' },
    65: { condition: 'Heavy Rain', icon: 'cloud-heavy-rain' },
    71: { condition: 'Slight Snow', icon: 'snowflake' },
    73: { condition: 'Moderate Snow', icon: 'snowflake' },
    75: { condition: 'Heavy Snow', icon: 'snowflake' },
    80: { condition: 'Showers', icon: 'cloud-rain' },
    81: { condition: 'Showers', icon: 'cloud-heavy-rain' },
    82: { condition: 'Violent Showers', icon: 'cloud-heavy-rain' },
    95: { condition: 'Thunderstorm', icon: 'cloud-lightning' }
  };

  // State
  let items = [...COUNTRIES];
  let isFetching = false;
  let lastSyncTime = null;

  // Load cached updates if available
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed.items) && parsed.items.length === 100) {
        items = parsed.items;
        lastSyncTime = parsed.timestamp;
      }
    }
  } catch (e) {
    console.warn('Could not read cached world weather:', e);
  }

  /**
   * Fetch live weather for all 100 countries in 2 optimized batch API calls
   */
  async function fetchLiveBatch(onProgress) {
    if (isFetching) return;
    isFetching = true;

    try {
      const batchSize = 50;
      const batches = [
        items.slice(0, batchSize),
        items.slice(batchSize, 100)
      ];

      for (let b = 0; b < batches.length; b++) {
        const batch = batches[b];
        const lats = batch.map(c => c.lat).join(',');
        const lons = batch.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

        try {
          let data = null;
          if (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
            try {
              const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
              const pRes = await fetch(proxyUrl);
              if (pRes.ok) data = await pRes.json();
            } catch (pErr) {}
          }
          if (!data) {
            const res = await fetch(url);
            if (res.ok) data = await res.json();
          }

          if (data) {
            const results = Array.isArray(data) ? data : [data];

            results.forEach((itemData, idx) => {
              const countryIndex = (b * batchSize) + idx;
              if (items[countryIndex] && itemData.current) {
                const cur = itemData.current;
                const mapped = WMO_MAP[cur.weather_code] || { condition: 'Fair', icon: 'sun-cloud' };
                items[countryIndex].temp = Math.round(cur.temperature_2m);
                items[countryIndex].humidity = Math.round(cur.relative_humidity_2m);
                items[countryIndex].wind = Math.round(cur.wind_speed_10m);
                items[countryIndex].condition = mapped.condition;
                items[countryIndex].icon = mapped.icon;
              }
            });
          }
        } catch (batchErr) {
          console.warn(`Batch ${b + 1} live fetch failed, using fallback/cached data:`, batchErr);
        }

        if (typeof onProgress === 'function') {
          onProgress(Math.round(((b + 1) / batches.length) * 100));
        }
      }

      lastSyncTime = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          items,
          timestamp: lastSyncTime
        }));
      } catch (e) {}

    } finally {
      isFetching = false;
    }

    return items;
  }

  /**
   * Filter and sort countries
   */
  function filterAndSort(searchQuery = '', regionFilter = 'All', sortOption = 'name-asc') {
    let result = items.slice();

    // 1. Region Filter
    if (regionFilter && regionFilter !== 'All') {
      result = result.filter(c => c.region.toLowerCase() === regionFilter.toLowerCase());
    }

    // 2. Search Query (Country name, Capital city, Code)
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.country.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    switch (sortOption) {
      case 'temp-desc': // Warmest first
        result.sort((a, b) => b.temp - a.temp);
        break;
      case 'temp-asc': // Coldest first
        result.sort((a, b) => a.temp - b.temp);
        break;
      case 'name-desc': // Z to A
        result.sort((a, b) => b.country.localeCompare(a.country));
        break;
      case 'name-asc': // A to Z (default)
      default:
        result.sort((a, b) => a.country.localeCompare(b.country));
        break;
    }

    return result;
  }

  /**
   * Calculate summary statistics for world weather
   */
  function getStats() {
    if (!items || items.length === 0) return null;

    let min = items[0];
    let max = items[0];
    let sum = 0;

    items.forEach(c => {
      if (c.temp < min.temp) min = c;
      if (c.temp > max.temp) max = c;
      sum += c.temp;
    });

    const avg = Math.round(sum / items.length);

    return {
      warmest: max,
      coldest: min,
      average: avg,
      totalCount: items.length,
      lastSync: lastSyncTime
    };
  }

  /**
   * Calculate live atmospheric condition distribution across all monitored nations
   */
  function getDistribution() {
    if (!items || items.length === 0) return [];

    const counts = {
      sunny: 0,
      cloudy: 0,
      rainy: 0,
      stormy: 0,
      snowy: 0
    };

    items.forEach(c => {
      const cond = (c.condition || '').toLowerCase();
      const icon = (c.icon || '').toLowerCase();

      if (cond.includes('storm') || cond.includes('thunder') || icon.includes('lightning')) {
        counts.stormy++;
      } else if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || icon.includes('rain')) {
        counts.rainy++;
      } else if (cond.includes('snow') || cond.includes('sleet') || cond.includes('hail') || icon.includes('snow')) {
        counts.snowy++;
      } else if (cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog') || icon.includes('cloud')) {
        counts.cloudy++;
      } else {
        counts.sunny++;
      }
    });

    const total = items.length;
    return [
      { key: 'sunny', label: 'Clear & Sunny', count: counts.sunny, pct: Math.round((counts.sunny / total) * 100), color: '#FBBF24' },
      { key: 'cloudy', label: 'Cloudy / Overcast', count: counts.cloudy, pct: Math.round((counts.cloudy / total) * 100), color: '#94A3B8' },
      { key: 'rainy', label: 'Rain & Showers', count: counts.rainy, pct: Math.round((counts.rainy / total) * 100), color: '#35D7FF' },
      { key: 'stormy', label: 'Storms', count: counts.stormy, pct: Math.round((counts.stormy / total) * 100), color: '#7967FF' },
      { key: 'snowy', label: 'Snow & Flurries', count: counts.snowy, pct: Math.round((counts.snowy / total) * 100), color: '#BAE6FD' }
    ];
  }

  return {
    getAll: () => items,
    fetchLiveBatch,
    filterAndSort,
    getStats,
    getDistribution,
    getLastSync: () => lastSyncTime
  };
})();
