# User Authentication API

**Base URL:** `/api/user`

**Global Rate Limit:** 60 requests/minute per IP

---

## Endpoints

### 1. Sign Up

`POST /api/user/signup` • Rate: 5/15min

**Body:**

```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "SecurePass123!",
  "role": "user" // "user" | "landlord"
}
```

**Response (201):**

```json
{
  "message": "تم انشاء حساب بنجاح يرجى تحقق من ايميلك"
}
```

Creates account → Sends verification email (10 min expiry)

---

### 2. Verify Email

`GET /api/user/verifyEmail?verificationToken={token}` • Rate: 10/5min

**Response:** Redirects to frontend with auth cookie set

Verifies email → Awards 100 credits → Logs user in → Sends welcome email

---

### 3. Resend Verification

`POST /api/user/resendVerification` • Rate: 3/15min

**Body:**

```json
{
  "email": "ahmed@example.com"
}
```

**Response (200):**

```json
{
  "message": "تم إرسال بريد التحقق بنجاح. يرجى التحقق من صندوق الوارد."
}
```

---

### 4. Login

`POST /api/user/login` • Rate: 5/5min • Blocked if logged in

**Body:**

```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "message": "تم تسجيل الدخول بنجاح"
}
```

**Errors:** `400` (wrong password) • `403` (not verified) • `404` (not found)

---

### 5. Get My Profile

`GET /api/user/profile/me` • Auth required

**Response (200):**

```json
{
  "user": {
    "slug": "ahmed-mohamed-abc123",
    "name": "أحمد محمد",
    "avatar": "https://...",
    "role": "user",
    "avgRating": 4.5,
    "totalReviews": 10,
    "credits": 100
  }
}
```

---

### 6. Get Public Profile

`GET /api/user/profile/:slug`

**Response (200):**

```json
{
  "user": {
    "slug": "ahmed-mohamed-abc123",
    "name": "أحمد محمد",
    "avatar": "https://...",
    "role": "landlord",
    "avgRating": 4.7,
    "totalReviews": 23
  }
}
```

Returns public data only (no email, tokens, ips)

---

### 7. Forgot Password

`POST /api/user/forgetPassword` • Rate: 3/15min

**Body:**

```json
{
  "email": "ahmed@example.com"
}
```

**Response (200):**

```json
{
  "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
}
```

Generates reset token (10 min expiry) → Sends email

---

### 8. Reset Password

`POST /api/user/resetPassword` • Rate: 10/5min

**Body:**

```json
{
  "resetPasswordToken": "abc123...",
  "password": "NewSecurePass456!"
}
```

**Response (200):**

```json
{
  "message": "تم تغيير كلمة مرور بنجاح"
}
```

---

### 9. Resend Reset Password

`POST /api/user/resendResetPassword` • Rate: 3/15min

**Body:**

```json
{
  "email": "ahmed@example.com"
}
```

**Response (200):**

```json
{
  "message": "تم إرسال بريد إعادة تعيين كلمة المرور بنجاح. يرجى التحقق من صندوق الوارد."
}
```

---

### 10. Update Profile

`PUT /api/user/profile` • Auth required

**Body (name):**

```json
{
  "name": "أحمد علي"
}
```

**Body (password):**

```json
{
  "password": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200):**

```json
{
  "message": "تم تحديث ملفك الشخصى بنجاح"
}
```

---

### 11. Logout

`DELETE /api/user/logout` • Auth required

**Response (200):**

```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

Removes current session → Clears cookie

---

## Authentication

**Cookie:** `jwt-auth`

- HTTPOnly: Yes
- Expiry: 7 days
- Secure: Production only

---

## User Model

```typescript
{
  id: string
  slug: string                  // auto-generated
  name: string                  // 3-50 chars
  email: string                 // unique
  password: string              // Argon2 hashed
  isVerified: boolean
  role: "user" | "landlord" | "admin" | ...
  avatar?: string
  avgRating: number
  totalReviews: number
  credits: number               // 100 on signup
  ips: [{ip, userAgent, lastLogin}]  // max 10
  tokens: [{token, createdAt}]       // max 10
  verificationToken?: string    // 10 min expiry
  resetPasswordToken?: string   // 10 min expiry
  createdAt, updatedAt: Date
}
```

---

## Credits System

**Signup Bonus:** 100 credits awarded on email verification

**Credits Log:**

```typescript
{
  userId: string;
  type: "gift" | "purchase" | "spent";
  description: string;
  credits: number;
  createdAt: Date;
}
```

---

## Error Responses

```json
{
  "message": "وصف الخطأ بالعربية"
}
```

**Codes:** `400` (validation) • `401` (unauthorized) • `403` (forbidden) • `404` (not found) • `429` (rate limit)

---

## Flows

**Signup:**

```
User signs up → Verification email (10 min) → User verifies
→ Awards 100 credits → Logs user in → Welcome email
```

**Password Reset:**

```
User requests reset → Email sent (10 min) → User submits new password
→ Password updated → Confirmation email
```

**Public Profile:**

```
Request /profile/:slug → Calculates ratings from reviews
→ Updates user record → Returns public data
```

---

## Environment Variables

```env
JWT_SECRET=your-secret-key
FRONTEND_URL=https://yourfrontend.com
PRODUCTION=true
DATABASE_URL=postgresql://...
```
