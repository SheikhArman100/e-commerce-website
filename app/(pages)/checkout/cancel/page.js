"use client";

import CheckoutResult from "../CheckoutResult.js";

/**
 * Where SSLCommerz sends an abandoned payment. `POST /payment/cancel` rolls back
 * the shell order and the cart survives, so the customer can pick up exactly
 * where they left off.
 */
const Cancel = () => (
  <CheckoutResult
    tone="cancel"
    title="Payment Cancelled"
    message="You left the gateway before paying, so no order was placed and nothing was charged."
    notes={[
      "Your selection is still saved and waiting for you.",
      "An order only registers in your archive once its payment completes.",
    ]}
    actions={[
      { href: "/checkout", label: "Return to Check-Out", primary: true },
      { href: "/cart", label: "View Cart" },
    ]}
  />
);

export default Cancel;
