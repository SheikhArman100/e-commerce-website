"use client";

import CheckoutResult from "../CheckoutResult.js";

/**
 * Where SSLCommerz sends a paid order (`FRONTEND_URL/checkout/success?tran_id=…`
 * after `POST /payment/success`). By then the API has created the order items
 * from the cart snapshot, decremented stock and cleared the cart, so the page
 * only has to say so — and drop the now-stale cart cache while it is here.
 */
const Success = () => (
  <CheckoutResult
    tone="success"
    refreshCart
    title="Payment Successful"
    message="Thank you — your order has been placed and is being prepared with artisanal care."
    notes={[
      "The archive shows this order as payment pending until the gateway confirms the transaction, which usually takes a moment.",
      "Every status change is emailed to you as it happens.",
      "Your selection has been cleared and is ready for the next indulgence.",
    ]}
    actions={[
      { href: "/order", label: "View Your Orders", primary: true },
      { href: "/products", label: "Continue Shopping" },
    ]}
  />
);

export default Success;
