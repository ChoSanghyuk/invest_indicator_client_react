import API_CONFIG, { getAuthHeaders } from '../config/api.config';

/**
 * Mock data for assets
 */
const mockAssets = [
  {
    id: 1,
    name: "Apple Inc.",
    category: "해외주식",
    code: "AAPL",
    currency: "USD",
    top: 150.0,
    bottom: 100.0,
    sell: 145.0,
    buy: 105.0,
    ema: 120.5,
    ndays: 20,
    price: 125.0
  },
  {
    id: 2,
    name: "Samsung Electronics",
    category: "국내주식",
    code: "005930",
    currency: "WON",
    top: 75000.0,
    bottom: 60000.0,
    sell: 73000.0,
    buy: 62000.0,
    ema: 68500.0,
    ndays: 20,
    price: 68000.0
  },
  {
    id: 3,
    name: "Tesla Inc.",
    category: "해외주식",
    code: "TSLA",
    currency: "USD",
    top: 250.0,
    bottom: 150.0,
    sell: 240.0,
    buy: 160.0,
    ema: 200.0,
    ndays: 20,
    price: 210.0
  },
  {
    id: 4,
    name: "Gold",
    category: "금",
    code: "GOLD",
    currency: "USD",
    top: 2000.0,
    bottom: 1700.0,
    sell: 1950.0,
    buy: 1750.0,
    ema: 1850.0,
    ndays: 20,
    price: 1875.0
  },
  {
    id: 5,
    name: "KODEX 레버리지",
    category: "레버리지",
    code: "122630",
    currency: "WON",
    top: 22000.0,
    bottom: 18000.0,
    sell: 21500.0,
    buy: 18500.0,
    ema: 20000.0,
    ndays: 20,
    price: 20250.0
  },
  {
    id: 6,
    name: "현금",
    category: "현금",
    code: "CASH_KRW",
    currency: "WON",
    top: 0,
    bottom: 0,
    sell: 0,
    buy: 0,
    ema: 0,
    ndays: 0,
    price: 1.0
  },
  {
    id: 7,
    name: "달러",
    category: "달러",
    code: "USD",
    currency: "USD",
    top: 1350.0,
    bottom: 1200.0,
    sell: 1340.0,
    buy: 1210.0,
    ema: 1275.0,
    ndays: 20,
    price: 1280.0
  },
  {
    id: 8,
    name: "TIGER 미국나스닥100",
    category: "해외ETF",
    code: "133690",
    currency: "WON",
    top: 35000.0,
    bottom: 28000.0,
    sell: 34000.0,
    buy: 29000.0,
    ema: 31500.0,
    ndays: 20,
    price: 32000.0
  },
  {
    id: 9,
    name: "KODEX 단기채권",
    category: "단기채권",
    code: "153130",
    currency: "WON",
    top: 105000.0,
    bottom: 103000.0,
    sell: 104800.0,
    buy: 103200.0,
    ema: 104000.0,
    ndays: 20,
    price: 104100.0
  },
  {
    id: 10,
    name: "Bitcoin",
    category: "해외코인",
    code: "BTC",
    currency: "USD",
    top: 70000.0,
    bottom: 40000.0,
    sell: 65000.0,
    buy: 45000.0,
    ema: 55000.0,
    ndays: 20,
    price: 58000.0
  }
];

/**
 * Fetch all assets with current prices
 * @returns {Promise<Array>} Array of Asset objects
 */
export const getAllAssets = async () => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAssets), 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/assets`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch asset by ID
 * @param {number} assetId - Asset ID
 * @returns {Promise<Object>} Asset object
 */
export const getAssetById = async (assetId) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const asset = mockAssets.find(a => a.id === assetId);
        if (asset) {
          resolve(asset);
        } else {
          reject(new Error('Asset not found'));
        }
      }, 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/assets/${assetId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Format price based on currency
 * @param {number} price - Price value
 * @param {string} currency - Currency type ("WON" or "USD")
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency) => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate price position between buy and sell
 * @param {number} price - Current price
 * @param {number} buy - Buy price
 * @param {number} sell - Sell price
 * @returns {number} Percentage (0-100)
 */
export const calculatePricePosition = (price, buy, sell) => {
  if (sell === buy || sell === 0 || buy === 0) return 50;
  return Math.min(100, Math.max(0, ((price - buy) / (sell - buy)) * 100));
};

/**
 * Add a new asset
 * @param {Object} assetData - Asset data to add
 * @returns {Promise<Object>} Created asset
 */
export const addAsset = async (assetData) => {
  if (API_CONFIG.USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate new ID
        const newId = Math.max(...mockAssets.map(a => a.id), 0) + 1;
        const newAsset = {
          id: newId,
          ...assetData,
          price: assetData.buy || 0, // Set initial price to buy price
        };
        mockAssets.push(newAsset);
        resolve(newAsset);
      }, 500);
    });
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/assets/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(assetData),
  });

  if (!response.ok) {
    throw new Error(`Failed to add asset: ${response.statusText}`);
  }

  return response.json();
};
