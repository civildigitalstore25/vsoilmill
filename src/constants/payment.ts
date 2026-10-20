export const PHONEPE_ENVS = {
  SANDBOX: "SANDBOX",
  PRODUCTION: "PRODUCTION",
} as const;

export const PAYMENT_ERRORS = {
  CREDENTIALS_MISSING:
    "PhonePe credentials are not configured. Please set the required PhonePe environment variables in your .env file.",
  CALLBACK_UNAUTHORIZED: "Invalid payment callback credentials",
  STATUS_UNAUTHORIZED: "Unauthorized",
  STATUS_FORBIDDEN: "Forbidden",
  INIT_FAILED: "Payment initiation failed",
} as const;

export const PAYMENT_CALLBACK_AUTH = {
  HEADER: "authorization",
  SCHEME: "Basic",
} as const;
