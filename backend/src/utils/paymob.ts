const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL!;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID!;

export async function getAuthToken() {
  const res = await fetch(`${PAYMOB_BASE_URL}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });
  const data = await res.json();
  return data.token;
}

export async function createOrder(
  authToken: string,
  amount: number,
  planId: number
) {
  const res = await fetch(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amount * 100,
      currency: "EGP",
      items: [
        { name: `Plan ${planId}`, amount_cents: amount * 100, quantity: 1 },
      ],
    }),
  });
  const data = await res.json();
  return data.id;
}

export async function getpaymentToken(
  authToken: string,
  orderId: string,
  amount: number,
  billingData: any
) {
  const res = await fetch(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amount * 100,
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: PAYMOB_INTEGRATION_ID,
      iframe_id: 966548,
    }),
  });
  const data = await res.json();
  return data.token;
}
