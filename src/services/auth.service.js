import API_CONFIG from '../config/api.config';

/**
 * Login user and get JWT token
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} JWT response with token and expiry
 */
export const login = async (credentials) => {
  if (API_CONFIG.USE_MOCK) {
    // Mock mode - no login required, return mock token
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-12345',
          expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
        });
      }, 300);
    });
  }

  const url = `${API_CONFIG.BASE_URL}/login/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorMessage = `Login failed: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Could not parse error response
      }

      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Store authentication token in localStorage
 * @param {string} token - JWT token
 * @param {number} expiry - Token expiry timestamp
 */
export const storeToken = (token, expiry) => {
  // Server returns expiry as Unix timestamp in seconds, convert to milliseconds
  const expiryMs = expiry * 1000;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_expiry', expiryMs.toString());
};

/**
 * Get stored authentication token
 * @returns {string|null} JWT token or null if not found/expired
 */
export const getToken = () => {
  const token = localStorage.getItem('auth_token');
  const expiry = localStorage.getItem('auth_expiry');

  if (!token || !expiry) {
    return null;
  }

  // Check if token is expired
  // Expiry is stored in milliseconds (converted from server's seconds in storeToken)
  if (Date.now() > parseInt(expiry)) {
    clearToken();
    return null;
  }

  return token;
};

/**
 * Clear stored authentication token
 */
export const clearToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_expiry');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  if (API_CONFIG.USE_MOCK) {
    // In mock mode, always authenticated
    return true;
  }
  return getToken() !== null;
};
