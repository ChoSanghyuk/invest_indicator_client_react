### profit api spec



### api path

GET /blackhole/profit



### Request Parameters

  Query Parameters:
  - baseDate (string, required)
    - Format: YYYY-MM-DD (e.g., "2024-01-15")
    - Description: The base date to calculate profit from

  Example Request

  GET /blackhole/profit?baseDate=2024-01-01



### Response

  Success Response (HTTP 200):
  {
    "baseTotalAsset": 1234.56,
    "currentTotalAsset": 5678.90,
    "profitRate": 0.123,
    "profitAmtAvax": 12.34,
    "profitAmtUsdc": 4444.34
  }

  Response Fields:
  - baseTotalAsset (float64): Total asset value at the base date in USDC (2 decimal places)
  - currentTotalAsset (float64): Current total asset value in USDC (2 decimal places)
  - profitRate (float64): Profit rate as a decimal (e.g., 0.123 = 12.3% profit)
  - profitAmtAvax (float64): Profit amount in AVAX (2 decimal places)
  - profitAmtUsdc (float64): Profit amount in USDC (2 decimal places)

  Error Responses:
  - 400 Bad Request: If baseDate parameter is missing or has invalid format
  - 500 Internal Server Error: If snapshot retrieval fails
