import crypto from "crypto";

const API_VERSION = "2025-01-01";

function baseUrl() {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function headers(extra = {}) {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    throw new Error("Cashfree credentials are not configured");
  }
  return {
    accept: "application/json",
    "content-type": "application/json",
    "x-api-version": API_VERSION,
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    ...extra,
  };
}

export async function createOrder({ orderId, amount, customer, returnUrl, notifyUrl, note, metadata }) {
  const response = await fetch(`${baseUrl()}/orders`, {
    method: "POST",
    headers: headers({ "x-idempotency-key": crypto.randomUUID() }),
    body: JSON.stringify({
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(customer.id),
        customer_name: customer.name || "Flint user",
        customer_email: customer.email,
        customer_phone: customer.phone || "9999999999",
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
      },
      order_note: note,
      order_tags: metadata,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || data?.type || "Cashfree order creation failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function getOrder(orderId) {
  const response = await fetch(`${baseUrl()}/orders/${encodeURIComponent(orderId)}`, {
    headers: headers(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || "Cashfree order lookup failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function verifyWebhookSignature(rawBody, timestamp, signature) {
  if (!rawBody || !timestamp || !signature || !process.env.CASHFREE_SECRET_KEY) return false;
  const signedPayload = `${timestamp}${rawBody}`;
  const expected = crypto
    .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
    .update(signedPayload)
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
