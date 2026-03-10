// Demo mode: when true, no real API or payment; use mock data and demo login only.
// Default to true so the app runs as demo without requiring .env.
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';
