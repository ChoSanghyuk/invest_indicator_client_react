import API_CONFIG from '../config/api.config';

/**
 * Mock data for funds
 */
const mockFundData = {
  "1": {
    "id": 1,
    "name": "Main Fund",
    "amount": 50000000.0
  },
  "2": {
    "id": 2,
    "name": "Reserve Fund",
    "amount": 25000000.0
  },
  "3": {
    "id": 3,
    "name": "Growth Fund",
    "amount": 35000000.0
  }
};

const mockFundAssets = {
  "1": [
    {
      "name": "Apple Inc.",
      "amount": "15000000.00",
      "amount_dollar": "12000.00",
      "profit_rate": "15.50",
      "division": "해외주식",
      "quantity": "100.00",
      "price": "",
      "price_dollar": "",
      "isStable": false
    },
    {
      "name": "Samsung Electronics",
      "amount": "8500000.00",
      "amount_dollar": "",
      "profit_rate": "8.20",
      "division": "국내주식",
      "quantity": "150.00",
      "price": "",
      "price_dollar": "",
      "isStable": false
    },
    {
      "name": "Cash",
      "amount": "26500000.00",
      "amount_dollar": "",
      "profit_rate": "",
      "division": "현금",
      "quantity": "26500000.00",
      "price": "",
      "price_dollar": "",
      "isStable": true
    }
  ],
  "2": [
    {
      "name": "Gold",
      "amount": "15000000.00",
      "amount_dollar": "",
      "profit_rate": "5.30",
      "division": "금",
      "quantity": "200.00",
      "price": "",
      "price_dollar": "",
      "isStable": true
    },
    {
      "name": "Cash",
      "amount": "10000000.00",
      "amount_dollar": "",
      "profit_rate": "",
      "division": "현금",
      "quantity": "10000000.00",
      "price": "",
      "price_dollar": "",
      "isStable": true
    }
  ],
  "3": [
    {
      "name": "Tesla Inc.",
      "amount": "20000000.00",
      "amount_dollar": "16000.00",
      "profit_rate": "25.80",
      "division": "해외주식",
      "quantity": "80.00",
      "price": "",
      "price_dollar": "",
      "isStable": false
    },
    {
      "name": "KODEX 레버리지",
      "amount": "10000000.00",
      "amount_dollar": "",
      "profit_rate": "12.40",
      "division": "레버리지",
      "quantity": "500.00",
      "price": "",
      "price_dollar": "",
      "isStable": false
    },
    {
      "name": "Cash",
      "amount": "5000000.00",
      "amount_dollar": "",
      "profit_rate": "",
      "division": "현금",
      "quantity": "5000000.00",
      "price": "",
      "price_dollar": "",
      "isStable": true
    }
  ]
};

const mockFundPortions = {
  "1": { "stable": 53, "volatile": 47 },
  "2": { "stable": 100, "volatile": 0 },
  "3": { "stable": 14, "volatile": 86 }
};

/**
 * Fetch all funds with total status
 * @returns {Promise<Object>} Map of TotalStatusResp keyed by fund ID
 */
export const getAllFunds = async () => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFundData), 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/funds/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch funds: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch assets for a specific fund
 * @param {number} fundId - Fund ID
 * @returns {Promise<Array>} Array of FundAsset
 */
export const getFundAssets = async (fundId) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFundAssets[fundId.toString()] || []), 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/funds/${fundId}/assets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fund assets: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch portion (stable vs volatile) for a specific fund
 * @param {number} fundId - Fund ID
 * @returns {Promise<Object>} FundPortion object
 */
export const getFundPortion = async (fundId) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFundPortions[fundId.toString()] || { stable: 0, volatile: 0 }), 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/funds/${fundId}/portion`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fund portion: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Format number as Korean Won currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatKRW = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number as USD currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Mock fund history data
 */
const mockFundHistory = {
  "1": [
    {
      fund_id: 1,
      asset_id: 1,
      asset_name: "Apple Inc.",
      count: 10.0,
      price: 120.0,
      created_at: "2024-03-08 09:30:00"
    },
    {
      fund_id: 1,
      asset_id: 1,
      asset_name: "Apple Inc.",
      count: 5.0,
      price: 115.0,
      created_at: "2024-03-05 14:20:00"
    },
    {
      fund_id: 1,
      asset_id: 2,
      asset_name: "Samsung Electronics",
      count: 20.0,
      price: 68000.0,
      created_at: "2024-03-03 10:15:00"
    },
    {
      fund_id: 1,
      asset_id: 1,
      asset_name: "Apple Inc.",
      count: -5.0,
      price: 125.0,
      created_at: "2024-03-01 16:45:00"
    },
    {
      fund_id: 1,
      asset_id: 6,
      asset_name: "현금",
      count: 10000000.0,
      price: 1.0,
      created_at: "2024-02-28 11:00:00"
    }
  ],
  "2": [
    {
      fund_id: 2,
      asset_id: 4,
      asset_name: "Gold",
      count: 50.0,
      price: 1850.0,
      created_at: "2024-03-07 13:20:00"
    },
    {
      fund_id: 2,
      asset_id: 6,
      asset_name: "현금",
      count: 5000000.0,
      price: 1.0,
      created_at: "2024-03-01 09:00:00"
    },
    {
      fund_id: 2,
      asset_id: 4,
      asset_name: "Gold",
      count: 30.0,
      price: 1820.0,
      created_at: "2024-02-25 15:30:00"
    }
  ],
  "3": [
    {
      fund_id: 3,
      asset_id: 3,
      asset_name: "Tesla Inc.",
      count: 15.0,
      price: 200.0,
      created_at: "2024-03-06 11:45:00"
    },
    {
      fund_id: 3,
      asset_id: 5,
      asset_name: "KODEX 레버리지",
      count: 100.0,
      price: 19500.0,
      created_at: "2024-03-04 10:20:00"
    },
    {
      fund_id: 3,
      asset_id: 3,
      asset_name: "Tesla Inc.",
      count: 10.0,
      price: 195.0,
      created_at: "2024-03-02 14:00:00"
    },
    {
      fund_id: 3,
      asset_id: 3,
      asset_name: "Tesla Inc.",
      count: -5.0,
      price: 210.0,
      created_at: "2024-02-28 16:30:00"
    }
  ]
};

/**
 * Fetch investment history for a specific fund
 * @param {number} fundId - Fund ID
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of HistResponse
 */
export const getFundHistory = async (fundId, startDate, endDate) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let history = mockFundHistory[fundId.toString()] || [];

        // Filter by date if provided
        if (startDate || endDate) {
          history = history.filter(item => {
            const itemDate = new Date(item.created_at.replace(' ', 'T'));
            if (startDate && itemDate < new Date(startDate)) return false;
            if (endDate && itemDate > new Date(endDate + 'T23:59:59')) return false;
            return true;
          });
        }

        resolve(history);
      }, 500);
    });
  }

  let url = `${API_CONFIG.BASE_URL}/funds/${fundId}/hist`;
  const params = new URLSearchParams();
  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fund history: ${response.statusText}`);
  }

  return response.json();
};
