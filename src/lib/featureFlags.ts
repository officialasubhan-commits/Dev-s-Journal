// src/lib/featureFlags.ts
/**
 * Simple Feature Flags for Code Nest Vision 2.0.
 * Allows safe rollouts and toggling features at runtime/compile-time.
 */
export const featureFlags = {
  ENABLE_ACADEMY: true,
  ENABLE_PAYMENTS: false, // Set to true when Stripe/Razorpay is fully integrated
  ENABLE_HOMEPAGE_CUSTOMIZER: true,
  ENABLE_CERTIFICATE_VERIFICATION: true,
};
