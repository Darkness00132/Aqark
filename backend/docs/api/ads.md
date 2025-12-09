# Ads API Documentation

## Base URL

```
/api/ads
```

## Security

JWT authentication required for protected endpoints. XSS sanitization applied to all inputs.

---

## Endpoints

### `GET /all`

Get all public ads with filtering and pagination.

**Query Params:**

```
page: 1 (default)
limit: 8 (default)
order: "DESC" | "ASC" | "lowPrice" | "highPrice"
// Additional filters from adsFilters utility
```

**Response:**

```json
{
  "totalPages": 10,
  "ads": [
    {
      "id": 1,
      "title": "iPhone 14 Pro",
      "description": "Like new condition",
      "price": 5000,
      "type": "sell",
      "images": [{ "url": "https://...", "key": "ads/..." }],
      "slug": "iphone-14-pro",
      "costInCredits": 50,
      "user": {
        "id": 1,
        "name": "John Doe",
        "avatar": "https://..."
      },
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ]
}
```

**Ordering:**

- `DESC` - Newest first (default)
- `ASC` - Oldest first
- `lowPrice` - Price low to high
- `highPrice` - Price high to low

**Note:** Excludes deleted ads (`isDeleted: false`)

---

### `GET /me` 🔒

Get authenticated user's ads with filtering and pagination.

**Query Params:** Same as `/all`

**Response:** Same structure as `/all`

**Note:** Includes all user ads (even deleted ones if not filtered)

---

### `GET /sitemap`

Get ads for sitemap generation (SEO).

**Query Params:**

```
part: 1 (default)
```

**Response:**

```json
{
  "ads": [
    {
      "slug": "iphone-14-pro",
      "updatedAt": "2024-12-01T00:00:00.000Z"
    }
  ],
  "total": 150000
}
```

**Note:** Returns 50,000 ads per page

---

### `GET /me/:id` 🔒

Get specific ad owned by authenticated user.

**Params:** `id` - Ad ID

**Response:**

```json
{
  "ad": {
    "id": 1,
    "title": "iPhone 14 Pro",
    "description": "Like new condition",
    "price": 5000,
    "type": "sell",
    "images": [{ "url": "https://...", "key": "ads/..." }],
    "costInCredits": 50,
    "isDeleted": false
  }
}
```

---

### `GET /:slug`

Get public ad by slug.

**Params:** `slug` - Ad slug

**Response:**

```json
{
  "ad": {
    "id": 1,
    "title": "iPhone 14 Pro",
    "description": "Like new condition",
    "price": 5000,
    "type": "sell",
    "images": [{ "url": "https://...", "key": "ads/..." }],
    "slug": "iphone-14-pro",
    "user": {
      "id": 1,
      "name": "John Doe",
      "avatar": "https://...",
      "avgRating": 4.5
    }
  }
}
```

---

### `POST /create` 🔒

Create new ad with images (costs credits).

**Content-Type:** `multipart/form-data`

**Body (FormData):**

```
title: "iPhone 14 Pro"
description: "Like new condition"
price: 5000
type: "sell" | "rent" | "exchange"
images: File[] (max 5 images)
// Additional ad fields
```

**Response:**

```json
{
  "message": "تم انشاء اعلان بنجاح"
}
```

**Flow:**

1. Validates ad data
2. Calculates credit cost based on `type` and `price`
3. Checks user has sufficient credits
4. Uploads images to S3
5. Creates ad in transaction:
   - Deducts credits from user
   - Creates ad record
   - Creates ad log entry
   - Creates credit log entry

**Credit Cost Calculation:**

- Based on ad type and price
- Calculated via `adCostInCredits()` utility

**Errors:**

- Insufficient credits → `400`
- Validation error → `400`

**Note:** If transaction fails, uploaded images are deleted from S3

---

### `PUT /:id` 🔒

Update ad with optional image changes.

**Params:** `id` - Ad ID

**Content-Type:** `multipart/form-data`

**Body (FormData):**

```
title: "iPhone 14 Pro Max" (optional)
price: 5500 (optional)
deletedImages: [{"key": "ads/..."}] (optional, JSON string)
images: File[] (optional, new images)
// Other updateable fields
```

**Response:**

```json
{
  "message": "تم تحديث الإعلان بنجاح"
}
```

**Image Update Logic:**

1. Deletes images specified in `deletedImages`
2. Uploads new images if provided
3. Validates total images (existing - deleted + new ≤ 5)
4. Updates ad with new image array

**Validation:**

- Must own the ad
- Cannot exceed 5 total images
- `deletedImages` must be valid JSON array

**Note:** Creates ad log entry for update action

---

### `DELETE /:id` 🔒

Soft delete ad and remove images.

**Params:** `id` - Ad ID

**Response:**

```json
{
  "message": "تم حذف الإعلان بنجاح"
}
```

**Flow:**

1. Validates ownership
2. Deletes all images from S3
3. Soft deletes ad:
   - Sets `isDeleted: true`
   - Clears `images` array
4. Creates ad log entry

**Note:** Soft delete preserves ad data for audit purposes

---

## Ad Types

- `sell` - Selling item
- `rent` - Renting item
- `exchange` - Exchange/trade

---

## Image Management

- **Max images per ad:** 5
- **Upload:** Automatic S3 upload on create/update
- **Delete:** Automatic S3 cleanup on delete/update
- **Format:** `{ url: string, key: string }[]`

---

## Credit System

- Ads cost credits to create (no refund on delete)
- Cost calculated by `adCostInCredits(type, price)`
- Credits deducted atomically in transaction
- Credit log created for audit trail

---

## Logging

All ad actions logged in `AdLogs`:

- `create` - Ad creation
- `update` - Ad modification
- `delete` - Ad deletion

Format: `"[Action] ad with title: [Title]"`

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
- `400` - Validation error / Insufficient credits
- `401` - Unauthorized
- `404` - Not found
