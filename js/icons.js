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

    'star': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`,

    'star-filled': `
      <svg viewBox="0 0 24 24" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`,

    'umbrella': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/>
      </svg>`,

    'sparkles': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
      </svg>`,

    'activity': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>`,

    'compare': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 3h5v5"/>
        <path d="M4 20L21 3"/>
        <path d="M21 16v5h-5"/>
        <path d="M15 15l6 6"/>
        <path d="M4 4l5 5"/>
      </svg>`,

    'map': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>`,

    'grid': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>`,

    'chevron-down': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>`,

    'chevron-up': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>`,

    'close': `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>`
  };

  // Weather-Adaptive Dynamic Animated Loader Icons
  const loaderIcons = {
    'sunny': `
      <svg class="loader-weather-svg loader-sunny-svg" viewBox="0 0 80 80" fill="none">
        <g class="loader-sun-rays">
          <line x1="40" y1="8" x2="40" y2="16" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="40" y1="64" x2="40" y2="72" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="8" y1="40" x2="16" y2="40" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="64" y1="40" x2="72" y2="40" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="17.4" y1="17.4" x2="23" y2="23" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="57" y1="57" x2="62.6" y2="62.6" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="17.4" y1="62.6" x2="23" y2="57" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
          <line x1="57" y1="23" x2="62.6" y2="17.4" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
        </g>
        <circle class="loader-sun-core" cx="40" cy="40" r="18" fill="url(#sunLoaderGrad)" stroke="#F59E0B" stroke-width="3"/>
        <defs>
          <radialGradient id="sunLoaderGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="100%" stop-color="#F59E0B"/>
          </radialGradient>
        </defs>
      </svg>`,

    'rainy': `
      <svg class="loader-weather-svg loader-rainy-svg" viewBox="0 0 80 80" fill="none">
        <path class="loader-cloud-body" d="M58 40H22C15.4 40 10 34.6 10 28C10 21.9 14.5 16.9 20.4 16.1C21.5 5.3 30.6 -3 42 -3C54.2 -3 64.2 7 64.2 19.2C64.2 20.2 64.1 21.2 64 22.2C67.6 24.1 70 27.7 70 32C70 36.4 66.4 40 62 40H58Z" fill="#334155" fill-opacity="0.5" stroke="#94A3B8" stroke-width="3"/>
        <line class="loader-drop loader-drop-1" x1="22" y1="46" x2="18" y2="60" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <line class="loader-drop loader-drop-2" x1="34" y1="46" x2="30" y2="60" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <line class="loader-drop loader-drop-3" x1="46" y1="46" x2="42" y2="60" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <line class="loader-drop loader-drop-4" x1="58" y1="46" x2="54" y2="60" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`,

    'stormy': `
      <svg class="loader-weather-svg loader-stormy-svg" viewBox="0 0 80 80" fill="none">
        <path class="loader-cloud-body" d="M58 38H22C15.4 38 10 32.6 10 26C10 19.9 14.5 14.9 20.4 14.1C21.5 3.3 30.6 -5 42 -5C54.2 -5 64.2 5 64.2 17.2C67.6 19.1 70 22.7 70 27C70 31.4 66.4 35 62 35H58Z" fill="#1e1e38" fill-opacity="0.65" stroke="#64748B" stroke-width="3"/>
        <line class="loader-drop loader-drop-1" x1="18" y1="44" x2="14" y2="58" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
        <polygon class="loader-lightning-bolt" points="40,36 28,50 37,50 33,68 53,46 43,46" fill="#FACC15" stroke="#EAB308" stroke-width="1.5"/>
        <line class="loader-drop loader-drop-3" x1="60" y1="44" x2="56" y2="58" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
      </svg>`,

    'snowy': `
      <svg class="loader-weather-svg loader-snowy-svg" viewBox="0 0 80 80" fill="none">
        <g class="loader-snowflake-spin">
          <line x1="40" y1="10" x2="40" y2="70" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round"/>
          <line x1="10" y1="40" x2="70" y2="40" stroke="#BAE6FD" stroke-width="4" stroke-linecap="round"/>
          <line x1="19" y1="19" x2="61" y2="61" stroke="#BAE6FD" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="19" y1="61" x2="61" y2="19" stroke="#BAE6FD" stroke-width="3.5" stroke-linecap="round"/>
          <polyline points="32,18 40,26 48,18" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
          <polyline points="32,62 40,54 48,62" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
          <polyline points="18,32 26,40 18,48" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
          <polyline points="62,32 54,40 62,48" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
        </g>
      </svg>`,

    'cloudy': `
      <svg class="loader-weather-svg loader-cloudy-svg" viewBox="0 0 80 80" fill="none">
        <path class="loader-cloud-back" d="M62 42H34C28.5 42 24 37.5 24 32C24 27 27.7 22.8 32.6 22.1C33.5 13.1 41.1 6 50.5 6C60.7 6 69 14.3 69 24.5C72 26.1 74 29.1 74 32.6C74 37.8 68.6 42 62 42Z" fill="#475569" fill-opacity="0.3" stroke="#64748B" stroke-width="2.5"/>
        <path class="loader-cloud-front" d="M50 56H18C12.5 56 8 51.5 8 46C8 41 11.7 36.8 16.6 36.1C17.5 27.1 25.1 20 34.5 20C44.7 20 53 28.3 53 38.5C56 40.1 58 43.1 58 46.6C58 51.8 54.4 56 50 56Z" fill="#94A3B8" fill-opacity="0.35" stroke="#CBD5E1" stroke-width="3"/>
      </svg>`,

    'night': `
      <svg class="loader-weather-svg loader-night-svg" viewBox="0 0 80 80" fill="none">
        <path class="loader-moon-body" d="M52 56C36.5 56 24 43.5 24 28C24 23.9 24.9 20 26.4 16.5C18.4 21.4 13 30.2 13 40.3C13 55.4 25.2 67.7 40.3 67.7C50.4 67.7 59.2 62.3 64.1 54.3C60.6 55.8 56.4 56 52 56Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
        <polygon class="loader-star loader-star-1" points="58,16 60,21 65,22 61,26 62,31 58,28 54,31 55,26 51,22 56,21" fill="#FDE047"/>
        <polygon class="loader-star loader-star-2" points="36,12 37,15 40,16 38,19 39,22 36,20 33,22 34,19 32,16 35,15" fill="#FDE047"/>
      </svg>`,

    'foggy': `
      <svg class="loader-weather-svg loader-foggy-svg" viewBox="0 0 80 80" fill="none">
        <path class="loader-cloud-body" d="M58 34H22C15.4 34 10 28.6 10 22C10 15.9 14.5 10.9 20.4 10.1C21.5 -0.7 30.6 -9 42 -9C54.2 -9 64.2 1 64.2 13.2C67.6 15.1 70 18.7 70 23C70 29 64.8 34 58 34Z" fill="#475569" fill-opacity="0.25" stroke="#94A3B8" stroke-width="2.5"/>
        <line class="loader-fog-bar-1" x1="14" y1="44" x2="66" y2="44" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
        <line class="loader-fog-bar-2" x1="20" y1="52" x2="60" y2="52" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
        <line class="loader-fog-bar-3" x1="26" y1="60" x2="54" y2="60" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`,

    'windy': `
      <svg class="loader-weather-svg loader-windy-svg" viewBox="0 0 80 80" fill="none">
        <path class="loader-wind-line loader-wind-1" d="M14 26H50C54.4 26 58 22.4 58 18C58 13.6 54.4 10 50 10C45.6 10 42 13.6 42 18" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <path class="loader-wind-line loader-wind-2" d="M10 40H60C64.4 40 68 43.6 68 48C68 52.4 64.4 56 60 56C55.6 56 52 52.4 52 48" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <path class="loader-wind-line loader-wind-3" d="M18 54H42C45.3 54 48 56.7 48 60C48 63.3 45.3 66 42 66C38.7 66 36 63.3 36 60" stroke="#7DD3FC" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`,

    'default': `
      <svg class="loader-weather-svg loader-suncloud-svg" viewBox="0 0 80 80" fill="none">
        <g class="loader-sun-rotate-small">
          <circle cx="34" cy="28" r="14" fill="#FBBF24" stroke="#F59E0B" stroke-width="2.5"/>
          <line x1="34" y1="8" x2="34" y2="12" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <line x1="14" y1="28" x2="18" y2="28" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <line x1="20" y1="14" x2="23" y2="17" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
        </g>
        <path class="loader-cloud-front" d="M60 58H26C20 58 15 53 15 47C15 41.5 19 37 24.5 36.3C26 26.5 34.5 19 44.5 19C55.5 19 64.5 28 64.5 39C67.5 40.5 70 43.5 70 47.5C70 53.3 65.5 58 60 58Z" fill="#94A3B8" fill-opacity="0.35" stroke="#E2E8F0" stroke-width="3"/>
      </svg>`
  };

  function get(name) {
    return icons[name] || icons['sun-cloud'] || '';
  }

  function getLoader(categoryOrName) {
    if (!categoryOrName) return loaderIcons['default'];
    const key = String(categoryOrName).toLowerCase();

    if (key.includes('rain') || key.includes('drizzle') || key.includes('shower')) return loaderIcons['rainy'];
    if (key.includes('storm') || key.includes('thunder') || key.includes('lightning')) return loaderIcons['stormy'];
    if (key.includes('snow') || key.includes('sleet') || key.includes('hail') || key.includes('freez')) return loaderIcons['snowy'];
    if (key.includes('fog') || key.includes('mist') || key.includes('rime') || key.includes('haze')) return loaderIcons['foggy'];
    if (key.includes('night') || key.includes('moon')) return loaderIcons['night'];
    if (key.includes('wind') || key.includes('breeze')) return loaderIcons['windy'];
    if (key.includes('sun') || key.includes('clear')) return loaderIcons['sunny'];
    if (key.includes('cloud') || key.includes('overcast')) return loaderIcons['cloudy'];

    return loaderIcons[key] || loaderIcons['default'];
  }

  return { get, getLoader, icons, loaderIcons };
})();

