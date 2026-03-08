## Event Endpoints

### Get All Events
**Endpoint:** `GET /events/`

**Description:** Retrieve all available events with their status

**Request:** None

**Response Type:** Array of `EventResponse`
```go
type EventResponse struct {
    Id          uint   `json:"id"`
    Title       string `json:"title"`
    Description string `json:"description"`
    Active      bool   `json:"active"`
}
```

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Daily Market Update",
    "description": "Updates market indicators daily",
    "active": true
  },
  {
    "id": 2,
    "title": "Portfolio Rebalancing",
    "description": "Rebalances portfolio based on market conditions",
    "active": false
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### Switch Event Status
**Endpoint:** `POST /events/switch`

**Description:** Enable or disable an event

**Request Type:** `EventStatusChangeRequest`
```go
type EventStatusChangeRequest struct {
    Id     uint `json:"id"`
    Active bool `json:"active"`
}
```

**Request Body Example:**
```json
{
  "id": 1,
  "active": true
}
```

**Response Type:** Plain text string
```
Event 실행 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters or validation failure

---

### Launch Event
**Endpoint:** `POST /events/launch`

**Description:** Manually trigger/launch an event execution

**Request Type:** `EventLaunchRequest`
```go
type EventLaunchRequest struct {
    Id uint `json:"id"`
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
event 실행 성공
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters or validation failure

---
