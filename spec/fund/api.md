## Fund Endpoints

### Get Total Fund Status
**Endpoint:** `GET /funds/`

**Description:** Retrieve total status of all funds with amounts (converted to KRW)

**Request:** None

**Response Type:** Map of `TotalStatusResp` (keyed by fund ID)
```go
type TotalStatusResp struct {
    ID     uint    `json:"id"`
    Name   string  `json:"name"`
    Amount float64 `json:"amount"`  // Total amount in KRW
}
```

**Response Example:**
```json
{
  "1": {
    "id": 1,
    "name": "Main Fund",
    "amount": 50000000.0
  },
  "2": {
    "id": 2,
    "name": "Reserve Fund",
    "amount": 25000000.0
  }
}
```

**Notes:**
- USD amounts are converted to KRW using current exchange rate
- Only includes assets with non-zero counts

**Status Codes:**
- `200 OK` - Success

---

### Add Fund
**Endpoint:** `POST /funds/`

**Description:** Create a new fund

**Request Type:** `AddFundReq`
```go
type AddFundReq struct {
    Name string `json:"name" validate:"required"`
}
```

**Request Body Example:**
```json
{
  "name": "New Investment Fund"
}
```

**Response Type:** Plain text string
```
자금 정보 저장 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters or validation failure

---

### Get Fund Assets
**Endpoint:** `GET /funds/:id/assets`

**Description:** Retrieve all assets held by a specific fund with current values

**Path Parameters:**
- `id`: Fund ID (integer)

**Request:** None

**Response Type:** Array of `fundAssetsResponse`
```go
type fundAssetsResponse struct {
    Name         string `json:"name"`
    Amount       string `json:"amount"`         // Total value in KRW
    AmountDollar string `json:"amount_dollar"`  // Total value in USD (if applicable)
    ProfitRate   string `json:"profit_rate"`    // Percentage profit/loss
    Division     string `json:"division"`       // Category name in Korean
    Quantity     string `json:"quantity"`       // Asset count
    Price        string `json:"price"`          // Unit price (not used)
    PriceDollar  string `json:"price_dollar"`   // Unit price in USD (not used)
    IsStable     bool   `json:"isStable"`       // Whether asset is stable category
}
```

**Response Example:**
```json
[
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
  }
]
```

**Notes:**
- Assets with zero count are excluded
- Profit rate calculation: `100 * (current_value + sold_value - buy_value) / buy_value`
- Empty string for profit_rate indicates cash assets or calculation error

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Fund not found

---

### Get Fund History
**Endpoint:** `GET /funds/:id/hist`

**Description:** Retrieve investment history for a specific fund

**Path Parameters:**
- `id`: Fund ID (integer)

**Query Parameters:**
- `start` (optional): Start date in YYYY-MM-DD format
- `end` (optional): End date in YYYY-MM-DD format

**Request:** None (query parameters optional)

**Response Type:** Array of `HistResponse`
```go
type HistResponse struct {
    FundId    uint    `json:"fund_id"`
    AssetId   uint    `json:"asset_id"`
    AssetName string  `json:"asset_name"`
    Count     float64 `json:"count"`          // Positive for buy, negative for sell
    Price     float64 `json:"price"`
    CreatedAt string  `json:"created_at"`     // Format: "2006-01-02 15:04:05"
}
```

**Response Example:**
```json
[
  {
    "fund_id": 1,
    "asset_id": 1,
    "asset_name": "Apple Inc.",
    "count": 10.0,
    "price": 120.0,
    "created_at": "2024-03-08 09:30:00"
  },
  {
    "fund_id": 1,
    "asset_id": 2,
    "asset_name": "Samsung Electronics",
    "count": -5.0,
    "price": 65000.0,
    "created_at": "2024-03-07 14:20:00"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Fund not found

---

### Get Fund Portion
**Endpoint:** `GET /funds/:id/portion`

**Description:** Retrieve stable vs volatile asset portion for a fund (as percentage)

**Path Parameters:**
- `id`: Fund ID (integer)

**Request:** None

**Response Type:** `fundPortionResponse`
```go
type fundPortionResponse struct {
    Stable   int `json:"stable"`    // Percentage (0-100)
    Volatile int `json:"volatile"`  // Percentage (0-100)
}
```

**Response Example:**
```json
{
  "stable": 60,
  "volatile": 40
}
```

**Notes:**
- Values are percentages that sum to 100
- Stable categories: 현금, 달러, 금, 단기채권, 국내안전자산ETF
- USD amounts converted to KRW for calculation
- Returns `{"stable": 0, "volatile": 0}` if fund has no assets

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Fund not found

---

### Get Available Amounts
**Endpoint:** `GET /funds/:id/available_amounts`

**Description:** Retrieve available investment amounts for a fund based on current market status

**Path Parameters:**
- `id`: Fund ID (integer)

**Request:** None

**Response Type:** Returned from `InvestStatusIndicator.InvestAvailableAmount()`
```
Structure depends on implementation of InvestAvailableAmount
```

**Response Example:**
```json
{

}
```

**Notes:**
- Implementation-specific response structure
- Calculated based on market level and fund portion rules

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Fund not found

---
