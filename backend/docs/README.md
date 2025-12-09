# API Global Configuration

## Routes Summary

| Route           | Base Path      |
| --------------- | -------------- |
| User Management | `/api/users`   |
| Google OAuth    | `/api/auth`    |
| Reviews         | `/api/reviews` |
| Ads             | `/api/ads`     |
| Credits         | `/api/credits` |
| Admin           | `/api/admin`   |

---

## Global Security

### Rate Limiting

- **Global:** 60 requests/minute per IP
- **Response (429):** `"لقد وصلت الحد الأقصى للطلبات. حاول مرة أخرى بعد {seconds} ثانية."`
- **Route-specific limits:** Documented in each API section

### CORS

- **Allowed:** `FRONTEND_URL`, `ADMIN_URL`
- **Credentials:** Enabled
- **Methods:** GET, POST, PUT, DELETE

### XSS Sanitization

- Auto-applied to all requests
- `req.body` → `req.secureBody`
- `req.query` → `req.secureQuery`

### Security Headers (Helmet)

- X-Content-Type-Options: nosniff
- Strict-Transport-Security enabled
- X-Powered-By removed

### Authentication

**JWT Cookie:** `jwt-auth`

- HttpOnly, Secure (production)
- 7 days expiry
- SameSite: none (prod) / lax (dev)

---

## Global Error Handler

### Response Format

```json
{
  "message": "Error description"
}
```

### Error Types

| Type                | Status | Example                 |
| ------------------- | ------ | ----------------------- |
| JWT Invalid/Expired | 401    | Invalid token           |
| Validation          | 400    | Field validation failed |
| Duplicate Key       | 409    | Email already exists    |
| Not Found           | 404    | Resource not found      |
| Unauthorized        | 401    | Authentication required |
| Forbidden           | 403    | Admin access required   |
| Rate Limit          | 429    | Too many requests       |
| Server Error        | 500    | Something went wrong    |

---

## Database

- **Provider:** Supabase (PostgreSQL)
- **ORM:** Sequelize
- **Dev Mode:** Auto-sync with `{ alter: true }`
- **Production:** Manual migrations

---

## File Uploads

| Type      | Max Size  | Max Files |
| --------- | --------- | --------- |
| Avatar    | 5 MB      | 1         |
| Ad Images | 5 MB each | 5         |

---

## Environment Variables

**Required variables (must match these exact names):**

```env
# Server Configuration
PORT=5000
PRODUCTION=false

# Database
SQL_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (AWS SES)
EMAIL_SOURCE=your-verified-email@domain.com
AWS_KEY=your_aws_access_key
AWS_SECRET=your_aws_secret_key
AWS_REGION=us-east-1

# Storage (S3)
S3_BUCKET=your-bucket-name

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-secret

# Application URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
API_URL=http://localhost:5000

# Payment Gateway (Paymob)
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_BASE_URL=https://accept.paymobsolutions.com/api
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
```

**⚠️ Important Notes:**

- Variable names must match exactly (case-sensitive)
- Set `PRODUCTION=true` for production environment
- Update URLs for production deployment
- Keep secrets secure and never commit to version control

---

## Best Practices

### Frontend

- Always include credentials in requests
- Handle rate limits gracefully
- Parse Arabic error messages
- Redirect on 401 (expired token)

### Backend

- Use `req.secureBody` / `req.secureQuery` (pre-sanitized)
- Wrap async handlers with `asyncHandler`
- Use transactions for multi-step operations
- Create audit logs for critical operations
