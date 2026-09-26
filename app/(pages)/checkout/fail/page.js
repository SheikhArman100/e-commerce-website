"use client";

import CheckoutResult from "../CheckoutResult.js";

/**
 * Where SSLCommerz sends a declined payment. `POST /payment/fail` has already
 * rolled the incomplete shell order back, and the cart was never touched — which
 * is exactly what the copy promises, plus a way back to the same selection.
 */
const Fail = () => (
  <CheckoutResult
    tone="fail"
    title="Payment Failed"
    message="The gateway could not complete the transaction, so no order was placed and nothing was charged."
    notes={[
      "Your selection is untouched — the same creations are still in your cart.",
      "Trying again opens a fresh payment session for that same selection.",
      "If a charge does appear on your statement, quote the transaction reference above and we will trace it immediately.",
    ]}
    actions={[
      { href: "/checkout", label: "Try Again", primary: true },
      { href: "/cart", label: "Review Selection" },
    ]}
  />
);

export default Fail;
