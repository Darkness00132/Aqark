# Google OAuth API

**Base URL:** `/auth/google`

---

## Endpoints

### 1. Initiate Google OAuth

`GET /auth/google`

**Query Parameters:**

- `mode` (optional): `"login"` (default) or `"signup"`
- `role` (optional): `"user"` (default) or `"landlord"`

**Examples:**

```
/auth/google?mode=signup&role=landlord
/auth/google?mode=login
```

**Response:** Redirects to Google OAuth consent screen

---

### 2. Google Callback

`GET /auth/google/callback`

**Internal Endpoint** - Handled by Google OAuth flow

**Success:** Redirects to `FRONTEND_URL` with JWT cookie set

**Error:** Redirects to `FRONTEND_URL/user/login?status=failed&message={error}`

---

## Authentication Flow

### Signup Flow

```
1. User clicks "Sign up with Google"
   → Frontend: /auth/google?mode=signup&role=landlord

2. Google OAuth consent screen appears

3. User approves → Google redirects to /auth/google/callback

4. Backend:
   - Checks if user exists (by Google ID or email)
   - If exists: Links Google ID if not linked → Login
   - If not exists:
     • Creates new account (verified by default)
     • Awards 100 credits
     • Creates credits log entry
     • Sends welcome email

5. Sets JWT cookie → Redirects to frontend

6. User is logged in
```

### Login Flow

```
1. User clicks "Login with Google"
   → Frontend: /auth/google?mode=login

2. Google OAuth consent screen appears

3. User approves → Google redirects to /auth/google/callback

4. Backend:
   - Checks if user exists (by Google ID or email)
   - If exists: Links Google ID if not linked → Login
   - If NOT exists: Redirects with error
     "هذا الحساب غير مسجل. يرجى إنشاء حساب جديد أولاً."

5. If successful:
   - Updates IP tracking
   - Sets JWT cookie
   - Redirects to frontend

6. User is logged in
```

---

## How It Works

### Account Matching

1. **First:** Search by `googleId`
2. **If not found:** Search by `email`
3. **If found:** Link Google ID to existing account
4. **If not found:**
   - `mode=login` → Error (must signup first)
   - `mode=signup` → Create new account

### Account Creation (Signup Mode)

```typescript
{
  googleId: "google-user-id",
  name: "من Google",
  email: "user@gmail.com",
  avatar: "https://google-photo-url",
  role: "user" | "landlord",
  isVerified: true,          // Auto-verified
  credits: 100,              // Signup bonus
  ips: [{ip, userAgent, lastLogin}]
}
```

### Credits Award

- **Amount:** 100 credits
- **Type:** `gift`
- **Description:** "Signup verification bonus"
- **Transaction:** Atomic (user + credits log created together)

---

## Response Handling

### Success

- Sets `jwt-auth` cookie (HTTPOnly, 7 days)
- Redirects to `FRONTEND_URL`

### Error Scenarios

| Error                               | Redirect URL                                                            |
| ----------------------------------- | ----------------------------------------------------------------------- |
| Email not found in Google profile   | `/user/login?status=failed&message=لم يتم العثور على البريد الإلكتروني` |
| Invalid state data                  | `/user/login?status=failed&message=بيانات الحالة غير صالحة`             |
| Account not registered (login mode) | `/user/login?status=failed&message=هذا الحساب غير مسجل...`              |
| Authentication failed               | `/user/login?status=failed&message=فشل تسجيل الدخول`                    |

---

## Frontend Integration

### Signup Button

```html
<a href="/auth/google?mode=signup&role=landlord"> Sign up with Google </a>
```

### Login Button

```html
<a href="/auth/google?mode=login"> Login with Google </a>
```

### Handle Redirect

```javascript
// Check URL params after redirect
const params = new URLSearchParams(window.location.search);
const status = params.get("status");
const message = params.get("message");

if (status === "failed") {
  alert(decodeURIComponent(message));
}
```

---

## Security Features

- ✅ Transaction for account creation + credits
- ✅ Auto-verification (Google accounts are trusted)
- ✅ IP tracking (max 10 entries)
- ✅ JWT with HTTPOnly cookies
- ✅ Links Google ID to existing accounts
- ✅ Prevents duplicate accounts
- ✅ Non-blocking welcome email

---

## Environment Variables

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
API_URL=https://api.yourapp.com
FRONTEND_URL=https://yourapp.com
PRODUCTION=true
JWT_SECRET=your-jwt-secret
```

---

## Notes

- Google accounts are **automatically verified**
- Credits awarded **only on first signup** (not on subsequent logins)
- If user signs up with email first, they can link Google later
- Welcome email sent asynchronously (non-blocking)
- IP tracking updates on every login
- Supports both user and landlord roles
