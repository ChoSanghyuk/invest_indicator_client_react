const API_CONFIG = {
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true' ,
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
};

/**
 * Get headers with authentication token
 * @returns {Object} Headers object with auth token if available
 */
export const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (!API_CONFIG.USE_MOCK) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export default API_CONFIG;
