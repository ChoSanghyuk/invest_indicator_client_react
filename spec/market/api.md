## Market Endpoints

### Get Market Status
**Endpoint:** `GET /market/:date?`

**Description:** Retrieve market status for a specific date (optional)

**Path Parameters:**
- `date` (optional): Date in YYYYMMDD format

**Request:** None

**Response Type:** `Market`
```go
type Market struct {
    ID        uint
    Status    uint      // MarketLevel: 1=MAJOR_BEAR, 2=BEAR, 3=VOLATILIY, 4=BULL, 5=MAJOR_BULL
    CreatedAt time.Time
}
```

**Response Example:**
```json
{
  "ID": 1,
  "Status": 3,
  "CreatedAt": "2024-03-08T12:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid date format

---

### Get Market Indicators
**Endpoint:** `GET /market/indicators/:date?`

**Description:** Retrieve daily and CLI market indicators for a specific date

**Path Parameters:**
- `date` (optional): Date in YYYYMMDD format

**Request:** None

**Response Type:** Array containing `[DailyIndex, CliIndex]`
```go
type DailyIndex struct {
    CreatedAt      time.Time
    FearGreedIndex uint
    NasDaq         float64
    Sp500          float64
}

type CliIndex struct {
    CreatedAt time.Time
    Index     float64
}
```

**Response Example:**
```json
[
  {
    "CreatedAt": "2024-03-08T00:00:00Z",
    "FearGreedIndex": 65,
    "NasDaq": 15234.50,
    "Sp500": 4567.89
  },
  {
    "CreatedAt": "2024-03-08T00:00:00Z",
    "Index": 102.5
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid date format

---

### Get Weekly Market Indicators
**Endpoint:** `GET /market/weekly_indicators`

**Description:** Retrieve weekly market indicators including Fear & Greed Index, NASDAQ, S&P 500, and High Yield Spread

**Request:** None

**Response Type:** Map of `MarketIndexInner`
```go
type MarketIndexInner struct {
    Value     string    `json:"value"`
    Status    string    `json:"status"`
    GraphData []float64 `json:"graph"`
}
```

**Response Example:**
```json
{
  "Fear & Greed Index": {
    "value": "65",
    "status": "GREED",
    "graph": [45.0, 50.0, 55.0, 60.0, 62.0, 63.0, 65.0]
  },
  "NASDAQ": {
    "value": "15234.50",
    "status": "2.50%",
    "graph": [15000.0, 15050.0, 15100.0, 15150.0, 15180.0, 15200.0, 15234.50]
  },
  "S&P 500": {
    "value": "4567.89",
    "status": "1.20%",
    "graph": [4500.0, 4520.0, 4530.0, 4540.0, 4550.0, 4560.0, 4567.89]
  },
  "High Yield Spread": {
    "value": "3.45",
    "status": "0.50%",
    "graph": [3.40, 3.41, 3.42, 3.43, 3.44, 3.44, 3.45]
  }
}
```

**Notes:**
- Fear & Greed Index status: "GREED" if value > 50, otherwise "FEAR"
- NASDAQ and S&P 500 status: Percentage change from previous day
- High Yield Spread status: Percentage change from previous day
- GraphData contains 7 values (one week of data)

**Status Codes:**
- `200 OK` - Success

---

### Change Market Status
**Endpoint:** `POST /market/`

**Description:** Update market status

**Request Type:** `SaveMarketStatusParam`
```go
type SaveMarketStatusParam struct {
    Status uint `json:"status" validate:"required,market_status"`
}
```

**Request Body Example:**
```json
{
  "status": 3
}
```

**Response Type:** Plain text string
```
시장 상태 저장 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters (status must be 1-5)

---
