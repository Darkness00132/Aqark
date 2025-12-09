# Review API Documentation

## Base URL

```
/api/review
```

## Security

JWT authentication required for protected endpoints. XSS sanitization applied to all inputs.

---

## Endpoints

### `GET /:slug`

Get all reviews for a specific user.

**Params:** `slug` - User slug

**Response:**

```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great seller!",
      "createdAt": "2024-12-01T00:00:00.000Z",
      "reviewer": {
        "id": 2,
        "name": "John Doe",
        "avatar": "https://...",
        "slug": "john-doe"
      }
    }
  ]
}
```

---

### `GET /me` 🔒

Get all reviews written by authenticated user.

**Response:**

```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great seller!",
      "createdAt": "2024-12-01T00:00:00.000Z",
      "reviewedUser": {
        "id": 3,
        "name": "Jane Smith",
        "avatar": "https://...",
        "slug": "jane-smith"
      }
    }
  ]
}
```

---

### `POST /:slug` 🔒

Create a review for a user.

**Params:** `slug` - User slug to review

**Body:**

```json
{
  "rating": 5,
  "comment": "Excellent service!"
}
```

**Response:**

```json
{
  "review": {
    "id": 1,
    "reviewerId": 2,
    "reviewedUserId": 3,
    "rating": 5,
    "comment": "Excellent service!"
  }
}
```

**Validation:**

- Cannot review yourself
- Cannot review same user twice

**Errors:**

- User not found → `404`
- Reviewing yourself → `400`
- Already reviewed → `400`

---

### `PUT /:reviewId` 🔒

Update your own review.

**Params:** `reviewId` - Review ID

**Body:**

```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response:**

```json
{
  "review": {
    "id": 1,
    "rating": 4,
    "comment": "Updated comment"
  }
}
```

**Note:** Only rating or comment can be updated (both optional)

---

### `DELETE /:reviewId` 🔒

Delete your review.

**Params:** `reviewId` - Review ID

**Response:**

```json
{
  "message": "تم حذف المراجعة بنجاح"
}
```

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
- `400` - Validation error
- `401` - Unauthorized
- `404` - Not found
