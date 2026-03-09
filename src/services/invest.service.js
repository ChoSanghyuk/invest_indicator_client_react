import API_CONFIG from '../config/api.config';

/**
 * Record a new investment transaction
 * @param {Object} investData - Investment data
 * @param {number} investData.fund_id - Fund ID
 * @param {number} investData.asset_id - Asset ID (optional if name/code provided)
 * @param {string} investData.name - Asset name (optional)
 * @param {string} investData.code - Asset code (optional)
 * @param {number} investData.price - Transaction price
 * @param {number} investData.count - Quantity (positive for buy, negative for sell)
 * @returns {Promise<string>} Success message
 */
export const recordInvestment = async (investData) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate required fields
        if (!investData.fund_id || !investData.price || !investData.count) {
          reject(new Error('Missing required fields'));
          return;
        }

        // Validate at least one asset identifier
        if (!investData.asset_id && !investData.name && !investData.code) {
          reject(new Error('At least one asset identifier required (asset_id, name, or code)'));
          return;
        }

        resolve('Invest 이력 저장 성공');
      }, 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/invest/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(investData),
  });

  if (!response.ok) {
    throw new Error(`Failed to record investment: ${response.statusText}`);
  }

  return response.text();
};
