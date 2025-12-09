# Google OAuth & API Overview

## Google OAuth (`/api/auth`)

### Endpoints

- **`GET /auth/google`** - Initiates OAuth flow
  - Params: `mode` (login/signup), `role` (user/admin)
- **`GET /auth/google/callback`** - Handles Google redirect

### Flow

1. User redirected to Google consent screen
2. Google redirects back with auth code
3. **Login:** Links Google ID if needed → Sets JWT cookie
4. **Signup:** Creates user + 100 credits bonus → Sets JWT cookie

### Features

- Automatic account linking (prevents duplicates)
- No email verification needed (Google-verified)
- IP tracking for security
- State parameter for CSRF protection

---

## API Overview

### Routes

| Route           | Base Path      |
| --------------- | -------------- |
| User Management | `/api/users`   |
| Google OAuth    | `/api/auth`    |
| Reviews         | `/api/reviews` |
| Ads             | `/api/ads`     |
| Credits         | `/api/credits` |
| Admin           | `/api/admin`   |

### Global Security

- **Rate Limit:** 60 requests/minute per IP
- **CORS:** Only frontend/admin URLs allowed
- **XSS Sanitization:** All inputs auto-sanitized
- **Helmet Headers:** Security headers on all responses
- **JWT Cookie:** HttpOnly, 7-day expiry

### Error Responses

```json
{
  "message": "Error description"
}
```

**Common Status Codes:**

- `200/201` - Success
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Duplicate
- `429` - Rate limit
- `500` - Server error
