# Credits API Documentation

## Base URL

```
/api/credits
```

## Security

All endpoints (except webhook) use JWT authentication. Admin endpoints require admin role. XSS sanitization applied to all inputs.

---

## Endpoints

### `GET /plans`

Get all credit plans with active discounts.

**Response:**

```json
{
  "plans": [
    {
      "id": 1,
      "name": "Basic Plan",
      "credits": 100,
      "bonus": 10,
      "price": 50,
      "discounts": [
        {
          "id": 1,
          "planId": 1,
          "percentage": 20,
          "startsAt": "2024-12-01T00:00:00.000Z",
          "endsAt": "2024-12-31T23:59:59.000Z"
        }
      ]
    }
  ]
}
```

**Note:** Only returns currently active discounts (between `startsAt` and `endsAt`).

---

### `POST /createPlan` 🔒 Admin

Create a new credit plan.

**Body:**

```json
{
  "name": "Premium Plan",
  "credits": 500,
  "bonus": 50,
  "price": 200
}
```

---

### `POST /updateCreditsPlan` 🔒 Admin

Update plan bonus credits.

**Body:**

```json
{
  "id": 1,
  "bonus": 20
}
```

---

### `POST /createPlanDiscount` 🔒 Admin

Create time-bound discount. Prevents overlapping discounts.

**Body:**

```json
{
  "planId": 1,
  "percentage": 20,
  "startsAt": "2024-12-01T00:00:00.000Z",
  "endsAt": "2024-12-31T23:59:59.000Z"
}
```

---

### `DELETE /deletePlan/:id` 🔒 Admin

Delete a credit plan.

**Params:** `id` - Plan ID

---

### `POST /createPayment` 🔒

Initiate payment for credits purchase.

**Body:**

```json
{
  "planId": 1
}
```

**Response:**

```json
{
  "paymentUrl": "https://accept.paymob.com/api/acceptance/iframes/{IFRAME_ID}?payment_token={TOKEN}"
}
```

**Flow:**

1. Validates plan and checks active discounts
2. Calculates final price with discount
3. Creates Paymob order and payment token
4. Creates transaction record (status: "pending")
5. Returns payment URL

**Transaction Details:**

- Gateway fee: `3 + finalPrice * 2.75%`
- Total credits: `plan.credits + bonus`

---

### `POST /webhook/processed`

Paymob webhook for payment status updates.

**Body:**

```json
{
  "obj": {
    "id": 12345678,
    "order": { "id": 87654321 },
    "success": true,
    "source_data": {
      "pan": "1234",
      "type": "card",
      "sub_type": "MasterCard"
    }
  }
}
```

**On Success:**

- Updates transaction status to "completed"
- Adds credits to user account
- Creates credit log entry

**On Failure:**

- Updates transaction status to "failed"
- Records failure reason

**Idempotent:** Safely handles duplicate webhooks

---

## Payment Flow

1. User calls `POST /createPayment` → receives payment URL
2. User completes payment on Paymob
3. Paymob calls webhook → credits added to account

---

## Common Responses

**Success:**

```json
{ "message": "Operation completed successfully" }
```

**Error:**

```json
{ "message": "Error description" }
```

**Status Codes:**

- `200/201` - Success
- `400` - Validation error
- `401` - Unauthorized
- `403` - Admin only
- `404` - Not found
