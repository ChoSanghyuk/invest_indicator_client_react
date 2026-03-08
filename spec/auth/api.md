## Authentication

All endpoints (except `/login`) require authentication via JWT token.

### Login
**Endpoint:** `POST /login/`

**Description:** Authenticate user and receive JWT token

**Request Type:** `LoginRequest`
```go
type LoginRequest struct {
    Username string `json:"username"`
    Email    string `json:"email"`
    Password string `json:"password"`
}
```

**Request Body Example:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response Type:** `JWTResponse`
```go
type JWTResponse struct {
    Token  string `json:"token"`
    Expiry int64  `json:"expiry"`  // Unix timestamp
}
```

**Response Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiry": 1709856000
}
```

**Status Codes:**
- `200 OK` - Successfully authenticated
- `401 Unauthorized` - Invalid credentials

---

