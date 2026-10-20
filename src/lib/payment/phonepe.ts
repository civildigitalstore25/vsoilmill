import crypto from "crypto";

export const PHONEPE_HOST = {
  SANDBOX: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  PRODUCTION: "https://api.phonepe.com/apis/hermes",
} as const;

// Official PhonePe UAT / Sandbox simulator sample credentials
export const PHONEPE_SAMPLE_TEST_KEYS = {
  MERCHANT_ID: "PGTESTPAYUAT",
  SALT_KEY: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
  SALT_INDEX: "1",
} as const;

export interface PhonePeConfig {
  env: "SANDBOX" | "PRODUCTION";
  isProduction: boolean;
  clientId: string;
  clientSecret: string;
  saltIndex: string;
  host: string;
  callbackUsername: string;
  callbackPassword: string;
  isConfigured: boolean;
}

/**
 * Resolves active PhonePe configuration based on PHONEPE_ENV or NODE_ENV.
 * Supports dedicated variables for Development/Sandbox and Production,
 * with fallbacks to sample test keys for sandbox and legacy variable names.
 */
export function getPhonePeConfig(): PhonePeConfig {
  const rawEnv = (process.env.PHONEPE_ENV ?? "").trim().toUpperCase();
  const isProd =
    rawEnv === "PRODUCTION" ||
    rawEnv === "PROD" ||
    rawEnv === "LIVE" ||
    (rawEnv === "" && process.env.NODE_ENV === "production");

  const env = isProd ? "PRODUCTION" : "SANDBOX";
  const host = PHONEPE_HOST[env];

  if (isProd) {
    const clientId = (
      process.env.PHONEPE_PROD_MERCHANT_ID ??
      process.env.PHONEPE_PROD_CLIENT_ID ??
      process.env.PHONEPE_CLIENT_ID ??
      process.env.PHONEPE_MERCHANT_ID ??
      ""
    ).trim();

    const clientSecret = (
      process.env.PHONEPE_PROD_SALT_KEY ??
      process.env.PHONEPE_PROD_CLIENT_SECRET ??
      process.env.PHONEPE_PROD_SECRET ??
      process.env.PHONEPE_CLIENT_SECRET ??
      process.env.PHONEPE_SALT_KEY ??
      ""
    ).trim();

    const saltIndex = (
      process.env.PHONEPE_PROD_SALT_INDEX ??
      process.env.PHONEPE_PROD_CLIENT_VERSION ??
      process.env.PHONEPE_CLIENT_VERSION ??
      process.env.PHONEPE_SALT_INDEX ??
      "1"
    ).trim();

    const callbackUsername = (
      process.env.PHONEPE_PROD_CALLBACK_USERNAME ??
      process.env.PHONEPE_CALLBACK_USERNAME ??
      ""
    ).trim();

    const callbackPassword = (
      process.env.PHONEPE_PROD_CALLBACK_PASSWORD ??
      process.env.PHONEPE_CALLBACK_PASSWORD ??
      ""
    ).trim();

    const isConfigured = Boolean(clientId && clientSecret);

    return {
      env,
      isProduction: true,
      clientId,
      clientSecret,
      saltIndex: saltIndex || "1",
      host,
      callbackUsername,
      callbackPassword,
      isConfigured,
    };
  }

  // SANDBOX / DEVELOPMENT mode
  const clientId = (
    process.env.PHONEPE_TEST_MERCHANT_ID ??
    process.env.PHONEPE_TEST_CLIENT_ID ??
    process.env.PHONEPE_SANDBOX_MERCHANT_ID ??
    process.env.PHONEPE_DEV_MERCHANT_ID ??
    process.env.PHONEPE_CLIENT_ID ??
    process.env.PHONEPE_MERCHANT_ID ??
    PHONEPE_SAMPLE_TEST_KEYS.MERCHANT_ID
  ).trim();

  const clientSecret = (
    process.env.PHONEPE_TEST_SALT_KEY ??
    process.env.PHONEPE_TEST_CLIENT_SECRET ??
    process.env.PHONEPE_SANDBOX_SALT_KEY ??
    process.env.PHONEPE_DEV_SALT_KEY ??
    process.env.PHONEPE_CLIENT_SECRET ??
    process.env.PHONEPE_SALT_KEY ??
    PHONEPE_SAMPLE_TEST_KEYS.SALT_KEY
  ).trim();

  const saltIndex = (
    process.env.PHONEPE_TEST_SALT_INDEX ??
    process.env.PHONEPE_TEST_CLIENT_VERSION ??
    process.env.PHONEPE_SANDBOX_SALT_INDEX ??
    process.env.PHONEPE_DEV_SALT_INDEX ??
    process.env.PHONEPE_CLIENT_VERSION ??
    process.env.PHONEPE_SALT_INDEX ??
    PHONEPE_SAMPLE_TEST_KEYS.SALT_INDEX
  ).trim();

  const callbackUsername = (
    process.env.PHONEPE_TEST_CALLBACK_USERNAME ??
    process.env.PHONEPE_SANDBOX_CALLBACK_USERNAME ??
    process.env.PHONEPE_DEV_CALLBACK_USERNAME ??
    process.env.PHONEPE_CALLBACK_USERNAME ??
    ""
  ).trim();

  const callbackPassword = (
    process.env.PHONEPE_TEST_CALLBACK_PASSWORD ??
    process.env.PHONEPE_SANDBOX_CALLBACK_PASSWORD ??
    process.env.PHONEPE_DEV_CALLBACK_PASSWORD ??
    process.env.PHONEPE_CALLBACK_PASSWORD ??
    ""
  ).trim();

  const isConfigured = Boolean(clientId && clientSecret);

  return {
    env,
    isProduction: false,
    clientId,
    clientSecret,
    saltIndex: saltIndex || "1",
    host,
    callbackUsername,
    callbackPassword,
    isConfigured,
  };
}

export function isPhonePeConfigured(): boolean {
  return getPhonePeConfig().isConfigured;
}

function isV2Credentials(clientId: string, clientSecret: string): boolean {
  return clientId.includes("_") || clientSecret.length > 40;
}

let cachedOAuthToken: { token: string; expiresAt: number } | null = null;

async function getOAuthToken(
  clientId: string,
  clientSecret: string,
  clientVersion: string,
  host: string,
): Promise<string> {
  const now = Date.now();
  if (cachedOAuthToken && cachedOAuthToken.expiresAt > now + 60000) {
    return cachedOAuthToken.token;
  }

  const tokenUrl = `${host}/v1/oauth/token`;
  const params = new URLSearchParams({
    client_id: clientId,
    client_version: clientVersion || "1",
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(
      json.message ?? json.error_description ?? "Failed to obtain PhonePe auth token",
    );
  }

  const expiresInMs = (json.expires_in ?? 3600) * 1000;
  cachedOAuthToken = {
    token: json.access_token,
    expiresAt: now + expiresInMs,
  };
  return json.access_token;
}

function checksum(base64Payload: string, path: string, salt: string, index: string): string {
  const hash = crypto
    .createHash("sha256")
    .update(`${base64Payload}${path}${salt}`)
    .digest("hex");
  return `${hash}###${index}`;
}

export async function createPhonePePayment(input: {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  callbackUrl: string;
}): Promise<{ redirectUrl: string; raw: unknown } | { error: string }> {
  const config = getPhonePeConfig();

  if (!config.isConfigured) {
    return {
      error: config.isProduction
        ? "PhonePe production credentials are not configured. Set PHONEPE_PROD_MERCHANT_ID and PHONEPE_PROD_SALT_KEY."
        : "PhonePe test credentials are not configured. Set PHONEPE_TEST_MERCHANT_ID and PHONEPE_TEST_SALT_KEY.",
    };
  }

  console.log(
    `[PhonePe] Initiating payment | Mode: ${config.env} | MID: ${config.clientId} | Host: ${config.host}`
  );

  // If using PhonePe V2 OAuth flow (typical for newer test accounts with client_id like M22P..._2609...)
  if (!config.isProduction && isV2Credentials(config.clientId, config.clientSecret)) {
    try {
      const token = await getOAuthToken(
        config.clientId,
        config.clientSecret,
        config.saltIndex,
        config.host,
      );

      const payUrl = `${config.host}/checkout/v2/pay`;
      const payPayload = {
        merchantOrderId: input.merchantOrderId,
        amount: input.amountInPaise,
        expireAfter: 1200,
        paymentFlow: {
          type: "PG_CHECKOUT",
          message: "Order Payment",
          merchantUrls: {
            redirectUrl: input.redirectUrl,
          },
        },
        disablePaymentRetry: false,
      };

      const res = await fetch(payUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
        body: JSON.stringify(payPayload),
      });

      const raw = await res.json();
      const redirectUrl = raw?.redirectUrl;

      if (!redirectUrl) {
        return {
          error: raw?.message ?? raw?.error ?? "Failed to create PhonePe payment",
          raw,
        };
      }

      return { redirectUrl, raw };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to initiate PhonePe payment",
      };
    }
  }

  // Standard PhonePe V1 flow (Live Production Hermes and V1 Sandbox)
  const payload = {
    merchantId: config.clientId,
    merchantTransactionId: input.merchantOrderId,
    merchantUserId: `MUID-${input.merchantOrderId.slice(0, 8)}`,
    amount: input.amountInPaise,
    redirectUrl: input.redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: input.callbackUrl,
    paymentInstrument: { type: "PAY_PAGE" },
  };

  const path = "/pg/v1/pay";
  const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
  const xVerify = checksum(base64, path, config.clientSecret, config.saltIndex);

  const response = await fetch(`${config.host}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-VERIFY": xVerify,
    },
    body: JSON.stringify({ request: base64 }),
  });

  const raw = await response.json();
  const redirectUrl =
    raw?.data?.instrumentResponse?.redirectInfo?.url ??
    raw?.data?.redirectUrl;

  if (!redirectUrl) {
    return { error: raw?.message ?? "Failed to create PhonePe payment", raw } as {
      error: string;
    };
  }

  return { redirectUrl, raw };
}

export async function getPhonePeStatus(
  merchantOrderId: string,
): Promise<{ success: boolean; state?: string; raw: unknown }> {
  const config = getPhonePeConfig();
  console.log(
    `[PhonePe] Checking order status | Mode: ${config.env} | MID: ${config.clientId} | Order: ${merchantOrderId}`
  );

  // If using PhonePe V2 OAuth flow
  if (!config.isProduction && isV2Credentials(config.clientId, config.clientSecret)) {
    try {
      const token = await getOAuthToken(
        config.clientId,
        config.clientSecret,
        config.saltIndex,
        config.host,
      );

      const statusUrl = `${config.host}/checkout/v2/order/${merchantOrderId}/status`;
      const res = await fetch(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
      });

      const raw = await res.json();
      const state = raw?.state;
      const success =
        state === "COMPLETED" ||
        state === "SUCCESS" ||
        (Array.isArray(raw?.paymentDetails) &&
          raw.paymentDetails.some(
            (p: { state?: string }) => p.state === "COMPLETED" || p.state === "SUCCESS",
          ));

      return { success, state, raw };
    } catch (error) {
      return { success: false, state: "FAILED", raw: error };
    }
  }

  // Standard PhonePe V1 flow
  const path = `/pg/v1/status/${config.clientId}/${merchantOrderId}`;
  const xVerify = checksum("", path, config.clientSecret, config.saltIndex);

  const response = await fetch(`${config.host}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": config.clientId,
    },
  });

  const raw = await response.json();
  const state = raw?.data?.state ?? raw?.data?.paymentState;
  const success =
    raw?.success === true ||
    state === "COMPLETED" ||
    state === "SUCCESS" ||
    raw?.code === "PAYMENT_SUCCESS";

  return { success, state, raw };
}
