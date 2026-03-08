import API_CONFIG from '../config/api.config';

/**
 * Mock market data
 */
const mockMarketStatus = {
  ID: 1,
  Status: 3,
  CreatedAt: new Date().toISOString()
};

const mockWeeklyIndicators = {
  "Fear & Greed Index": {
    value: "65",
    status: "GREED",
    graph: [45.0, 50.0, 55.0, 60.0, 62.0, 63.0, 65.0]
  },
  "NASDAQ": {
    value: "15234.50",
    status: "2.50%",
    graph: [15000.0, 15050.0, 15100.0, 15150.0, 15180.0, 15200.0, 15234.50]
  },
  "S&P 500": {
    value: "4567.89",
    status: "1.20%",
    graph: [4500.0, 4520.0, 4530.0, 4540.0, 4550.0, 4560.0, 4567.89]
  },
  "High Yield Spread": {
    value: "3.45",
    status: "0.50%",
    graph: [3.40, 3.41, 3.42, 3.43, 3.44, 3.44, 3.45]
  }
};

/**
 * Fetch current market status
 * @param {string} date - Optional date in YYYYMMDD format
 * @returns {Promise<Object>} Market object
 */
export const getMarketStatus = async (date) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMarketStatus), 500);
    });
  }

  const url = date
    ? `${API_CONFIG.BASE_URL}/market/${date}`
    : `${API_CONFIG.BASE_URL}/market/`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch market status: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch weekly market indicators
 * @returns {Promise<Object>} Map of MarketIndexInner
 */
export const getWeeklyIndicators = async () => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWeeklyIndicators), 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/market/weekly_indicators`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch weekly indicators: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Update market status
 * @param {number} status - Market level (1-5)
 * @returns {Promise<string>} Success message
 */
export const updateMarketStatus = async (status) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockMarketStatus.Status = status;
        mockMarketStatus.CreatedAt = new Date().toISOString();
        resolve('시장 상태 저장 성공');
      }, 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/market/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update market status: ${response.statusText}`);
  }

  return response.text();
};
