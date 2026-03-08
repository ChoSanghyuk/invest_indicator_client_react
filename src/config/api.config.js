const API_CONFIG = {
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true' || true,
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
};

export default API_CONFIG;
