/**
 * History data types based on spec/fund/api.md
 */

/**
 * @typedef {Object} InvestmentHistory
 * @property {number} fund_id - Fund ID
 * @property {number} asset_id - Asset ID
 * @property {string} asset_name - Asset name
 * @property {number} count - Positive for buy, negative for sell
 * @property {number} price - Transaction price
 * @property {string} created_at - Transaction date/time "YYYY-MM-DD HH:MM:SS"
 */

/**
 * Format date for API query parameters
 * @param {Date} date - Date object
 * @returns {string} Formatted date YYYY-MM-DD
 */
export const formatDateForAPI = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse date string from API
 * @param {string} dateString - Date string "YYYY-MM-DD HH:MM:SS"
 * @returns {Date} Date object
 */
export const parseAPIDate = (dateString) => {
  return new Date(dateString.replace(' ', 'T'));
};
