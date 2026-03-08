## Investment Endpoints

### Record Investment
**Endpoint:** `POST /invest/`

**Description:** Record a new investment transaction (buy or sell)

**Request Type:** `SaveInvestParam`
```go
type SaveInvestParam struct {
    FundId    uint    `json:"fund_id" validate:"required"`
    AssetId   uint    `json:"asset_id"`
    AssetName string  `json:"name"`
    AssetCode string  `json:"code"`
    Price     float64 `json:"price" validate:"required"`
    Count     float64 `json:"count" validate:"required"`  // Positive for buy, negative for sell
}
```

**Request Body Example:**
```json
{
  "fund_id": 1,
  "asset_id": 5,
  "name": "",
  "code": "",
  "price": 120.5,
  "count": 10.0
}
```

**Notes:**
- You can specify asset by `asset_id`, `name` (AssetName), or `code` (AssetCode)
- At least one asset identifier must be provided
- If multiple identifiers provided, priority: `asset_id` > `name` > `code`
- Positive `count` for purchases, negative `count` for sales

**Response Type:** Plain text string
```
Invest 이력 저장 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters, validation failure, or missing asset information

---
