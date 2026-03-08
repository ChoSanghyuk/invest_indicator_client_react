/**
 * Market data types based on spec/market/api.md
 */

/**
 * Market Status Levels
 */
export const MarketLevel = {
  MAJOR_BEAR: 1,
  BEAR: 2,
  VOLATILITY: 3,
  BULL: 4,
  MAJOR_BULL: 5,
};

export const MarketLevelNames = {
  1: 'MAJOR BEAR',
  2: 'BEAR',
  3: 'VOLATILITY',
  4: 'BULL',
  5: 'MAJOR BULL',
};

export const MarketLevelDescriptions = {
  1: 'Max volatile: 15%, Min volatile: 10%',
  2: 'Max volatile: 20%, Min volatile: 15%',
  3: 'Max volatile: 25%, Min volatile: 20%',
  4: 'Max volatile: 30%, Min volatile: 25%',
  5: 'Max volatile: 40%, Min volatile: 30%',
};

export const MarketLevelColors = {
  1: '#dc2626', // Red - Major Bear
  2: '#f97316', // Orange - Bear
  3: '#eab308', // Yellow - Volatility
  4: '#22c55e', // Green - Bull
  5: '#10b981', // Emerald - Major Bull
};

/**
 * @typedef {Object} Market
 * @property {number} ID - Market record ID
 * @property {number} Status - Market level (1-5)
 * @property {string} CreatedAt - ISO timestamp
 */

/**
 * @typedef {Object} DailyIndex
 * @property {string} CreatedAt - ISO timestamp
 * @property {number} FearGreedIndex - Fear & Greed Index (0-100)
 * @property {number} NasDaq - NASDAQ value
 * @property {number} Sp500 - S&P 500 value
 */

/**
 * @typedef {Object} CliIndex
 * @property {string} CreatedAt - ISO timestamp
 * @property {number} Index - CLI value
 */

/**
 * @typedef {Object} MarketIndexInner
 * @property {string} value - Current value
 * @property {string} status - Status text (GREED/FEAR or percentage)
 * @property {Array<number>} graph - 7 data points for weekly trend
 */
