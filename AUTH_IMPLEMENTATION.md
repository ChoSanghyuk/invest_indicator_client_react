# Authentication Implementation Guide

## Overview
Authentication has been implemented using JWT tokens. When `USE_MOCK` is `true`, the login page is bypassed and all routes are accessible without authentication.

## How It Works

### Mock Mode (Default)
- `USE_MOCK: true` in `api.config.js`
- Login page is **not required** - users go directly to the app
- All routes are accessible without authentication
- No API token is sent in requests

### Real API Mode
- `USE_MOCK: false` in `api.config.js`
- Users must log in at `/login` to access the app
- JWT token is stored in localStorage after successful login
- Token is automatically included in all API requests
- Token expiry is checked on each route access

## Files Created

### 1. `src/services/auth.service.js`
- `login(credentials)` - Authenticates user and returns JWT token
- `storeToken(token, expiry)` - Stores token in localStorage
- `getToken()` - Retrieves token (returns null if expired)
- `clearToken()` - Removes token from localStorage
- `isAuthenticated()` - Checks if user is authenticated

### 2. `src/context/AuthContext.jsx`
- React context for managing authentication state
- Provides `isAuth`, `login`, `logout`, `loading`, and `isMockMode`
- Use with `useAuth()` hook

### 3. `src/components/ProtectedRoute.jsx`
- Wrapper component for protected routes
- In mock mode: allows all access
- In real mode: redirects to `/login` if not authenticated

### 4. `src/pages/LoginPage.jsx`
- Login form with username, email, and password fields
- Only shown when `USE_MOCK: false`

### 5. `src/config/api.config.js` (updated)
- Added `getAuthHeaders()` function
- Returns headers with Bearer token for API requests
- Only includes token when not in mock mode

## Updating Service Files

All service files that make API calls should use `getAuthHeaders()` for authentication.

### Example Update

**Before:**
```javascript
import API_CONFIG from '../config/api.config';

const response = await fetch(`${API_CONFIG.BASE_URL}/endpoint`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**After:**
```javascript
import API_CONFIG, { getAuthHeaders } from '../config/api.config';

const response = await fetch(`${API_CONFIG.BASE_URL}/endpoint`, {
  method: 'GET',
  headers: getAuthHeaders(),
});
```

## Files Already Updated
- ✅ `src/services/fund.service.js` (all endpoints)

## Files That Need Update
The following service files should be updated to use `getAuthHeaders()`:
- `src/services/asset.service.js`
- `src/services/market.service.js`
- `src/services/invest.service.js`
- `src/services/event.service.js`

## Configuration

To switch between mock and real API:

**Option 1: Environment Variable**
Create `.env` file:
```
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://your-api-server.com
```

**Option 2: Direct Config**
Edit `src/config/api.config.js`:
```javascript
const API_CONFIG = {
  USE_MOCK: false,  // Change to false for real API
  BASE_URL: 'http://your-api-server.com',
};
```

## Usage in Components

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isAuth, logout, isMockMode } = useAuth();

  return (
    <div>
      {!isMockMode && (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}
```

## Testing

### Mock Mode Testing
- App should work without login
- All pages should be accessible
- No authentication errors

### Real API Mode Testing
1. Set `USE_MOCK: false`
2. Start app - should redirect to `/login`
3. Login with credentials
4. Should redirect to home page
5. All API calls should include Bearer token
6. Token expiry should force re-login
