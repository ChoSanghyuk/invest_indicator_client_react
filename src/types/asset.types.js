/**
 * Asset data types based on spec/asset/api.md
 */

/**
 * @typedef {Object} Asset
 * @property {number} id - Asset ID
 * @property {string} name - Asset name
 * @property {string} category - Category name in Korean
 * @property {string} code - Asset code/ticker
 * @property {string} currency - "WON" or "USD"
 * @property {number} top - Top price threshold
 * @property {number} bottom - Bottom price threshold
 * @property {number} sell - Sell price
 * @property {number} buy - Buy price
 * @property {number} ema - Exponential Moving Average
 * @property {number} ndays - EMA period in days
 * @property {number} price - Current/present price
 */

/**
 * @typedef {Object} AssetListItem
 * @property {number} asset_id - Asset ID
 * @property {string} name - Asset name
 */

export const CategoryList = [
  '현금',
  '달러',
  '금',
  '단기채권',
  '국내ETF',
  '국내주식',
  '국내코인',
  '해외주식',
  '해외ETF',
  '레버리지',
  '해외코인',
  '국내안전자산ETF',
];
