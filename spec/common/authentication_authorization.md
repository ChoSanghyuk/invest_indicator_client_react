## Authentication & Authorization

- All endpoints(except '/login') require a Bearer token in the Authorization header: `Authorization: Bearer <token>`
- A pass key can also be used for bot/HTTP testing: `Authorization: <passkey>`
- Non-admin users can only perform GET requests
- Admin users can perform all HTTP methods

