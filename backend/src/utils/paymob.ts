import crypto from "crypto";
import { AuthRequest } from "../middlewares/auth.js";
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

export function verifyPaymobHMAC(data: any): boolean {
  const receivedHmac = data.hmac;

  if (!receivedHmac) {
    return false;
  }

  const obj = data.obj;

  const concatenatedString = [
    obj.amount_cents || "",
    obj.created_at || "",
    obj.currency || "",
    obj.error_occured || "",
    obj.has_parent_transaction || "",
    obj.id || "",
    obj.integration_id || "",
    obj.is_3d_secure || "",
    obj.is_auth || "",
    obj.is_capture || "",
    obj.is_refunded || "",
    obj.is_standalone_payment || "",
    obj.is_voided || "",
    obj.order?.id || "",
    obj.owner || "",
    obj.pending || "",
    obj.source_data?.pan || "",
    obj.source_data?.sub_type || "",
    obj.source_data?.type || "",
    obj.success || "",
  ].join("");

  const calculatedHmac = crypto
    .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
    .update(concatenatedString)
    .digest("hex");

  // Use timing-safe comparison with equal-length buffers
  try {
    if (calculatedHmac.length !== receivedHmac.length) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHmac),
      Buffer.from(receivedHmac)
    );
  } catch (error) {
    console.error("HMAC comparison error:", error);
    return false;
  }
}
