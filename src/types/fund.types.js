/**
 * Fund data types based on spec/fund/api.md and spec/common/types.md
 */

/**
 * @typedef {Object} TotalStatusResp
 * @property {number} id - Fund ID
 * @property {string} name - Fund name
 * @property {number} amount - Total amount in KRW
 */

/**
 * @typedef {Object} FundAsset
 * @property {string} name - Asset name
 * @property {string} amount - Total value in KRW
 * @property {string} amount_dollar - Total value in USD (if applicable)
 * @property {string} profit_rate - Percentage profit/loss
 * @property {string} division - Category name in Korean
 * @property {string} quantity - Asset count
 * @property {string} price - Unit price (not used)
 * @property {string} price_dollar - Unit price in USD (not used)
 * @property {boolean} isStable - Whether asset is stable category
 */

/**
 * @typedef {Object} FundPortion
 * @property {number} stable - Percentage of stable assets (0-100)
 * @property {number} volatile - Percentage of volatile assets (0-100)
 */

/**
 * @typedef {Object} InvestHistory
 * @property {number} fund_id - Fund ID
 * @property {number} asset_id - Asset ID
 * @property {string} asset_name - Asset name
 * @property {number} count - Positive for buy, negative for sell
 * @property {number} price - Transaction price
 * @property {string} created_at - Format: "2006-01-02 15:04:05"
 */

export const CategoryMap = {
  1: '현금',
  2: '달러',
  3: '금',
  4: '단기채권',
  5: '국내ETF',
  6: '국내주식',
  7: '국내코인',
  8: '해외주식',
  9: '해외ETF',
  10: '레버리지',
  11: '해외코인',
  12: '국내안전자산ETF',
};

export const StableCategories = [1, 2, 3, 4, 12]; // 현금, 달러, 금, 단기채권, 국내안전자산ETF
