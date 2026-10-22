/**
 * SkyPulse 3.0 - Global Country Weather Explorer
 * Complete Worldwide Directory of 225+ Sovereign Nations and Territories.
 * Features progressive batch fetching, resilient caching, and real calculated telemetry.
 */

const WorldWeather = (function () {
  const STORAGE_KEY = 'skypulse_world_cache_v3';
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache validity

  // Master Worldwide Country Directory
  const MASTER_COUNTRIES = [
  // --- EUROPE ---
  { id: 1, country: 'United Kingdom', city: 'London', code: 'GB', iso3: 'GBR', flag: '🇬🇧', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { id: 2, country: 'France', city: 'Paris', code: 'FR', iso3: 'FRA', flag: '🇫🇷', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { id: 3, country: 'Germany', city: 'Berlin', code: 'DE', iso3: 'DEU', flag: '🇩🇪', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 52.5200, lon: 13.4050, timezone: 'Europe/Berlin' },
  { id: 4, country: 'Italy', city: 'Rome', code: 'IT', iso3: 'ITA', flag: '🇮🇹', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 41.9028, lon: 12.4964, timezone: 'Europe/Rome' },
  { id: 5, country: 'Spain', city: 'Madrid', code: 'ES', iso3: 'ESP', flag: '🇪🇸', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
  { id: 6, country: 'Netherlands', city: 'Amsterdam', code: 'NL', iso3: 'NLD', flag: '🇳🇱', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam' },
  { id: 7, country: 'Switzerland', city: 'Bern', code: 'CH', iso3: 'CHE', flag: '🇨🇭', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 46.9480, lon: 7.4474, timezone: 'Europe/Zurich' },
  { id: 8, country: 'Sweden', city: 'Stockholm', code: 'SE', iso3: 'SWE', flag: '🇸🇪', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 59.3293, lon: 18.0686, timezone: 'Europe/Stockholm' },
  { id: 9, country: 'Norway', city: 'Oslo', code: 'NO', iso3: 'NOR', flag: '🇳🇴', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 59.9139, lon: 10.7522, timezone: 'Europe/Oslo' },
  { id: 10, country: 'Poland', city: 'Warsaw', code: 'PL', iso3: 'POL', flag: '🇵🇱', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
  { id: 11, country: 'Portugal', city: 'Lisbon', code: 'PT', iso3: 'PRT', flag: '🇵🇹', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 38.7223, lon: -9.1393, timezone: 'Europe/Lisbon' },
  { id: 12, country: 'Greece', city: 'Athens', code: 'GR', iso3: 'GRC', flag: '🇬🇷', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 37.9838, lon: 23.7275, timezone: 'Europe/Athens' },
  { id: 13, country: 'Ireland', city: 'Dublin', code: 'IE', iso3: 'IRL', flag: '🇮🇪', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 53.3498, lon: -6.2603, timezone: 'Europe/Dublin' },
  { id: 14, country: 'Austria', city: 'Vienna', code: 'AT', iso3: 'AUT', flag: '🇦🇹', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 48.2082, lon: 16.3738, timezone: 'Europe/Vienna' },
  { id: 15, country: 'Belgium', city: 'Brussels', code: 'BE', iso3: 'BEL', flag: '🇧🇪', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 50.8503, lon: 4.3517, timezone: 'Europe/Brussels' },
  { id: 16, country: 'Denmark', city: 'Copenhagen', code: 'DK', iso3: 'DNK', flag: '🇩🇰', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 55.6761, lon: 12.5683, timezone: 'Europe/Copenhagen' },
  { id: 17, country: 'Finland', city: 'Helsinki', code: 'FI', iso3: 'FIN', flag: '🇫🇮', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 60.1699, lon: 24.9384, timezone: 'Europe/Helsinki' },
  { id: 18, country: 'Czech Republic', city: 'Prague', code: 'CZ', iso3: 'CZE', flag: '🇨🇿', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' },
  { id: 19, country: 'Hungary', city: 'Budapest', code: 'HU', iso3: 'HUN', flag: '🇭🇺', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 47.4979, lon: 19.0402, timezone: 'Europe/Budapest' },
  { id: 20, country: 'Romania', city: 'Bucharest', code: 'RO', iso3: 'ROU', flag: '🇷🇴', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 44.4268, lon: 26.1025, timezone: 'Europe/Bucharest' },
  { id: 21, country: 'Ukraine', city: 'Kyiv', code: 'UA', iso3: 'UKR', flag: '🇺🇦', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
  { id: 22, country: 'Turkey', city: 'Ankara', code: 'TR', iso3: 'TUR', flag: '🇹🇷', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 39.9334, lon: 32.8597, timezone: 'Europe/Istanbul' },
  { id: 23, country: 'Iceland', city: 'Reykjavik', code: 'IS', iso3: 'ISL', flag: '🇮🇸', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 64.1466, lon: -21.9426, timezone: 'Atlantic/Reykjavik' },
  { id: 24, country: 'Croatia', city: 'Zagreb', code: 'HR', iso3: 'HRV', flag: '🇭🇷', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 45.8150, lon: 15.9819, timezone: 'Europe/Zagreb' },
  { id: 25, country: 'Serbia', city: 'Belgrade', code: 'RS', iso3: 'SRB', flag: '🇷🇸', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 44.7866, lon: 20.4489, timezone: 'Europe/Belgrade' },
  { id: 26, country: 'Bulgaria', city: 'Sofia', code: 'BG', iso3: 'BGR', flag: '🇧🇬', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 42.6977, lon: 23.3219, timezone: 'Europe/Sofia' },
  { id: 27, country: 'Slovakia', city: 'Bratislava', code: 'SK', iso3: 'SVK', flag: '🇸🇰', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 48.1486, lon: 17.1077, timezone: 'Europe/Bratislava' },
  { id: 28, country: 'Slovenia', city: 'Ljubljana', code: 'SI', iso3: 'SVN', flag: '🇸🇮', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 46.0569, lon: 14.5058, timezone: 'Europe/Ljubljana' },
  { id: 29, country: 'Lithuania', city: 'Vilnius', code: 'LT', iso3: 'LTU', flag: '🇱🇹', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 54.6872, lon: 25.2797, timezone: 'Europe/Vilnius' },
  { id: 30, country: 'Latvia', city: 'Riga', code: 'LV', iso3: 'LVA', flag: '🇱🇻', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 56.9496, lon: 24.1052, timezone: 'Europe/Riga' },
  { id: 31, country: 'Estonia', city: 'Tallinn', code: 'EE', iso3: 'EST', flag: '🇪🇪', region: 'Europe', subregion: 'Northern Europe', type: 'sovereign', lat: 59.4370, lon: 24.7536, timezone: 'Europe/Tallinn' },
  { id: 32, country: 'Luxembourg', city: 'Luxembourg', code: 'LU', iso3: 'LUX', flag: '🇱🇺', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 49.6116, lon: 6.1319, timezone: 'Europe/Luxembourg' },
  { id: 33, country: 'Cyprus', city: 'Nicosia', code: 'CY', iso3: 'CYP', flag: '🇨🇾', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 35.1856, lon: 33.3823, timezone: 'Asia/Nicosia' },
  { id: 34, country: 'Malta', city: 'Valletta', code: 'MT', iso3: 'MLT', flag: '🇲🇹', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 35.8989, lon: 14.5146, timezone: 'Europe/Malta' },
  { id: 35, country: 'Albania', city: 'Tirana', code: 'AL', iso3: 'ALB', flag: '🇦🇱', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 41.3275, lon: 19.8187, timezone: 'Europe/Tirane' },
  { id: 36, country: 'North Macedonia', city: 'Skopje', code: 'MK', iso3: 'MKD', flag: '🇲🇰', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 41.9981, lon: 21.4254, timezone: 'Europe/Skopje' },
  { id: 37, country: 'Bosnia and Herzegovina', city: 'Sarajevo', code: 'BA', iso3: 'BIH', flag: '🇧🇦', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 43.8563, lon: 18.4131, timezone: 'Europe/Sarajevo' },
  { id: 38, country: 'Montenegro', city: 'Podgorica', code: 'ME', iso3: 'MNE', flag: '🇲🇪', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 42.4304, lon: 19.2594, timezone: 'Europe/Podgorica' },
  { id: 39, country: 'Moldova', city: 'Chisinau', code: 'MD', iso3: 'MDA', flag: '🇲🇩', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 47.0105, lon: 28.8638, timezone: 'Europe/Chisinau' },
  { id: 40, country: 'Belarus', city: 'Minsk', code: 'BY', iso3: 'BLR', flag: '🇧🇾', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 53.9045, lon: 27.5615, timezone: 'Europe/Minsk' },
  { id: 41, country: 'Kosovo', city: 'Pristina', code: 'XK', iso3: 'XKX', flag: '🇽🇰', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 42.6629, lon: 21.1655, timezone: 'Europe/Belgrade' },
  { id: 42, country: 'Andorra', city: 'Andorra la Vella', code: 'AD', iso3: 'AND', flag: '🇦🇩', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 42.5063, lon: 1.5218, timezone: 'Europe/Andorra' },
  { id: 43, country: 'Monaco', city: 'Monaco', code: 'MC', iso3: 'MCO', flag: '🇲🇨', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 43.7384, lon: 7.4246, timezone: 'Europe/Monaco' },
  { id: 44, country: 'Liechtenstein', city: 'Vaduz', code: 'LI', iso3: 'LIE', flag: '🇱🇮', region: 'Europe', subregion: 'Western Europe', type: 'sovereign', lat: 47.1410, lon: 9.5209, timezone: 'Europe/Vaduz' },
  { id: 45, country: 'San Marino', city: 'San Marino', code: 'SM', iso3: 'SMR', flag: '🇸🇲', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 43.9424, lon: 12.4578, timezone: 'Europe/Rome' },
  { id: 46, country: 'Vatican City', city: 'Vatican City', code: 'VA', iso3: 'VAT', flag: '🇻🇦', region: 'Europe', subregion: 'Southern Europe', type: 'sovereign', lat: 41.9029, lon: 12.4534, timezone: 'Europe/Rome' },
  { id: 47, country: 'Gibraltar', city: 'Gibraltar', code: 'GI', iso3: 'GIB', flag: '🇬🇮', region: 'Europe', subregion: 'Southern Europe', type: 'territory', lat: 36.1408, lon: -5.3536, timezone: 'Europe/Gibraltar' },
  { id: 48, country: 'Faroe Islands', city: 'Torshavn', code: 'FO', iso3: 'FRO', flag: '🇫🇴', region: 'Europe', subregion: 'Northern Europe', type: 'territory', lat: 62.0097, lon: -6.7716, timezone: 'Atlantic/Faroe' },
  { id: 49, country: 'Isle of Man', city: 'Douglas', code: 'IM', iso3: 'IMN', flag: '🇮🇲', region: 'Europe', subregion: 'Northern Europe', type: 'territory', lat: 54.1532, lon: -4.4856, timezone: 'Europe/Isle_of_Man' },
  { id: 50, country: 'Guernsey', city: 'Saint Peter Port', code: 'GG', iso3: 'GGY', flag: '🇬🇬', region: 'Europe', subregion: 'Northern Europe', type: 'territory', lat: 49.4598, lon: -2.5353, timezone: 'Europe/Guernsey' },

  // --- ASIA ---
  { id: 51, country: 'Japan', city: 'Tokyo', code: 'JP', iso3: 'JPN', flag: '🇯🇵', region: 'Asia', subregion: 'Eastern Asia', type: 'sovereign', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 52, country: 'China', city: 'Beijing', code: 'CN', iso3: 'CHN', flag: '🇨🇳', region: 'Asia', subregion: 'Eastern Asia', type: 'sovereign', lat: 39.9042, lon: 116.4074, timezone: 'Asia/Shanghai' },
  { id: 53, country: 'India', city: 'New Delhi', code: 'IN', iso3: 'IND', flag: '🇮🇳', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 28.6139, lon: 77.2090, timezone: 'Asia/Kolkata' },
  { id: 54, country: 'South Korea', city: 'Seoul', code: 'KR', iso3: 'KOR', flag: '🇰🇷', region: 'Asia', subregion: 'Eastern Asia', type: 'sovereign', lat: 37.5665, lon: 126.9780, timezone: 'Asia/Seoul' },
  { id: 55, country: 'Singapore', city: 'Singapore', code: 'SG', iso3: 'SGP', flag: '🇸🇬', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 1.3521, lon: 103.8198, timezone: 'Asia/Singapore' },
  { id: 56, country: 'Indonesia', city: 'Jakarta', code: 'ID', iso3: 'IDN', flag: '🇮🇩', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: -6.2088, lon: 106.8456, timezone: 'Asia/Jakarta' },
  { id: 57, country: 'Thailand', city: 'Bangkok', code: 'TH', iso3: 'THA', flag: '🇹🇭', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 13.7563, lon: 100.5018, timezone: 'Asia/Bangkok' },
  { id: 58, country: 'Malaysia', city: 'Kuala Lumpur', code: 'MY', iso3: 'MYS', flag: '🇲🇾', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 3.1390, lon: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { id: 59, country: 'Vietnam', city: 'Hanoi', code: 'VN', iso3: 'VNM', flag: '🇻🇳', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 21.0285, lon: 105.8542, timezone: 'Asia/Ho_Chi_Minh' },
  { id: 60, country: 'Philippines', city: 'Manila', code: 'PH', iso3: 'PHL', flag: '🇵🇭', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 14.5995, lon: 120.9842, timezone: 'Asia/Manila' },
  { id: 61, country: 'Saudi Arabia', city: 'Riyadh', code: 'SA', iso3: 'SAU', flag: '🇸🇦', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 24.7136, lon: 46.6753, timezone: 'Asia/Riyadh' },
  { id: 62, country: 'United Arab Emirates', city: 'Abu Dhabi', code: 'AE', iso3: 'ARE', flag: '🇦🇪', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 24.4539, lon: 54.3773, timezone: 'Asia/Dubai' },
  { id: 63, country: 'Qatar', city: 'Doha', code: 'QA', iso3: 'QAT', flag: '🇶🇦', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 25.2854, lon: 51.5310, timezone: 'Asia/Qatar' },
  { id: 64, country: 'Israel', city: 'Jerusalem', code: 'IL', iso3: 'ISR', flag: '🇮🇱', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 31.7683, lon: 35.2137, timezone: 'Asia/Jerusalem' },
  { id: 65, country: 'Pakistan', city: 'Islamabad', code: 'PK', iso3: 'PAK', flag: '🇵🇰', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 33.6844, lon: 73.0479, timezone: 'Asia/Karachi' },
  { id: 66, country: 'Bangladesh', city: 'Dhaka', code: 'BD', iso3: 'BGD', flag: '🇧🇩', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 23.8103, lon: 90.4125, timezone: 'Asia/Dhaka' },
  { id: 67, country: 'Sri Lanka', city: 'Colombo', code: 'LK', iso3: 'LKA', flag: '🇱🇰', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 6.9271, lon: 79.8612, timezone: 'Asia/Colombo' },
  { id: 68, country: 'Nepal', city: 'Kathmandu', code: 'NP', iso3: 'NPL', flag: '🇳🇵', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 27.7172, lon: 85.3240, timezone: 'Asia/Kathmandu' },
  { id: 69, country: 'Kazakhstan', city: 'Astana', code: 'KZ', iso3: 'KAZ', flag: '🇰🇿', region: 'Asia', subregion: 'Central Asia', type: 'sovereign', lat: 51.1694, lon: 71.4491, timezone: 'Asia/Almaty' },
  { id: 70, country: 'Uzbekistan', city: 'Tashkent', code: 'UZ', iso3: 'UZB', flag: '🇺🇿', region: 'Asia', subregion: 'Central Asia', type: 'sovereign', lat: 41.2995, lon: 69.2401, timezone: 'Asia/Tashkent' },
  { id: 71, country: 'Kuwait', city: 'Kuwait City', code: 'KW', iso3: 'KWT', flag: '🇰🇼', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 29.3759, lon: 47.9774, timezone: 'Asia/Kuwait' },
  { id: 72, country: 'Oman', city: 'Muscat', code: 'OM', iso3: 'OMN', flag: '🇴🇲', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 23.5880, lon: 58.3829, timezone: 'Asia/Muscat' },
  { id: 73, country: 'Jordan', city: 'Amman', code: 'JO', iso3: 'JOR', flag: '🇯🇴', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 31.9454, lon: 35.9284, timezone: 'Asia/Amman' },
  { id: 74, country: 'Lebanon', city: 'Beirut', code: 'LB', iso3: 'LBN', flag: '🇱🇧', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 33.8938, lon: 35.5018, timezone: 'Asia/Beirut' },
  { id: 75, country: 'Mongolia', city: 'Ulaanbaatar', code: 'MN', iso3: 'MNG', flag: '🇲🇳', region: 'Asia', subregion: 'Eastern Asia', type: 'sovereign', lat: 47.8864, lon: 106.9057, timezone: 'Asia/Ulaanbaatar' },
  { id: 76, country: 'Taiwan', city: 'Taipei', code: 'TW', iso3: 'TWN', flag: '🇹🇼', region: 'Asia', subregion: 'Eastern Asia', type: 'territory', lat: 25.0330, lon: 121.5654, timezone: 'Asia/Taipei' },
  { id: 77, country: 'Hong Kong', city: 'Hong Kong', code: 'HK', iso3: 'HKG', flag: '🇭🇰', region: 'Asia', subregion: 'Eastern Asia', type: 'territory', lat: 22.3193, lon: 114.1694, timezone: 'Asia/Hong_Kong' },
  { id: 78, country: 'Macao', city: 'Macao', code: 'MO', iso3: 'MAC', flag: '🇲🇴', region: 'Asia', subregion: 'Eastern Asia', type: 'territory', lat: 22.1987, lon: 113.5439, timezone: 'Asia/Macau' },
  { id: 79, country: 'Iran', city: 'Tehran', code: 'IR', iso3: 'IRN', flag: '🇮🇷', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 35.6892, lon: 51.3890, timezone: 'Asia/Tehran' },
  { id: 80, country: 'Iraq', city: 'Baghdad', code: 'IQ', iso3: 'IRQ', flag: '🇮🇶', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 33.3152, lon: 44.3661, timezone: 'Asia/Baghdad' },
  { id: 81, country: 'Armenia', city: 'Yerevan', code: 'AM', iso3: 'ARM', flag: '🇦🇲', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 40.1792, lon: 44.4991, timezone: 'Asia/Yerevan' },
  { id: 82, country: 'Azerbaijan', city: 'Baku', code: 'AZ', iso3: 'AZE', flag: '🇦🇿', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 40.4093, lon: 49.8671, timezone: 'Asia/Baku' },
  { id: 83, country: 'Georgia', city: 'Tbilisi', code: 'GE', iso3: 'GEO', flag: '🇬🇪', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
  { id: 84, country: 'Bahrain', city: 'Manama', code: 'BH', iso3: 'BHR', flag: '🇧🇭', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 26.2285, lon: 50.5860, timezone: 'Asia/Bahrain' },
  { id: 85, country: 'Cambodia', city: 'Phnom Penh', code: 'KH', iso3: 'KHM', flag: '🇰🇭', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 11.5564, lon: 104.9282, timezone: 'Asia/Phnom_Penh' },
  { id: 86, country: 'Laos', city: 'Vientiane', code: 'LA', iso3: 'LAO', flag: '🇱🇦', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 17.9757, lon: 102.6331, timezone: 'Asia/Vientiane' },
  { id: 87, country: 'Myanmar', city: 'Naypyidaw', code: 'MM', iso3: 'MMR', flag: '🇲🇲', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 19.7633, lon: 96.0785, timezone: 'Asia/Yangon' },
  { id: 88, country: 'Brunei', city: 'Bandar Seri Begawan', code: 'BN', iso3: 'BRN', flag: '🇧🇳', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: 4.9031, lon: 114.9398, timezone: 'Asia/Brunei' },
  { id: 89, country: 'Maldives', city: 'Male', code: 'MV', iso3: 'MDV', flag: '🇲🇻', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 4.1755, lon: 73.5093, timezone: 'Indian/Maldives' },
  { id: 90, country: 'Bhutan', city: 'Thimphu', code: 'BT', iso3: 'BTN', flag: '🇧🇹', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 27.4728, lon: 89.6393, timezone: 'Asia/Thimphu' },
  { id: 91, country: 'Afghanistan', city: 'Kabul', code: 'AF', iso3: 'AFG', flag: '🇦🇫', region: 'Asia', subregion: 'Southern Asia', type: 'sovereign', lat: 34.5553, lon: 69.2075, timezone: 'Asia/Kabul' },
  { id: 92, country: 'Turkmenistan', city: 'Ashgabat', code: 'TM', iso3: 'TKM', flag: '🇹🇲', region: 'Asia', subregion: 'Central Asia', type: 'sovereign', lat: 37.9601, lon: 58.3261, timezone: 'Asia/Ashgabat' },
  { id: 93, country: 'Tajikistan', city: 'Dushanbe', code: 'TJ', iso3: 'TJK', flag: '🇹🇯', region: 'Asia', subregion: 'Central Asia', type: 'sovereign', lat: 38.5598, lon: 68.7870, timezone: 'Asia/Dushanbe' },
  { id: 94, country: 'Kyrgyzstan', city: 'Bishkek', code: 'KG', iso3: 'KGZ', flag: '🇰🇬', region: 'Asia', subregion: 'Central Asia', type: 'sovereign', lat: 42.8746, lon: 74.5698, timezone: 'Asia/Bishkek' },
  { id: 95, country: 'Yemen', city: 'Sanaa', code: 'YE', iso3: 'YEM', flag: '🇾🇪', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 15.3694, lon: 44.1910, timezone: 'Asia/Aden' },
  { id: 96, country: 'Syria', city: 'Damascus', code: 'SY', iso3: 'SYR', flag: '🇸🇾', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 33.5138, lon: 36.2765, timezone: 'Asia/Damascus' },
  { id: 97, country: 'North Korea', city: 'Pyongyang', code: 'KP', iso3: 'PRK', flag: '🇰🇵', region: 'Asia', subregion: 'Eastern Asia', type: 'sovereign', lat: 39.0392, lon: 125.7625, timezone: 'Asia/Pyongyang' },
  { id: 98, country: 'Palestine', city: 'Ramallah', code: 'PS', iso3: 'PSE', flag: '🇵🇸', region: 'Asia', subregion: 'Western Asia', type: 'sovereign', lat: 31.9038, lon: 35.2034, timezone: 'Asia/Gaza' },
  { id: 99, country: 'Timor-Leste', city: 'Dili', code: 'TL', iso3: 'TLS', flag: '🇹🇱', region: 'Asia', subregion: 'South-Eastern Asia', type: 'sovereign', lat: -8.5569, lon: 125.5603, timezone: 'Asia/Dili' },
  { id: 100, country: 'Russia', city: 'Moscow', code: 'RU', iso3: 'RUS', flag: '🇷🇺', region: 'Europe', subregion: 'Eastern Europe', type: 'sovereign', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },

  // --- AMERICAS ---
  { id: 101, country: 'United States', city: 'Washington D.C.', code: 'US', iso3: 'USA', flag: '🇺🇸', region: 'Americas', subregion: 'Northern America', type: 'sovereign', lat: 38.9072, lon: -77.0369, timezone: 'America/New_York' },
  { id: 102, country: 'Canada', city: 'Ottawa', code: 'CA', iso3: 'CAN', flag: '🇨🇦', region: 'Americas', subregion: 'Northern America', type: 'sovereign', lat: 45.4215, lon: -75.6972, timezone: 'America/Toronto' },
  { id: 103, country: 'Mexico', city: 'Mexico City', code: 'MX', iso3: 'MEX', flag: '🇲🇽', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 19.4326, lon: -99.1332, timezone: 'America/Mexico_City' },
  { id: 104, country: 'Brazil', city: 'Brasília', code: 'BR', iso3: 'BRA', flag: '🇧🇷', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -15.8267, lon: -47.9218, timezone: 'America/Sao_Paulo' },
  { id: 105, country: 'Argentina', city: 'Buenos Aires', code: 'AR', iso3: 'ARG', flag: '🇦🇷', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -34.6037, lon: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { id: 106, country: 'Colombia', city: 'Bogotá', code: 'CO', iso3: 'COL', flag: '🇨🇴', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: 4.7110, lon: -74.0721, timezone: 'America/Bogota' },
  { id: 107, country: 'Chile', city: 'Santiago', code: 'CL', iso3: 'CHL', flag: '🇨🇱', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -33.4489, lon: -70.6693, timezone: 'America/Santiago' },
  { id: 108, country: 'Peru', city: 'Lima', code: 'PE', iso3: 'PER', flag: '🇵🇪', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -12.0464, lon: -77.0428, timezone: 'America/Lima' },
  { id: 109, country: 'Cuba', city: 'Havana', code: 'CU', iso3: 'CUB', flag: '🇨🇺', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 23.1136, lon: -82.3666, timezone: 'America/Havana' },
  { id: 110, country: 'Jamaica', city: 'Kingston', code: 'JM', iso3: 'JAM', flag: '🇯🇲', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 17.9712, lon: -76.7936, timezone: 'America/Jamaica' },
  { id: 111, country: 'Costa Rica', city: 'San José', code: 'CR', iso3: 'CRI', flag: '🇨🇷', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 9.9281, lon: -84.0907, timezone: 'America/Costa_Rica' },
  { id: 112, country: 'Panama', city: 'Panama City', code: 'PA', iso3: 'PAN', flag: '🇵🇦', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 8.9824, lon: -79.5199, timezone: 'America/Panama' },
  { id: 113, country: 'Ecuador', city: 'Quito', code: 'EC', iso3: 'ECU', flag: '🇪🇨', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -0.1807, lon: -78.4678, timezone: 'America/Guayaquil' },
  { id: 114, country: 'Venezuela', city: 'Caracas', code: 'VE', iso3: 'VEN', flag: '🇻🇪', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: 10.4806, lon: -66.9036, timezone: 'America/Caracas' },
  { id: 115, country: 'Uruguay', city: 'Montevideo', code: 'UY', iso3: 'URY', flag: '🇺🇾', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -34.9011, lon: -56.1645, timezone: 'America/Montevideo' },
  { id: 116, country: 'Dominican Republic', city: 'Santo Domingo', code: 'DO', iso3: 'DOM', flag: '🇩🇴', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 18.4861, lon: -69.9312, timezone: 'America/Santo_Domingo' },
  { id: 117, country: 'Bolivia', city: 'La Paz', code: 'BO', iso3: 'BOL', flag: '🇧🇴', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -16.5000, lon: -68.1500, timezone: 'America/La_Paz' },
  { id: 118, country: 'Guatemala', city: 'Guatemala City', code: 'GT', iso3: 'GTM', flag: '🇬🇹', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 14.6349, lon: -90.5069, timezone: 'America/Guatemala' },
  { id: 119, country: 'Paraguay', city: 'Asunción', code: 'PY', iso3: 'PRY', flag: '🇵🇾', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: -25.2637, lon: -57.5759, timezone: 'America/Asuncion' },
  { id: 120, country: 'El Salvador', city: 'San Salvador', code: 'SV', iso3: 'SLV', flag: '🇸🇻', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 13.6929, lon: -89.2182, timezone: 'America/El_Salvador' },
  { id: 121, country: 'Honduras', city: 'Tegucigalpa', code: 'HN', iso3: 'HND', flag: '🇭🇳', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 14.0723, lon: -87.1921, timezone: 'America/Tegucigalpa' },
  { id: 122, country: 'Trinidad and Tobago', city: 'Port of Spain', code: 'TT', iso3: 'TTO', flag: '🇹🇹', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 10.6549, lon: -61.5019, timezone: 'America/Port_of_Spain' },
  { id: 123, country: 'Nicaragua', city: 'Managua', code: 'NI', iso3: 'NIC', flag: '🇳🇮', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 12.1150, lon: -86.2362, timezone: 'America/Managua' },
  { id: 124, country: 'Puerto Rico', city: 'San Juan', code: 'PR', iso3: 'PRI', flag: '🇵🇷', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 18.4655, lon: -66.1057, timezone: 'America/Puerto_Rico' },
  { id: 125, country: 'Bahamas', city: 'Nassau', code: 'BS', iso3: 'BHS', flag: '🇧🇸', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 25.0443, lon: -77.3504, timezone: 'America/Nassau' },
  { id: 126, country: 'Barbados', city: 'Bridgetown', code: 'BB', iso3: 'BRB', flag: '🇧🇧', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 13.1939, lon: -59.5432, timezone: 'America/Barbados' },
  { id: 127, country: 'Haiti', city: 'Port-au-Prince', code: 'HT', iso3: 'HTI', flag: '🇭🇹', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 18.5944, lon: -72.3074, timezone: 'America/Port-au-Prince' },
  { id: 128, country: 'Guyana', city: 'Georgetown', code: 'GY', iso3: 'GUY', flag: '🇬🇾', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: 6.8013, lon: -58.1551, timezone: 'America/Guyana' },
  { id: 129, country: 'Suriname', city: 'Paramaribo', code: 'SR', iso3: 'SUR', flag: '🇸🇷', region: 'Americas', subregion: 'South America', type: 'sovereign', lat: 5.8520, lon: -55.2038, timezone: 'America/Paramaribo' },
  { id: 130, country: 'Belize', city: 'Belmopan', code: 'BZ', iso3: 'BLZ', flag: '🇧🇿', region: 'Americas', subregion: 'Central America', type: 'sovereign', lat: 17.2510, lon: -88.7590, timezone: 'America/Belize' },
  { id: 131, country: 'Greenland', city: 'Nuuk', code: 'GL', iso3: 'GRL', flag: '🇬🇱', region: 'Americas', subregion: 'Northern America', type: 'territory', lat: 64.1814, lon: -51.6941, timezone: 'America/Nuuk' },
  { id: 132, country: 'Bermuda', city: 'Hamilton', code: 'BM', iso3: 'BMU', flag: '🇧🇲', region: 'Americas', subregion: 'Northern America', type: 'territory', lat: 32.2949, lon: -64.7830, timezone: 'Atlantic/Bermuda' },
  { id: 133, country: 'Cayman Islands', city: 'George Town', code: 'KY', iso3: 'CYM', flag: '🇰🇾', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 19.2869, lon: -81.3674, timezone: 'America/Cayman' },
  { id: 134, country: 'Aruba', city: 'Oranjestad', code: 'AW', iso3: 'ABW', flag: '🇦🇼', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 12.5092, lon: -70.0086, timezone: 'America/Aruba' },
  { id: 135, country: 'Curaçao', city: 'Willemstad', code: 'CW', iso3: 'CUW', flag: '🇨🇼', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 12.1696, lon: -68.9900, timezone: 'America/Curacao' },
  { id: 136, country: 'Saint Lucia', city: 'Castries', code: 'LC', iso3: 'LCA', flag: '🇱🇨', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 14.0101, lon: -60.9875, timezone: 'America/St_Lucia' },
  { id: 137, country: 'Grenada', city: 'St. George\'s', code: 'GD', iso3: 'GRD', flag: '🇬🇩', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 12.0561, lon: -61.7488, timezone: 'America/Grenada' },
  { id: 138, country: 'Antigua and Barbuda', city: 'St. John\'s', code: 'AG', iso3: 'ATG', flag: '🇦🇬', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 17.1274, lon: -61.8468, timezone: 'America/Antigua' },
  { id: 139, country: 'Dominica', city: 'Roseau', code: 'DM', iso3: 'DMA', flag: '🇩🇲', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 15.3092, lon: -61.3794, timezone: 'America/Dominica' },
  { id: 140, country: 'Saint Vincent and the Grenadines', city: 'Kingstown', code: 'VC', iso3: 'VCT', flag: '🇻🇨', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 13.1600, lon: -61.2248, timezone: 'America/St_Vincent' },
  { id: 141, country: 'Saint Kitts and Nevis', city: 'Basseterre', code: 'KN', iso3: 'KNA', flag: '🇰🇳', region: 'Americas', subregion: 'Caribbean', type: 'sovereign', lat: 17.3026, lon: -62.7177, timezone: 'America/St_Kitts' },
  { id: 142, country: 'French Guiana', city: 'Cayenne', code: 'GF', iso3: 'GUF', flag: '🇬🇫', region: 'Americas', subregion: 'South America', type: 'territory', lat: 4.9224, lon: -52.3135, timezone: 'America/Cayenne' },
  { id: 143, country: 'Guadeloupe', city: 'Basse-Terre', code: 'GP', iso3: 'GLP', flag: '🇬🇵', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 15.9985, lon: -61.7288, timezone: 'America/Guadeloupe' },
  { id: 144, country: 'Martinique', city: 'Fort-de-France', code: 'MQ', iso3: 'MTQ', flag: '🇲🇶', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 14.6161, lon: -61.0588, timezone: 'America/Martinique' },
  { id: 145, country: 'Virgin Islands (U.S.)', city: 'Charlotte Amalie', code: 'VI', iso3: 'VIR', flag: '🇻🇮', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 18.3419, lon: -64.9307, timezone: 'America/St_Thomas' },
  { id: 146, country: 'Virgin Islands (British)', city: 'Road Town', code: 'VG', iso3: 'VGB', flag: '🇻🇬', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 18.4286, lon: -64.6185, timezone: 'America/Tortola' },
  { id: 147, country: 'Turks and Caicos Islands', city: 'Cockburn Town', code: 'TC', iso3: 'TCA', flag: '🇹🇨', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 21.4674, lon: -71.1389, timezone: 'America/Grand_Turk' },
  { id: 148, country: 'Saint Martin', city: 'Marigot', code: 'MF', iso3: 'MAF', flag: '🇲🇫', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 18.0673, lon: -63.0825, timezone: 'America/Marigot' },
  { id: 149, country: 'Sint Maarten', city: 'Philipsburg', code: 'SX', iso3: 'SXM', flag: '🇸🇽', region: 'Americas', subregion: 'Caribbean', type: 'territory', lat: 18.0260, lon: -63.0458, timezone: 'America/Lower_Princes' },
  { id: 150, country: 'Falkland Islands', city: 'Stanley', code: 'FK', iso3: 'FLK', flag: '🇫🇰', region: 'Americas', subregion: 'South America', type: 'territory', lat: -51.6977, lon: -57.8517, timezone: 'Atlantic/Stanley' },

  // --- AFRICA ---
  { id: 151, country: 'Egypt', city: 'Cairo', code: 'EG', iso3: 'EGY', flag: '🇪🇬', region: 'Africa', subregion: 'Northern Africa', type: 'sovereign', lat: 30.0444, lon: 31.2357, timezone: 'Africa/Cairo' },
  { id: 152, country: 'South Africa', city: 'Pretoria', code: 'ZA', iso3: 'ZAF', flag: '🇿🇦', region: 'Africa', subregion: 'Southern Africa', type: 'sovereign', lat: -25.7479, lon: 28.2293, timezone: 'Africa/Johannesburg' },
  { id: 153, country: 'Nigeria', city: 'Abuja', code: 'NG', iso3: 'NGA', flag: '🇳🇬', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 9.0765, lon: 7.3986, timezone: 'Africa/Lagos' },
  { id: 154, country: 'Kenya', city: 'Nairobi', code: 'KE', iso3: 'KEN', flag: '🇰🇪', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -1.2921, lon: 36.8219, timezone: 'Africa/Nairobi' },
  { id: 155, country: 'Morocco', city: 'Rabat', code: 'MA', iso3: 'MAR', flag: '🇲🇦', region: 'Africa', subregion: 'Northern Africa', type: 'sovereign', lat: 34.0209, lon: -6.8416, timezone: 'Africa/Casablanca' },
  { id: 156, country: 'Ghana', city: 'Accra', code: 'GH', iso3: 'GHA', flag: '🇬🇭', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 5.6037, lon: -0.1870, timezone: 'Africa/Accra' },
  { id: 157, country: 'Ethiopia', city: 'Addis Ababa', code: 'ET', iso3: 'ETH', flag: '🇪🇹', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: 9.0300, lon: 38.7400, timezone: 'Africa/Addis_Ababa' },
  { id: 158, country: 'Tanzania', city: 'Dodoma', code: 'TZ', iso3: 'TZA', flag: '🇹🇿', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -6.1630, lon: 35.7516, timezone: 'Africa/Dar_es_Salaam' },
  { id: 159, country: 'Algeria', city: 'Algiers', code: 'DZ', iso3: 'DZA', flag: '🇩🇿', region: 'Africa', subregion: 'Northern Africa', type: 'sovereign', lat: 36.7538, lon: 3.0588, timezone: 'Africa/Algiers' },
  { id: 160, country: 'Tunisia', city: 'Tunis', code: 'TN', iso3: 'TUN', flag: '🇹🇳', region: 'Africa', subregion: 'Northern Africa', type: 'sovereign', lat: 36.8065, lon: 10.1815, timezone: 'Africa/Tunis' },
  { id: 161, country: 'Uganda', city: 'Kampala', code: 'UG', iso3: 'UGA', flag: '🇺🇬', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: 0.3476, lon: 32.5825, timezone: 'Africa/Kampala' },
  { id: 162, country: 'Senegal', city: 'Dakar', code: 'SN', iso3: 'SEN', flag: '🇸🇳', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 14.7167, lon: -17.4677, timezone: 'Africa/Dakar' },
  { id: 163, country: 'Rwanda', city: 'Kigali', code: 'RW', iso3: 'RWA', flag: '🇷🇼', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -1.9706, lon: 30.1044, timezone: 'Africa/Kigali' },
  { id: 164, country: 'Zimbabwe', city: 'Harare', code: 'ZW', iso3: 'ZWE', flag: '🇿🇼', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -17.8216, lon: 31.0492, timezone: 'Africa/Harare' },
  { id: 165, country: 'Ivory Coast', city: 'Yamoussoukro', code: 'CI', iso3: 'CIV', flag: '🇨🇮', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 6.8276, lon: -5.2893, timezone: 'Africa/Abidjan' },
  { id: 166, country: 'Cameroon', city: 'Yaoundé', code: 'CM', iso3: 'CMR', flag: '🇨🇲', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: 3.8480, lon: 11.5021, timezone: 'Africa/Douala' },
  { id: 167, country: 'Madagascar', city: 'Antananarivo', code: 'MG', iso3: 'MDG', flag: '🇲🇬', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -18.8792, lon: 47.5079, timezone: 'Indian/Antananarivo' },
  { id: 168, country: 'Mauritius', city: 'Port Louis', code: 'MU', iso3: 'MUS', flag: '🇲🇺', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -20.1609, lon: 57.5012, timezone: 'Indian/Mauritius' },
  { id: 169, country: 'Angola', city: 'Luanda', code: 'AO', iso3: 'AGO', flag: '🇦🇴', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: -8.8390, lon: 13.2894, timezone: 'Africa/Luanda' },
  { id: 170, country: 'Zambia', city: 'Lusaka', code: 'ZM', iso3: 'ZMB', flag: '🇿🇲', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -15.3875, lon: 28.3228, timezone: 'Africa/Lusaka' },
  { id: 171, country: 'Sudan', city: 'Khartoum', code: 'SD', iso3: 'SDN', flag: '🇸🇩', region: 'Africa', subregion: 'Northern Africa', type: 'sovereign', lat: 15.5007, lon: 32.5599, timezone: 'Africa/Khartoum' },
  { id: 172, country: 'DR Congo', city: 'Kinshasa', code: 'CD', iso3: 'COD', flag: '🇨🇩', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: -4.4419, lon: 15.2663, timezone: 'Africa/Kinshasa' },
  { id: 173, country: 'Congo', city: 'Brazzaville', code: 'CG', iso3: 'COG', flag: '🇨🇬', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: -4.2634, lon: 15.2429, timezone: 'Africa/Brazzaville' },
  { id: 174, country: 'Mozambique', city: 'Maputo', code: 'MZ', iso3: 'MOZ', flag: '🇲🇿', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -25.9692, lon: 32.5732, timezone: 'Africa/Maputo' },
  { id: 175, country: 'Namibia', city: 'Windhoek', code: 'NA', iso3: 'NAM', flag: '🇳🇦', region: 'Africa', subregion: 'Southern Africa', type: 'sovereign', lat: -22.5609, lon: 17.0658, timezone: 'Africa/Windhoek' },
  { id: 176, country: 'Botswana', city: 'Gaborone', code: 'BW', iso3: 'BWA', flag: '🇧🇼', region: 'Africa', subregion: 'Southern Africa', type: 'sovereign', lat: -24.6282, lon: 25.9231, timezone: 'Africa/Gaborone' },
  { id: 177, country: 'Mali', city: 'Bamako', code: 'ML', iso3: 'MLI', flag: '🇲🇱', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 12.6392, lon: -8.0029, timezone: 'Africa/Bamako' },
  { id: 178, country: 'Burkina Faso', city: 'Ouagadougou', code: 'BF', iso3: 'BFA', flag: '🇧🇫', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 12.3714, lon: -1.5197, timezone: 'Africa/Ouagadougou' },
  { id: 179, country: 'Niger', city: 'Niamey', code: 'NE', iso3: 'NER', flag: '🇳🇪', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 13.5116, lon: 2.1254, timezone: 'Africa/Niamey' },
  { id: 180, country: 'Chad', city: 'N\'Djamena', code: 'TD', iso3: 'TCD', flag: '🇹🇩', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: 12.1348, lon: 15.0557, timezone: 'Africa/Ndjamena' },
  { id: 181, country: 'Somalia', city: 'Mogadishu', code: 'SO', iso3: 'SOM', flag: '🇸🇴', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: 2.0469, lon: 45.3182, timezone: 'Africa/Mogadishu' },
  { id: 182, country: 'Guinea', city: 'Conakry', code: 'GN', iso3: 'GIN', flag: '🇬🇳', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 9.6412, lon: -13.5784, timezone: 'Africa/Conakry' },
  { id: 183, country: 'Benin', city: 'Porto-Novo', code: 'BJ', iso3: 'BEN', flag: '🇧🇯', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 6.4969, lon: 2.6289, timezone: 'Africa/Porto-Novo' },
  { id: 184, country: 'Togo', city: 'Lomé', code: 'TG', iso3: 'TGO', flag: '🇹🇬', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 6.1256, lon: 1.2254, timezone: 'Africa/Lome' },
  { id: 185, country: 'Sierra Leone', city: 'Freetown', code: 'SL', iso3: 'SLE', flag: '🇸🇱', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 8.4657, lon: -13.2317, timezone: 'Africa/Freetown' },
  { id: 186, country: 'Libya', city: 'Tripoli', code: 'LY', iso3: 'LBY', flag: '🇱🇾', region: 'Africa', subregion: 'Northern Africa', type: 'sovereign', lat: 32.8872, lon: 13.1913, timezone: 'Africa/Tripoli' },
  { id: 187, country: 'Liberia', city: 'Monrovia', code: 'LR', iso3: 'LBR', flag: '🇱🇷', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 6.3005, lon: -10.7969, timezone: 'Africa/Monrovia' },
  { id: 188, country: 'Central African Republic', city: 'Bangui', code: 'CF', iso3: 'CAF', flag: '🇨🇫', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: 4.3947, lon: 18.5582, timezone: 'Africa/Bangui' },
  { id: 189, country: 'Mauritania', city: 'Nouakchott', code: 'MR', iso3: 'MRT', flag: '🇲🇷', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 18.0735, lon: -15.9582, timezone: 'Africa/Nouakchott' },
  { id: 190, country: 'Eritrea', city: 'Asmara', code: 'ER', iso3: 'ERI', flag: '🇪🇷', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: 15.3229, lon: 38.9251, timezone: 'Africa/Asmara' },
  { id: 191, country: 'Gambia', city: 'Banjul', code: 'GM', iso3: 'GMB', flag: '🇬🇲', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 13.4549, lon: -16.5790, timezone: 'Africa/Banjul' },
  { id: 192, country: 'Gabon', city: 'Libreville', code: 'GA', iso3: 'GAB', flag: '🇬🇦', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: 0.4162, lon: 9.4673, timezone: 'Africa/Libreville' },
  { id: 193, country: 'Lesotho', city: 'Maseru', code: 'LS', iso3: 'LSO', flag: '🇱🇸', region: 'Africa', subregion: 'Southern Africa', type: 'sovereign', lat: -29.3151, lon: 27.4869, timezone: 'Africa/Maseru' },
  { id: 194, country: 'Guinea-Bissau', city: 'Bissau', code: 'GW', iso3: 'GNB', flag: '🇬🇼', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 11.8632, lon: -15.5984, timezone: 'Africa/Bissau' },
  { id: 195, country: 'Equatorial Guinea', city: 'Malabo', code: 'GQ', iso3: 'GNQ', flag: '🇬🇶', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: 3.7504, lon: 8.7371, timezone: 'Africa/Malabo' },
  { id: 196, country: 'Djibouti', city: 'Djibouti', code: 'DJ', iso3: 'DJI', flag: '🇩🇯', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: 11.8251, lon: 42.5903, timezone: 'Africa/Djibouti' },
  { id: 197, country: 'Eswatini', city: 'Mbabane', code: 'SZ', iso3: 'SWZ', flag: '🇸🇿', region: 'Africa', subregion: 'Southern Africa', type: 'sovereign', lat: -26.3054, lon: 31.1367, timezone: 'Africa/Mbabane' },
  { id: 198, country: 'Comoros', city: 'Moroni', code: 'KM', iso3: 'COM', flag: '🇰🇲', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -11.7172, lon: 43.2473, timezone: 'Indian/Comoro' },
  { id: 199, country: 'Cabo Verde', city: 'Praia', code: 'CV', iso3: 'CPV', flag: '🇨🇻', region: 'Africa', subregion: 'Western Africa', type: 'sovereign', lat: 14.9330, lon: -23.5133, timezone: 'Atlantic/Cape_Verde' },
  { id: 200, country: 'South Sudan', city: 'Juba', code: 'SS', iso3: 'SSD', flag: '🇸🇸', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: 4.8594, lon: 31.5713, timezone: 'Africa/Juba' },
  { id: 201, country: 'Sao Tome and Principe', city: 'São Tomé', code: 'ST', iso3: 'STP', flag: '🇸🇹', region: 'Africa', subregion: 'Middle Africa', type: 'sovereign', lat: 0.3302, lon: 6.7273, timezone: 'Africa/Sao_Tome' },
  { id: 202, country: 'Seychelles', city: 'Victoria', code: 'SC', iso3: 'SYC', flag: '🇸🇨', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -4.6191, lon: 55.4513, timezone: 'Indian/Mahe' },
  { id: 203, country: 'Burundi', city: 'Gitega', code: 'BI', iso3: 'BDI', flag: '🇧🇮', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -3.4264, lon: 29.9246, timezone: 'Africa/Bujumbura' },
  { id: 204, country: 'Malawi', city: 'Lilongwe', code: 'MW', iso3: 'MWI', flag: '🇲🇼', region: 'Africa', subregion: 'Eastern Africa', type: 'sovereign', lat: -13.9626, lon: 33.7741, timezone: 'Africa/Blantyre' },
  { id: 205, country: 'Réunion', city: 'Saint-Denis', code: 'RE', iso3: 'REU', flag: '🇷🇪', region: 'Africa', subregion: 'Eastern Africa', type: 'territory', lat: -20.8821, lon: 55.4507, timezone: 'Indian/Reunion' },
  { id: 206, country: 'Mayotte', city: 'Mamoudzou', code: 'YT', iso3: 'MYT', flag: '🇾🇹', region: 'Africa', subregion: 'Eastern Africa', type: 'territory', lat: -12.7806, lon: 45.2278, timezone: 'Indian/Mayotte' },

  // --- OCEANIA & ANTARCTICA ---
  { id: 207, country: 'Australia', city: 'Canberra', code: 'AU', iso3: 'AUS', flag: '🇦🇺', region: 'Oceania', subregion: 'Australia and New Zealand', type: 'sovereign', lat: -35.2809, lon: 149.1300, timezone: 'Australia/Sydney' },
  { id: 208, country: 'New Zealand', city: 'Wellington', code: 'NZ', iso3: 'NZL', flag: '🇳🇿', region: 'Oceania', subregion: 'Australia and New Zealand', type: 'sovereign', lat: -41.2865, lon: 174.7762, timezone: 'Pacific/Auckland' },
  { id: 209, country: 'Papua New Guinea', city: 'Port Moresby', code: 'PG', iso3: 'PNG', flag: '🇵🇬', region: 'Oceania', subregion: 'Melanesia', type: 'sovereign', lat: -9.4438, lon: 147.1803, timezone: 'Pacific/Port_Moresby' },
  { id: 210, country: 'Fiji', city: 'Suva', code: 'FJ', iso3: 'FJI', flag: '🇫🇯', region: 'Oceania', subregion: 'Melanesia', type: 'sovereign', lat: -18.1248, lon: 178.4501, timezone: 'Pacific/Fiji' },
  { id: 211, country: 'Solomon Islands', city: 'Honiara', code: 'SB', iso3: 'SLB', flag: '🇸🇧', region: 'Oceania', subregion: 'Melanesia', type: 'sovereign', lat: -9.4456, lon: 159.9729, timezone: 'Pacific/Guadalcanal' },
  { id: 212, country: 'Vanuatu', city: 'Port Vila', code: 'VU', iso3: 'VUT', flag: '🇻🇺', region: 'Oceania', subregion: 'Melanesia', type: 'sovereign', lat: -17.7333, lon: 168.3273, timezone: 'Pacific/Efate' },
  { id: 213, country: 'Samoa', city: 'Apia', code: 'WS', iso3: 'WSM', flag: '🇼🇸', region: 'Oceania', subregion: 'Polynesia', type: 'sovereign', lat: -13.8333, lon: -171.7667, timezone: 'Pacific/Apia' },
  { id: 214, country: 'Kiribati', city: 'Tarawa', code: 'KI', iso3: 'KIR', flag: '🇰🇮', region: 'Oceania', subregion: 'Micronesia', type: 'sovereign', lat: 1.3291, lon: 172.9790, timezone: 'Pacific/Tarawa' },
  { id: 215, country: 'Micronesia', city: 'Palikir', code: 'FM', iso3: 'FSM', flag: '🇫🇲', region: 'Oceania', subregion: 'Micronesia', type: 'sovereign', lat: 6.9248, lon: 158.1611, timezone: 'Pacific/Pohnpei' },
  { id: 216, country: 'Tonga', city: 'Nuku\'alofa', code: 'TO', iso3: 'TON', flag: '🇹🇴', region: 'Oceania', subregion: 'Polynesia', type: 'sovereign', lat: -21.1393, lon: -175.2018, timezone: 'Pacific/Tongatapu' },
  { id: 217, country: 'Marshall Islands', city: 'Majuro', code: 'MH', iso3: 'MHL', flag: '🇲🇭', region: 'Oceania', subregion: 'Micronesia', type: 'sovereign', lat: 7.1164, lon: 171.1859, timezone: 'Pacific/Majuro' },
  { id: 218, country: 'Palau', city: 'Ngerulmud', code: 'PW', iso3: 'PLW', flag: '🇵🇼', region: 'Oceania', subregion: 'Micronesia', type: 'sovereign', lat: 7.5004, lon: 134.6243, timezone: 'Pacific/Palau' },
  { id: 219, country: 'Tuvalu', city: 'Funafuti', code: 'TV', iso3: 'TUV', flag: '🇹🇻', region: 'Oceania', subregion: 'Polynesia', type: 'sovereign', lat: -8.5167, lon: 179.2167, timezone: 'Pacific/Funafuti' },
  { id: 220, country: 'Nauru', city: 'Yaren', code: 'NR', iso3: 'NRU', flag: '🇳🇷', region: 'Oceania', subregion: 'Micronesia', type: 'sovereign', lat: -0.5477, lon: 166.9209, timezone: 'Pacific/Nauru' },
  { id: 221, country: 'New Caledonia', city: 'Nouméa', code: 'NC', iso3: 'NCL', flag: '🇳🇨', region: 'Oceania', subregion: 'Melanesia', type: 'territory', lat: -22.2711, lon: 166.4416, timezone: 'Pacific/Noumea' },
  { id: 222, country: 'French Polynesia', city: 'Papeete', code: 'PF', iso3: 'PYF', flag: '🇵🇫', region: 'Oceania', subregion: 'Polynesia', type: 'territory', lat: -17.5516, lon: -149.5584, timezone: 'Pacific/Tahiti' },
  { id: 223, country: 'Guam', city: 'Hagåtña', code: 'GU', iso3: 'GUM', flag: '🇬🇺', region: 'Oceania', subregion: 'Micronesia', type: 'territory', lat: 13.4763, lon: 144.7502, timezone: 'Pacific/Guam' },
  { id: 224, country: 'Northern Mariana Islands', city: 'Saipan', code: 'MP', iso3: 'MNP', flag: '🇲🇵', region: 'Oceania', subregion: 'Micronesia', type: 'territory', lat: 15.1900, lon: 145.7467, timezone: 'Pacific/Saipan' },
  { id: 225, country: 'American Samoa', city: 'Pago Pago', code: 'AS', iso3: 'ASM', flag: '🇦🇸', region: 'Oceania', subregion: 'Polynesia', type: 'territory', lat: -14.2756, lon: -170.7020, timezone: 'Pacific/Pago_Pago' },
  { id: 226, country: 'Cook Islands', city: 'Avarua', code: 'CK', iso3: 'COK', flag: '🇨🇰', region: 'Oceania', subregion: 'Polynesia', type: 'territory', lat: -21.2064, lon: -159.7753, timezone: 'Pacific/Rarotonga' },
  { id: 227, country: 'Antarctica', city: 'McMurdo Station', code: 'AQ', iso3: 'ATA', flag: '🇦🇶', region: 'Antarctica', subregion: 'Polar', type: 'territory', lat: -77.8460, lon: 166.6681, timezone: 'Antarctica/McMurdo' }
];

  // Weather code mapping for Open-Meteo
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
  let items = MASTER_COUNTRIES.map(c => ({
    ...c,
    temp: null,
    condition: 'Pending Telemetry',
    icon: 'cloud-sun',
    humidity: null,
    wind: null,
    status: 'idle', // 'idle' | 'loading' | 'loaded' | 'cached' | 'error'
    lastUpdated: null,
    error: null
  }));

  let isFetching = false;
  let lastSyncTime = null;

  // Restore cache if valid (strictly numeric temperatures, preserving genuine 0°C)
  try {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.items) && parsed.timestamp) {
          const isFresh = (Date.now() - new Date(parsed.timestamp).getTime()) < CACHE_TTL_MS;
          if (isFresh) {
            const cachedMap = new Map(parsed.items.map(p => [p.id, p]));
            items = items.map(c => {
              const cachedItem = cachedMap.get(c.id);
              if (cachedItem && typeof cachedItem.temp === 'number' && Number.isFinite(cachedItem.temp)) {
                return { ...c, ...cachedItem, status: 'cached' };
              }
              return c;
            });
            lastSyncTime = parsed.timestamp;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Could not restore cached country weather:', e);
  }

  /**
   * Helper to attempt OpenWeatherMap fallback for a single country
   */
  async function tryFallbackForCountry(item) {
    try {
      const base = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
      const owmKey = typeof WeatherAPI !== 'undefined' ? WeatherAPI.getOwmApiKey() : '';
      let owmRes = null;
      if (owmKey) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${owmKey}`;
        const proxyUrl = `${base}/api/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) owmRes = await res.json();
      } else {
        const res = await fetch(`${base}/api/weather/owm?lat=${item.lat}&lon=${item.lon}`);
        if (res.ok) owmRes = await res.json();
      }

      if (owmRes && owmRes.main && typeof owmRes.main.temp === 'number' && Number.isFinite(owmRes.main.temp)) {
        item.temp = owmRes.main.temp;
        item.humidity = typeof owmRes.main.humidity === 'number' ? owmRes.main.humidity : null;
        item.wind = (owmRes.wind && typeof owmRes.wind.speed === 'number') ? Math.round(owmRes.wind.speed * 3.6) : null;
        item.condition = (owmRes.weather && owmRes.weather[0] && owmRes.weather[0].description)
          ? owmRes.weather[0].description.replace(/\b\w/g, l => l.toUpperCase())
          : 'Clear';
        item.status = 'loaded';
        item.lastUpdated = new Date().toISOString();
        item.error = null;
        return true;
      }
    } catch (e) {
      console.warn(`Fallback failed for ${item.city}:`, e);
    }
    return false;
  }

  /**
   * Progressive batch fetch for countries.
   * Handles targetArg as a number (e.g. 25 countries), an array of countries, or fetches un-loaded countries.
   * Returns: { items, updatedCount, totalLoaded, totalCountries, errors }
   */
  async function fetchBatch(targetArg, onProgress) {
    if (isFetching) {
      return {
        items: items,
        updatedCount: 0,
        totalLoaded: items.filter(c => (c.status === 'loaded' || c.status === 'cached') && typeof c.temp === 'number').length,
        totalCountries: items.length,
        errors: 0
      };
    }

    let targetList = [];
    if (typeof targetArg === 'number') {
      const pending = items.filter(c => c.status !== 'loaded' && c.status !== 'cached');
      targetList = pending.length > 0 ? pending.slice(0, targetArg) : items.slice(0, targetArg);
    } else if (Array.isArray(targetArg) && targetArg.length > 0) {
      targetList = targetArg;
    } else {
      const pending = items.filter(c => c.status !== 'loaded');
      targetList = pending.length > 0 ? pending : items;
    }

    if (targetList.length === 0) {
      return {
        items: items,
        updatedCount: 0,
        totalLoaded: items.filter(c => (c.status === 'loaded' || c.status === 'cached') && typeof c.temp === 'number').length,
        totalCountries: items.length,
        errors: 0
      };
    }

    isFetching = true;
    let updatedCount = 0;
    let errorCount = 0;

    try {
      const BATCH_SIZE = 20;
      const chunks = [];
      for (let i = 0; i < targetList.length; i += BATCH_SIZE) {
        chunks.push(targetList.slice(i, i + BATCH_SIZE));
      }

      for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
        const chunk = chunks[chunkIdx];
        chunk.forEach(c => {
          const item = items.find(it => it.id === c.id);
          if (item && item.status !== 'loaded') item.status = 'loading';
        });

        const lats = chunk.map(c => c.lat).join(',');
        const lons = chunk.map(c => c.lon).join(',');
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lats + '&longitude=' + lons + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto';

        let chunkSuccess = false;
        try {
          let data = null;
          if (typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http')) {
            try {
              const base = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
              const proxyUrl = base + '/api/proxy?url=' + encodeURIComponent(url);
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
            const nowIso = new Date().toISOString();

            for (let idx = 0; idx < results.length; idx++) {
              const itemData = results[idx];
              const targetItem = chunk[idx];
              if (!targetItem) continue;

              const item = items.find(it => it.id === targetItem.id);
              if (!item) continue;

              if (itemData && itemData.current && typeof itemData.current.temperature_2m === 'number' && Number.isFinite(itemData.current.temperature_2m)) {
                const cur = itemData.current;
                const mapped = WMO_MAP[cur.weather_code] || { condition: 'Fair', icon: 'sun-cloud' };
                item.temp = cur.temperature_2m;
                item.humidity = (typeof cur.relative_humidity_2m === 'number' && Number.isFinite(cur.relative_humidity_2m)) ? Math.round(cur.relative_humidity_2m) : null;
                item.wind = (typeof cur.wind_speed_10m === 'number' && Number.isFinite(cur.wind_speed_10m)) ? Math.round(cur.wind_speed_10m) : null;
                item.condition = mapped.condition;
                item.icon = mapped.icon;
                item.status = 'loaded';
                item.lastUpdated = nowIso;
                item.error = null;
                updatedCount++;
              } else {
                // Incomplete telemetry from primary provider, attempt fallback
                const fallbackOk = await tryFallbackForCountry(item);
                if (fallbackOk) {
                  updatedCount++;
                } else {
                  item.status = 'error';
                  item.temp = null;
                  item.condition = 'Weather unavailable';
                  item.error = 'Incomplete telemetry';
                  errorCount++;
                }
              }
            }
            chunkSuccess = true;
          }
        } catch (chunkErr) {
          console.warn('Batch fetch failed for chunk ' + chunkIdx + ':', chunkErr);
        }

        // If the entire chunk network request failed, attempt fallback or mark error per item
        if (!chunkSuccess) {
          for (const c of chunk) {
            const item = items.find(it => it.id === c.id);
            if (!item) continue;
            const fallbackOk = await tryFallbackForCountry(item);
            if (fallbackOk) {
              updatedCount++;
            } else {
              item.status = 'error';
              item.temp = null;
              item.condition = 'Weather unavailable';
              item.error = 'Network request failed';
              errorCount++;
            }
          }
        }

        if (typeof onProgress === 'function') {
          onProgress(Math.round(((chunkIdx + 1) / chunks.length) * 100));
        }

        // Brief yield between chunks to prevent CPU spikes and rate limits
        await new Promise(r => setTimeout(r, 60));
      }

      lastSyncTime = new Date().toISOString();
      saveCache();

    } finally {
      isFetching = false;
    }

    const totalLoaded = items.filter(c => (c.status === 'loaded' || c.status === 'cached') && typeof c.temp === 'number').length;
    return {
      items: items,
      updatedCount: updatedCount,
      totalLoaded: totalLoaded,
      totalCountries: items.length,
      errors: errorCount
    };
  }

  /**
   * Fetch a single country's weather on demand (e.g. on card Retry click)
   */
  async function fetchCountry(countryId) {
    const item = items.find(it => it.id === countryId);
    if (!item) return null;
    item.status = 'loading';
    await fetchBatch([item]);
    saveCache();
    return item;
  }

  function saveCache() {
    try {
      if (typeof localStorage !== 'undefined') {
        const validItems = items.filter(it => (it.status === 'loaded' || it.status === 'cached') && typeof it.temp === 'number');
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          items: validItems,
          timestamp: lastSyncTime
        }));
      }
    } catch (e) {}
  }

  /**
   * Search, filter, and sort countries across the complete directory
   */
  function filterAndSort(searchQuery = '', regionFilter = 'All', sortOption = 'name-asc', typeFilter = 'All') {
    let result = items.slice();

    // 1. Region Filter
    if (regionFilter && regionFilter !== 'All') {
      result = result.filter(c => c.region.toLowerCase() === regionFilter.toLowerCase());
    }

    // 2. Type Filter (Sovereign vs Territory)
    if (typeFilter && typeFilter !== 'All') {
      result = result.filter(c => c.type === typeFilter.toLowerCase());
    }

    // 3. Search Query (Country name, Capital city, ISO-2, ISO-3)
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.country.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.iso3 && c.iso3.toLowerCase().includes(q))
      );
    }

    // 4. Sorting: strictly preserves genuine numeric 0°C and places missing values at the end
    switch (sortOption) {
      case 'temp-desc':
        result.sort((a, b) => {
          const aVal = (typeof a.temp === 'number' && Number.isFinite(a.temp)) ? a.temp : -Infinity;
          const bVal = (typeof b.temp === 'number' && Number.isFinite(b.temp)) ? b.temp : -Infinity;
          return bVal - aVal;
        });
        break;
      case 'temp-asc':
        result.sort((a, b) => {
          const aVal = (typeof a.temp === 'number' && Number.isFinite(a.temp)) ? a.temp : Infinity;
          const bVal = (typeof b.temp === 'number' && Number.isFinite(b.temp)) ? b.temp : Infinity;
          return aVal - bVal;
        });
        break;
      case 'wind-desc':
        result.sort((a, b) => {
          const aVal = (typeof a.wind === 'number' && Number.isFinite(a.wind)) ? a.wind : -Infinity;
          const bVal = (typeof b.wind === 'number' && Number.isFinite(b.wind)) ? b.wind : -Infinity;
          return bVal - aVal;
        });
        break;
      case 'humidity-desc':
        result.sort((a, b) => {
          const aVal = (typeof a.humidity === 'number' && Number.isFinite(a.humidity)) ? a.humidity : -Infinity;
          const bVal = (typeof b.humidity === 'number' && Number.isFinite(b.humidity)) ? b.humidity : -Infinity;
          return bVal - aVal;
        });
        break;
      case 'name-desc':
        result.sort((a, b) => b.country.localeCompare(a.country));
        break;
      case 'name-asc':
      default:
        result.sort((a, b) => a.country.localeCompare(b.country));
        break;
    }

    return result;
  }

  /**
   * Calculate summary statistics strictly from valid retrieved weather data
   */
  function getStats() {
    const totalCount = items.length;
    const valid = items.filter(c => typeof c.temp === 'number' && Number.isFinite(c.temp) && (c.status === 'loaded' || c.status === 'cached'));
    const loadingCount = items.filter(c => c.status === 'loading').length;
    const unavailableCount = items.filter(c => c.status === 'error' || (c.status === 'idle' && c.temp === null)).length;

    if (valid.length === 0) {
      return {
        totalCount: totalCount,
        loadedCount: 0,
        loadingCount: loadingCount,
        unavailableCount: unavailableCount,
        warmest: null,
        coldest: null,
        average: null,
        lastSync: lastSyncTime
      };
    }

    let min = valid[0];
    let max = valid[0];
    let sum = 0;

    valid.forEach(c => {
      if (c.temp < min.temp) min = c;
      if (c.temp > max.temp) max = c;
      sum += c.temp;
    });

    const avg = Math.round(sum / valid.length);

    return {
      totalCount: totalCount,
      loadedCount: valid.length,
      loadingCount: loadingCount,
      unavailableCount: unavailableCount,
      warmest: max,
      coldest: min,
      average: avg,
      lastSync: lastSyncTime
    };
  }

  /**
   * Calculate live atmospheric condition distribution strictly based on actual available data
   */
  function getDistribution() {
    const valid = items.filter(c => typeof c.temp === 'number' && Number.isFinite(c.temp) && (c.status === 'loaded' || c.status === 'cached'));
    if (valid.length === 0) return [];

    const counts = { sunny: 0, cloudy: 0, rainy: 0, stormy: 0, snowy: 0 };

    valid.forEach(c => {
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

    const total = valid.length;
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
    fetchBatch,
    fetchCountry,
    filterAndSort,
    getStats,
    getDistribution,
    getLastSync: () => lastSyncTime,
    isFetching: () => isFetching
  };
})();

if (typeof window !== 'undefined') window.WorldWeather = WorldWeather;
if (typeof global !== 'undefined') global.WorldWeather = WorldWeather;
if (typeof module !== 'undefined' && module.exports) module.exports = WorldWeather;
