/**
 * Weather App - SVG Vector Icons Library
 * High-definition, crisp SVG weather and UI icons that render offline with no dependencies.
 */

const WeatherIcons = (function () {
  const icons = {
    'sun': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="32" cy="32" r="14" fill="#FBBF24" stroke="#F59E0B" />
        <line x1="32" y1="6" x2="32" y2="12" stroke="#F59E0B" stroke-width="3" />
        <line x1="32" y1="52" x2="32" y2="58" stroke="#F59E0B" stroke-width="3" />
        <line x1="6" y1="32" x2="12" y2="32" stroke="#F59E0B" stroke-width="3" />
        <line x1="52" y1="32" x2="58" y2="32" stroke="#F59E0B" stroke-width="3" />
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" stroke="#F59E0B" stroke-width="3" />
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" stroke="#F59E0B" stroke-width="3" />
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" stroke="#F59E0B" stroke-width="3" />
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" stroke="#F59E0B" stroke-width="3" />
      </svg>`,

    'moon': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M42 46C27.64 46 16 34.36 16 20C16 16.2 16.8 12.6 18.25 9.35C10.74 13.9 6 22.1 6 31.5C6 45.58 17.42 57 31.5 57C40.9 57 49.1 52.26 53.65 44.75C50.4 46.2 46.8 46 42 46Z" fill="#E2E8F0" stroke="#94A3B8" />
        <circle cx="28" cy="28" r="3" fill="#CBD5E1" stroke="none" />
        <circle cx="22" cy="40" r="2.5" fill="#CBD5E1" stroke="none" />
        <circle cx="36" cy="38" r="4" fill="#CBD5E1" stroke="none" />
      </svg>`,

    'cloud': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 48H18C12.48 48 8 43.52 8 38C8 32.96 11.72 28.79 16.63 28.09C17.52 19.12 25.13 12 34.5 12C44.7 12 53 20.3 53 30.5C53 31.33 52.95 32.14 52.84 32.94C55.83 34.55 58 37.53 58 41C58 44.87 54.87 48 51 48H48Z" fill="#94A3B8" fill-opacity="0.25" stroke="#CBD5E1" />
      </svg>`,

    'cloud-sun': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="26" cy="22" r="10" fill="#FBBF24" stroke="#F59E0B" />
        <line x1="26" y1="6" x2="26" y2="9" stroke="#F59E0B" stroke-width="2.5" />
        <line x1="12" y1="22" x2="15" y2="22" stroke="#F59E0B" stroke-width="2.5" />
        <line x1="14" y1="10" x2="16.5" y2="12.5" stroke="#F59E0B" stroke-width="2.5" />
        <path d="M48 50H20C15.03 50 11 45.97 11 41C11 36.35 14.54 32.53 19.11 32.06C20.36 24.1 27.24 18 35.5 18C44.61 18 52 25.39 52 34.5C52 35.15 51.96 35.78 51.88 36.4C54.84 37.86 57 40.68 57 44C57 47.31 54.31 50 51 50H48Z" fill="#94A3B8" fill-opacity="0.3" stroke="#E2E8F0" />
      </svg>`,

    'sun-cloud': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="26" cy="22" r="10" fill="#FBBF24" stroke="#F59E0B" />
        <line x1="26" y1="6" x2="26" y2="9" stroke="#F59E0B" stroke-width="2.5" />
        <line x1="12" y1="22" x2="15" y2="22" stroke="#F59E0B" stroke-width="2.5" />
        <line x1="14" y1="10" x2="16.5" y2="12.5" stroke="#F59E0B" stroke-width="2.5" />
        <path d="M48 50H20C15.03 50 11 45.97 11 41C11 36.35 14.54 32.53 19.11 32.06C20.36 24.1 27.24 18 35.5 18C44.61 18 52 25.39 52 34.5C52 35.15 51.96 35.78 51.88 36.4C54.84 37.86 57 40.68 57 44C57 47.31 54.31 50 51 50H48Z" fill="#94A3B8" fill-opacity="0.3" stroke="#E2E8F0" />
      </svg>`,

    'cloud-moon': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M33 26C24 26 16.7 18.7 16.7 9.7C16.7 7.3 17.2 5 18.1 3C13.4 5.9 10.4 11 10.4 17C10.4 25.8 17.6 33 26.4 33C32.4 33 37.5 29.9 40.4 25.2C38.4 25.7 35.7 26 33 26Z" fill="#E2E8F0" stroke="#94A3B8" />
        <path d="M48 50H20C15.03 50 11 45.97 11 41C11 36.35 14.54 32.53 19.11 32.06C20.36 24.1 27.24 18 35.5 18C44.61 18 52 25.39 52 34.5C52 35.15 51.96 35.78 51.88 36.4C54.84 37.86 57 40.68 57 44C57 47.31 54.31 50 51 50H48Z" fill="#64748B" fill-opacity="0.4" stroke="#CBD5E1" />
      </svg>`,

    'cloud-rain': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 40H18C12.48 40 8 35.52 8 30C8 24.96 11.72 20.79 16.63 20.09C17.52 11.12 25.13 4 34.5 4C44.7 4 53 12.3 53 22.5C53 23.33 52.95 24.14 52.84 24.94C55.83 26.55 58 29.53 58 33C58 36.87 54.87 40 51 40H48Z" fill="#64748B" fill-opacity="0.3" stroke="#CBD5E1" />
        <line x1="22" y1="46" x2="18" y2="56" stroke="#38BDF8" stroke-width="3" />
        <line x1="34" y1="46" x2="30" y2="56" stroke="#38BDF8" stroke-width="3" />
        <line x1="46" y1="46" x2="42" y2="56" stroke="#38BDF8" stroke-width="3" />
      </svg>`,

    'cloud-heavy-rain': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 38H18C12.48 38 8 33.52 8 28C8 22.96 11.72 18.79 16.63 18.09C17.52 9.12 25.13 2 34.5 2C44.7 2 53 10.3 53 20.5C53 21.33 52.95 22.14 52.84 22.94C55.83 24.55 58 27.53 58 31C58 34.87 54.87 38 51 38H48Z" fill="#475569" fill-opacity="0.4" stroke="#94A3B8" />
        <line x1="20" y1="44" x2="16" y2="58" stroke="#0284C7" stroke-width="3.5" />
        <line x1="28" y1="44" x2="24" y2="58" stroke="#0284C7" stroke-width="3.5" />
        <line x1="36" y1="44" x2="32" y2="58" stroke="#0284C7" stroke-width="3.5" />
        <line x1="44" y1="44" x2="40" y2="58" stroke="#0284C7" stroke-width="3.5" />
      </svg>`,

    'cloud-drizzle': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 40H18C12.48 40 8 35.52 8 30C8 24.96 11.72 20.79 16.63 20.09C17.52 11.12 25.13 4 34.5 4C44.7 4 53 12.3 53 22.5C53 23.33 52.95 24.14 52.84 24.94C55.83 26.55 58 29.53 58 33C58 36.87 54.87 40 51 40H48Z" fill="#64748B" fill-opacity="0.25" stroke="#CBD5E1" />
        <line x1="24" y1="46" x2="22" y2="52" stroke="#7DD3FC" stroke-width="2.5" stroke-dasharray="2 3" />
        <line x1="36" y1="46" x2="34" y2="52" stroke="#7DD3FC" stroke-width="2.5" stroke-dasharray="2 3" />
        <line x1="46" y1="46" x2="44" y2="52" stroke="#7DD3FC" stroke-width="2.5" stroke-dasharray="2 3" />
      </svg>`,

    'cloud-lightning': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 38H18C12.48 38 8 33.52 8 28C8 22.96 11.72 18.79 16.63 18.09C17.52 9.12 25.13 2 34.5 2C44.7 2 53 10.3 53 20.5C53 21.33 52.95 22.14 52.84 22.94C55.83 24.55 58 27.53 58 31C58 34.87 54.87 38 51 38H48Z" fill="#334155" fill-opacity="0.45" stroke="#94A3B8" />
        <polygon points="32,38 24,50 31,50 29,62 41,47 34,47" fill="#FACC15" stroke="#EAB308" stroke-width="1.5" />
      </svg>`,

    'cloud-lightning-rain': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 38H18C12.48 38 8 33.52 8 28C8 22.96 11.72 18.79 16.63 18.09C17.52 9.12 25.13 2 34.5 2C44.7 2 53 10.3 53 20.5C53 21.33 52.95 22.14 52.84 22.94C55.83 24.55 58 27.53 58 31C58 34.87 54.87 38 51 38H48Z" fill="#334155" fill-opacity="0.5" stroke="#94A3B8" />
        <line x1="18" y1="44" x2="14" y2="56" stroke="#38BDF8" stroke-width="3" />
        <polygon points="34,38 27,48 33,48 31,60 43,45 36,45" fill="#FACC15" stroke="#EAB308" stroke-width="1.5" />
        <line x1="48" y1="44" x2="44" y2="56" stroke="#38BDF8" stroke-width="3" />
      </svg>`,

    'snowflake': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="32" y1="8" x2="32" y2="56" stroke="#BAE6FD" stroke-width="3" />
        <line x1="8" y1="32" x2="56" y2="32" stroke="#BAE6FD" stroke-width="3" />
        <line x1="15" y1="15" x2="49" y2="49" stroke="#BAE6FD" stroke-width="2.5" />
        <line x1="15" y1="49" x2="49" y2="15" stroke="#BAE6FD" stroke-width="2.5" />
        <polyline points="26,14 32,20 38,14" stroke="#38BDF8" stroke-width="2" />
        <polyline points="26,50 32,44 38,50" stroke="#38BDF8" stroke-width="2" />
        <polyline points="14,26 20,32 14,38" stroke="#38BDF8" stroke-width="2" />
        <polyline points="50,26 44,32 50,38" stroke="#38BDF8" stroke-width="2" />
      </svg>`,

    'cloud-snow': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 38H18C12.48 38 8 33.52 8 28C8 22.96 11.72 18.79 16.63 18.09C17.52 9.12 25.13 2 34.5 2C44.7 2 53 10.3 53 20.5C53 21.33 52.95 22.14 52.84 22.94C55.83 24.55 58 27.53 58 31C58 34.87 54.87 38 51 38H48Z" fill="#64748B" fill-opacity="0.3" stroke="#CBD5E1" />
        <circle cx="20" cy="48" r="2.5" fill="#E0F2FE" />
        <circle cx="32" cy="54" r="2.5" fill="#E0F2FE" />
        <circle cx="44" cy="48" r="2.5" fill="#E0F2FE" />
      </svg>`,

    'cloud-fog': `
      <svg class="weather-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M48 34H18C13 34 9 30 9 25C9 20.4 12.3 16.6 16.8 16C17.6 8 24.5 1.7 33 1.7C42.2 1.7 49.7 9.2 49.7 18.4C49.7 19.1 49.6 19.9 49.5 20.6C52.2 22 54 24.8 54 28C54 31.3 51.3 34 48 34Z" fill="#64748B" fill-opacity="0.25" stroke="#CBD5E1" />
        <line x1="12" y1="42" x2="52" y2="42" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" />
        <line x1="16" y1="49" x2="48" y2="49" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" />
        <line x1="20" y1="56" x2="44" y2="56" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" />
      </svg>`,

    // UI and Metric Icons
    'wind': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
      </svg>`,

    'droplet': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>`,

    'sun-uv': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41"/>
      </svg>`,

    'gauge': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
      </svg>`,

    'eye': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
      </svg>`,

    'sunrise': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v6m-7.07.93 4.24 4.24m9.66-4.24-4.24 4.24M2 18h20M7 18a5 5 0 0 1 10 0"/>
      </svg>`,

    'sunset': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 10V4m-7.07 8.07 4.24-4.24m9.66 4.24-4.24-4.24M2 18h20M7 18a5 5 0 0 1 10 0"/>
      </svg>`,

    'search': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>`,

    'map-pin': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>`,

    'crosshair': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>
      </svg>`,

    'settings': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
      </svg>`,

    'arrow-up': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
      </svg>`,

    'umbrella': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/>
      </svg>`,

    'thermometer': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
      </svg>`,

    'check': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`,

    'close': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`
  };

  function get(name) {
    return icons[name] || icons['sun-cloud'] || '';
  }

  return { get, icons };
})();
