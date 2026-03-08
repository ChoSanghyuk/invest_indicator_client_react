## Model Endpoints

### Get Categories
**Endpoint:** `GET /categories`

**Description:** Retrieve all available asset categories

**Request:** None

**Response Type:** Array of strings (Korean category names)
```
[]string
```

**Response Example:**
```json
[
  "현금",
  "달러",
  "금",
  "단기채권",
  "국내ETF",
  "국내주식",
  "국내코인",
  "해외주식",
  "해외ETF",
  "레버리지",
  "해외코인",
  "국내안전자산ETF"
]
```

**Notes:**
- These are the valid values for the `category` field when creating/updating assets
- Stable categories: 현금, 달러, 금, 단기채권, 국내안전자산ETF

**Status Codes:**
- `200 OK` - Success

---

### Get Currencies
**Endpoint:** `GET /currencies`

**Description:** Retrieve all available currencies

**Request:** None

**Response Type:** Array of strings
```
[]string
```

**Response Example:**
```json
[
  "WON",
  "USD"
]
```

**Notes:**
- These are the valid values for the `currency` field when creating/updating assets

**Status Codes:**
- `200 OK` - Success

---
