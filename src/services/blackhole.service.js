import API_CONFIG, { getAuthHeaders } from '../config/api.config';

/**
 * Mock data for blackhole profit
 */
const mockBlackholeProfit = {
  baseTotalAsset: 10000.00,
  currentTotalAsset: 12345.67,
  profitRate: 0.2346,
  profitAmtAvax: 50.25,
  profitAmtUsdc: 2345.67
};

/**
 * Fetch blackhole profit data
 * @param {string} baseDate - Base date in YYYY-MM-DD format
 * @returns {Promise<Object>} Profit data object
 */
export const getBlackholeProfit = async (baseDate) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBlackholeProfit), 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/blackhole/profit?baseDate=${baseDate}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blackhole profit: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Format profit rate as percentage
 * @param {number} rate - Profit rate as decimal (e.g., 0.123 = 12.3%)
 * @returns {string} Formatted percentage string
 */
export const formatProfitRate = (rate) => {
  return `${(rate * 100).toFixed(2)}%`;
};

/**
 * Format AVAX amount
 * @param {number} amount - AVAX amount
 * @returns {string} Formatted AVAX string
 */
export const formatAvaxAmount = (amount) => {
  return `${amount.toFixed(2)} AVAX`;
};

/**
 * Format USDC amount
 * @param {number} amount - USDC amount
 * @returns {string} Formatted USDC string
 */
export const formatUsdcAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
