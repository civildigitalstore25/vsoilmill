export const PHONEPE_ENVS = {
  SANDBOX: "SANDBOX",
  PRODUCTION: "PRODUCTION",
} as const;

export const PAYMENT_ERRORS = {
  CREDENTIALS_MISSING:
    "PhonePe credentials are not configured. Set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET.",
  CALLBACK_UNAUTHORIZED: "Invalid payment callback credentials",
  STATUS_UNAUTHORIZED: "Unauthorized",
  STATUS_FORBIDDEN: "Forbidden",
  INIT_FAILED: "Payment initiation failed",
} as const;

export const PAYMENT_CALLBACK_AUTH = {
  HEADER: "authorization",
  SCHEME: "Basic",
} as const;

export const PHONEPE_V2 = {
  TOKEN_TYPE: "O-Bearer",
  PAY_FLOW: "PG_CHECKOUT",
  EXPIRE_AFTER_SECONDS: 1200,
} as const;
