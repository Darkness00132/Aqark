# API Documentation

## Overview

RESTful API built with Express.js, TypeScript, PostgreSQL (Supabase), and AWS S3 for file storage.

---

## Base URL

```
http://localhost:5000/api
```

**Production:** `https://your-domain.com/api`

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database (Supabase)
- AWS S3 account
- Google OAuth credentials

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Running the Application

**Development Mode (with auto-reload):**

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Watch TypeScript files
npm run watch
```

The server will start on `http://localhost:5000`

---

## Environment Variables

Create a `.env` file:

```env
# Server
PORT=5000
PRODUCTION=false

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_URL=http://localhost:5000

# AWS S3
AWS_KEY=your-aws-access-key
AWS_SECRET=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name

# Email Service (optional)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@yourapp.com
```

---

## API Routes

### Authentication & Users

- **`/api/users`** - User authentication (signup, login, profile)
- **`/api/auth/google`** - Google OAuth authentication

### Core Features

- **`/api/ads`** - Property advertisements (CRUD)
- **`/api/reviews`** - User reviews and ratings
- **`/api/credits`** - Credits management
- **`/api/upload`** - File uploads (avatars, images)

### Admin

- **`/api/admin`** - Admin panel operations

---

## Global Security Features

### Rate Limiting

- **Global Limit:** 60 requests per minute per IP
- **Per-Endpoint Limits:** Varies by route (see endpoint docs)

### Security Headers (Helmet)

- XSS Protection
- Content Security Policy
- DNS Prefetch Control
- HSTS (HTTP Strict Transport Security)
- No-Sniff
- Referrer Policy

### Input Sanitization

- **XSS Protection:** All request bodies and queries are sanitized
- Available via: `req.secureBody` and `req.secureQuery`

### CORS

- **Allowed Origins:** Frontend URL and Admin URL only
- **Credentials:** Enabled (for cookies)
- **Methods:** GET, POST, PUT, DELETE

### Authentication

- **Method:** JWT (JSON Web Tokens)
- **Storage:** HTTPOnly cookies
- **Expiry:** 7 days
- **Cookie Name:** `jwt-auth`

---

## Error Responses

All errors follow this structure:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request (validation errors)      |
| 401  | Unauthorized (invalid/expired token) |
| 403  | Forbidden (no permission)            |
| 404  | Not Found                            |
| 409  | Conflict (duplicate data)            |
| 429  | Too Many Requests (rate limit)       |
| 500  | Internal Server Error                |

### Common Errors

**JWT Errors:**

```json
{
  "message": "Invalid or malformed token"  // 401
}
{
  "message": "Token has expired"  // 401
}
```

**Validation Errors:**

```json
{
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "البريد الإلكتروني مطلوب"
    }
  ]
}
```

**Duplicate Data:**

```json
{
  "message": "Duplicate value for field 'email'"
}
```

**Rate Limit:**

```json
{
  "message": "لقد وصلت الحد الأقصى للطلبات. حاول مرة أخرى بعد 30 ثانية."
}
```

---

## Database

**Provider:** Supabase (PostgreSQL)

**Auto-sync:** Enabled in development mode

- Models automatically sync with database
- Uses `sequelize.sync({ alter: true })`

**Production:**

- Migrations should be used instead of auto-sync
- Set `PRODUCTION=true` in `.env`

---

## File Storage

**Provider:** AWS S3

**Upload Types:**

- **Avatars:** 300x300 WebP (max 5MB)
- **Ad Images:** 1280px width WebP (max 10MB)

**Processing:**

- Automatic image optimization with Sharp
- WebP conversion for smaller file sizes
- Concurrent uploads for better performance

---

## Development Tips

### Testing Endpoints

```bash
# Example: Test signup
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "password": "SecurePass123!"
  }'
```

### Viewing Logs

```bash
# Server logs appear in Terminal 1 (npm run dev)
# TypeScript compilation logs in Terminal 2 (npm run watch)
```

### Database Inspection

```bash
# Access Supabase dashboard
# Or use Sequelize CLI for migrations
npx sequelize-cli db:migrate
```

---

## Project Structure

```
src/
├── controller/      # Route handlers
├── middlewares/     # Auth, rate limiting, validation
├── models/          # Sequelize models
├── routes/          # API routes
├── emails/          # Email templates
├── utils/           # Helper functions
├── validates/       # Joi schemas
└── db/              # Database config
```

---

## Available Scripts

```json
{
  "dev": "Start development server with nodemon",
  "watch": "Watch TypeScript files and compile",
  "build": "Compile TypeScript to JavaScript",
  "start": "Run compiled production code",
  "migrate": "Run database migrations",
  "seed": "Seed database with sample data"
}
```

---

## Authentication Flow

1. User signs up or logs in
2. Server generates JWT token
3. Token stored in HTTPOnly cookie (`jwt-auth`)
4. Client includes cookie in subsequent requests (automatic)
5. Server validates token via `auth` middleware
6. Protected routes accessible with valid token

---

## Credits System

- **Currency:** Credits (numeric value)
- **Signup Bonus:** 100 credits on email verification
- **Purchase:** Via Paymob payment gateway
  - Supports multiple payment methods (cards, wallets, installments)
  - Secure payment processing through Paymob iframe
- **Usage:** Required for posting ads, premium features
- **Tracking:** All transactions logged in `credits_log` table

### Paymob Integration

**Payment Flow:**

1. User selects credits package
2. Backend creates payment token via Paymob API
3. Frontend displays Paymob iframe with payment token
4. User completes payment
5. Paymob sends callback to backend
6. Backend verifies payment and credits user account
7. User receives credits confirmation

**Configuration:**

- **API Key:** Authenticate with Paymob API
- **Integration ID:** Identifies your merchant account
- **Iframe ID:** Embeds payment form in frontend
- **Base URL:** Paymob API endpoint (production/sandbox)

---

## Support

For detailed endpoint documentation, see:

- [User Authentication API](./api/user.md)
- [Google OAuth API](./api/google.md)

---

## Notes

- All user-facing messages are in Arabic
- Database uses UTC timestamps
- File uploads are processed asynchronously
- Rate limits reset every minute
- Sessions limited to 10 active tokens per user
- IP tracking limited to 10 most recent entries
