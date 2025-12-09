# User API Documentation

## Base URL

```
/api/user
```

## Security

JWT authentication via `jwt-auth` cookie. XSS sanitization applied to all inputs. Rate limiting on sensitive endpoints.

---

## Endpoints

### `POST /signup`

Create new user account.

**Rate Limit:** 5 requests / 15 minutes

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**

```json
{
  "message": "تم انشاء حساب بنجاح يرجى تحقق من ايميلك"
}
```

**Flow:**

1. Creates user with `credits: 0`
2. Generates verification token (expires in 10 minutes)
3. Sends verification email asynchronously
4. Tracks user IP and user agent

---

### `GET /verifyEmail?verificationToken={token}`

Verify user email and activate account.

**Rate Limit:** 10 requests / 5 minutes

**Query Params:** `verificationToken`

**Response:** Redirects to frontend

**On Success:**

- Sets `isVerified: true`
- Awards **100 signup bonus credits**
- Creates credit log entry (type: "gift")
- Sends welcome email
- Sets auth cookie and redirects to frontend

**Errors:**

- Token expired → `404`
- Already verified → Redirects to `/?login=already`

---

### `POST /resendVerification`

Resend verification email.

**Rate Limit:** 3 requests / 15 minutes

**Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "تم إرسال بريد التحقق بنجاح. يرجى التحقق من صندوق الوارد."
}
```

**Errors:**

- Already verified → `400`
- Email not found → `404`

---

### `POST /login`

Authenticate user and create session.

**Rate Limit:** 5 requests / 5 minutes

**Blocked if:** Already logged in

**Body:**

```json
{
  "email": "john@example.com",
  "enteredPassword": "SecurePass123"
}
```

**Response:**

```json
{
  "message": "تم تسجيل الدخول بنجاح"
}
```

**Flow:**

1. Validates credentials
2. Checks email verification status
3. Updates/tracks IP and user agent
4. Sets `jwt-auth` cookie (7 days)

**Errors:**

- Not verified → `403`
- Wrong password → `400`
- Email not found → `404`

---

### `GET /profile/me` 🔒

Get authenticated user's profile.

**Response:**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "slug": "john-doe",
    "avatar": "https://...",
    "credits": 100,
    "role": "user",
    "avgRating": 4.5,
    "totalReviews": 10,
    "isVerified": true
  }
}
```

---

### `GET /profile/:slug`

Get any user's public profile with reviews.

**Params:** `slug` - User slug

**Response:**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "slug": "john-doe",
    "avatar": "https://...",
    "avgRating": 4.5,
    "totalReviews": 10
  },
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great service!",
      "reviewer": {
        "name": "Jane Smith",
        "avatar": "https://..."
      },
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

**Note:** Recalculates and updates user's rating on each request

---

### `POST /forgetPassword`

Request password reset.

**Rate Limit:** 3 requests / 15 minutes

**Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
}
```

**Flow:**

1. Generates reset token (expires in 10 minutes)
2. Sends reset password email

---

### `POST /resetPassword`

Reset password using token.

**Rate Limit:** 10 requests / 5 minutes

**Body:**

```json
{
  "resetPasswordToken": "abc123...",
  "password": "NewSecurePass123"
}
```

**Response:**

```json
{
  "message": "تم تغيير كلمة مرور بنجاح"
}
```

**Flow:**

1. Validates token and expiry
2. Updates password (hashed)
3. Clears reset token
4. Sends password changed email

---

### `POST /resendResetPassword`

Resend password reset email.

**Rate Limit:** 3 requests / 15 minutes

**Body:**

```json
{
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "تم إرسال بريد إعادة تعيين كلمة المرور بنجاح. يرجى التحقق من صندوق الوارد."
}
```

---

### `PUT /profile` 🔒

Update user profile (name, password, avatar).

**Content-Type:** `multipart/form-data`

**Body (FormData):**

```
name: "John Smith" (optional)
password: "CurrentPass123" (required if changing password)
newPassword: "NewPass123" (optional)
avatar: File (optional, image file)
```

**Response:**

```json
{
  "message": "تم تحديث ملفك الشخصى بنجاح",
  "user": {
    "id": 1,
    "name": "John Smith",
    "avatar": "https://...",
    "avatarKey": "avatars/..."
  }
}
```

**Validation:**

- To change password: must provide current password
- Avatar upload handled via cloud storage
- Old avatar deleted if new one uploaded

**Errors:**

- No data to update → `400`
- Wrong current password → `400`

---

### `DELETE /logout` 🔒

Logout user and invalidate session.

**Response:**

```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

**Flow:**

1. Removes current token from user's token list
2. Clears `jwt-auth` cookie

---

## Authentication Flow

### Registration → Verification

1. `POST /signup` → User created (unverified, 0 credits)
2. User receives email with verification link
3. `GET /verifyEmail?token=...` → Account verified + 100 credits awarded
4. User auto-logged in and redirected

### Login

1. `POST /login` → Validates credentials
2. Sets `jwt-auth` cookie (HttpOnly, 7 days)
3. Tracks IP/user agent for security

### Password Reset

1. `POST /forgetPassword` → Sends reset email
2. User clicks link in email
3. `POST /resetPassword` → Updates password

---

## Rate Limiting

| Endpoint               | Limit | Window |
| ---------------------- | ----- | ------ |
| `/signup`              | 5     | 15 min |
| `/login`               | 5     | 5 min  |
| `/verifyEmail`         | 10    | 5 min  |
| `/resendVerification`  | 3     | 15 min |
| `/forgetPassword`      | 3     | 15 min |
| `/resetPassword`       | 10    | 5 min  |
| `/resendResetPassword` | 3     | 15 min |

---

## Security Features

- **Password hashing** via bcrypt
- **JWT tokens** in HttpOnly cookies
- **Token rotation** on login
- **IP tracking** for suspicious activity
- **Email verification** required for login
- **Token expiry** (10 minutes for email tokens)
- **Rate limiting** on sensitive endpoints
- **XSS sanitization** on all inputs

---

## Cookie Settings

**Name:** `jwt-auth`

- **HttpOnly:** true
- **Secure:** true (production only)
- **SameSite:** none (production) / lax (development)
- **Max-Age:** 7 days
- **Priority:** high

---

## Common Responses

**Success:**

```json
{ "message": "عملية ناجحة" }
```

**Error:**

```json
{ "message": "رسالة الخطأ" }
```

**Status Codes:**

- `200/201` - Success
- `400` - Validation error / Bad request
- `401` - Unauthorized
- `403` - Forbidden / Not verified
- `404` - Not found
