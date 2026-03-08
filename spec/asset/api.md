## Asset Endpoints

### Get All Assets
**Endpoint:** `GET /assets`

**Description:** Retrieve all assets with current prices

**Request:** None

**Response Type:** Array of `assetResponse`
```go
type assetResponse struct {
    ID        uint    `json:"id"`
    Name      string  `json:"name"`
    Category  string  `json:"category"`      // Category name in Korean
    Code      string  `json:"code"`
    Currency  string  `json:"currency"`      // "WON" or "USD"
    Top       float64 `json:"top"`
    Bottom    float64 `json:"bottom"`
    SellPrice float64 `json:"sell"`
    BuyPrice  float64 `json:"buy"`
    Ema       float64 `json:"ema"`
    NDays     float64 `json:"ndays"`
    Price     float64 `json:"price"`         // Current/present price
}
```

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Apple Inc.",
    "category": "해외주식",
    "code": "AAPL",
    "currency": "USD",
    "top": 150.0,
    "bottom": 100.0,
    "sell": 145.0,
    "buy": 105.0,
    "ema": 0,
    "ndays": 0,
    "price": 125.0
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### Get Asset List
**Endpoint:** `GET /assets/list`

**Description:** Retrieve simple list of asset IDs and names

**Request:** None

**Response Type:** Array of `assetListResponse`
```go
type assetListResponse struct {
    AssetId   uint   `json:"asset_id"`
    AssetName string `json:"name"`
}
```

**Response Example:**
```json
[
  {
    "asset_id": 1,
    "name": "Apple Inc."
  },
  {
    "asset_id": 2,
    "name": "Samsung Electronics"
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### Get Asset by ID
**Endpoint:** `GET /assets/:id`

**Description:** Retrieve detailed asset information by ID including latest EMA

**Path Parameters:**
- `id`: Asset ID (integer)

**Request:** None

**Response Type:** `assetResponse`
```go
type assetResponse struct {
    ID        uint    `json:"id"`
    Name      string  `json:"name"`
    Category  string  `json:"category"`
    Code      string  `json:"code"`
    Currency  string  `json:"currency"`
    Top       float64 `json:"top"`
    Bottom    float64 `json:"bottom"`
    SellPrice float64 `json:"sell"`
    BuyPrice  float64 `json:"buy"`
    Ema       float64 `json:"ema"`           // Latest EMA value
    NDays     float64 `json:"ndays"`         // EMA period
}
```

**Response Example:**
```json
{
  "id": 1,
  "name": "Apple Inc.",
  "category": "해외주식",
  "code": "AAPL",
  "currency": "USD",
  "top": 150.0,
  "bottom": 100.0,
  "sell": 145.0,
  "buy": 105.0,
  "ema": 120.5,
  "ndays": 20.0
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Asset not found

---

### Get Asset History
**Endpoint:** `GET /assets/:id/hist`

**Description:** Retrieve investment history for an asset

**Path Parameters:**
- `id`: Asset ID (integer)

**Request:** None

**Response Type:** Array of `HistResponse`
```go
type HistResponse struct {
    FundId    uint    `json:"fund_id"`
    AssetId   uint    `json:"asset_id"`
    AssetName string  `json:"asset_name"`
    Count     float64 `json:"count"`
    Price     float64 `json:"price"`
    CreatedAt string  `json:"created_at"`   // Format: "20060102"
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
    "created_at": "20240308"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Asset not found

---

### Add Asset
**Endpoint:** `POST /assets/`

**Description:** Create a new asset

**Request Type:** `AddAssetReq`
```go
type AddAssetReq struct {
    Name      string  `json:"name" validate:"required"`
    Category  string  `json:"category" validate:"required,category"`  // Korean category name
    Code      string  `json:"code"`
    Currency  string  `json:"currency" validate:"required"`           // "WON" or "USD"
    Top       float64 `json:"top"`
    Bottom    float64 `json:"bottom"`
    SellPrice float64 `json:"sell"`
    BuyPrice  float64 `json:"buy"`
    Ema       float64 `json:"ema"`
    Ndays     uint    `json:"ndays"`
}
```

**Request Body Example:**
```json
{
  "name": "Apple Inc.",
  "category": "해외주식",
  "code": "AAPL",
  "currency": "USD",
  "top": 150.0,
  "bottom": 100.0,
  "sell": 145.0,
  "buy": 105.0,
  "ema": 120.5,
  "ndays": 20
}
```

**Notes:**
- Fields `top`, `bottom`, `ema`, and `ndays` are optional
- If `top`/`bottom` are 0, they will be auto-calculated
- If `buy` is 0, it will be set to `bottom` value
- If `ema` is 0, average price will be calculated automatically

**Response Type:** Plain text string
```
자산 정보 저장 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters or validation failure

---

### Update Asset
**Endpoint:** `PUT /assets/`

**Description:** Update existing asset information

**Request Type:** `UpdateAssetReq`
```go
type UpdateAssetReq struct {
    ID        uint    `json:"id" validate:"required"`
    Name      string  `json:"name"`
    Category  string  `json:"category"`
    Code      string  `json:"code"`
    Currency  string  `json:"currency"`
    Top       float64 `json:"top"`
    Bottom    float64 `json:"bottom"`
    SellPrice float64 `json:"sell"`
    BuyPrice  float64 `json:"buy"`
}
```

**Request Body Example:**
```json
{
  "id": 1,
  "name": "Apple Inc.",
  "category": "해외주식",
  "code": "AAPL",
  "currency": "USD",
  "top": 160.0,
  "bottom": 110.0,
  "sell": 155.0,
  "buy": 115.0
}
```

**Response Type:** Plain text string
```
자산 정보 갱신 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters or validation failure
- `404 Not Found` - Asset not found

---

### Delete Asset
**Endpoint:** `DELETE /assets/`

**Description:** Delete an asset

**Request Type:** `DeleteAssetReq`
```go
type DeleteAssetReq struct {
    ID uint `json:"id" validate:"required"`
}
```

**Request Body Example:**
```json
{
  "id": 1
}
```

**Response Type:** Plain text string
```
자산 정보 삭제 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters or validation failure
- `404 Not Found` - Asset not found

---
