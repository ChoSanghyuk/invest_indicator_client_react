## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized (non-admin trying non-GET methods)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses are typically in plain text format describing the error.
