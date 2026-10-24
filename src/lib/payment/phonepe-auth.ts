import { PHONEPE_ENVS, PAYMENT_ERRORS } from "@/constants/payment";

export type PhonePeEnv = (typeof PHONEPE_ENVS)[keyof typeof PHONEPE_ENVS];

type TokenCache = {
  accessToken: string;
  expiresAtMs: number;
};

let tokenCache: TokenCache | null = null;

export function getPhonePeEnv(): PhonePeEnv {
  const env = (process.env.PHONEPE_ENV ?? PHONEPE_ENVS.SANDBOX).toUpperCase();
  return env === PHONEPE_ENVS.PRODUCTION
    ? PHONEPE_ENVS.PRODUCTION
    : PHONEPE_ENVS.SANDBOX;
}

/** Production dashboard shows API Key (V1). Sandbox uses Client Id/Secret (V2). */
export function isPhonePeProductionV1(): boolean {
  return getPhonePeEnv() === PHONEPE_ENVS.PRODUCTION;
}

export function getPhonePeHosts() {
  const env = getPhonePeEnv();
  if (env === PHONEPE_ENVS.PRODUCTION) {
    return {
      env,
      oauthHost: "https://api.phonepe.com/apis/identity-manager",
      apiHost: "https://api.phonepe.com/apis/pg",
      v1Host: "https://api.phonepe.com/apis/hermes",
    };
  }
  return {
    env,
    oauthHost: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    apiHost: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    v1Host: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  };
}

/** Sandbox / PG V2 credentials */
export function getPhonePeV2Credentials() {
  return {
    clientId: process.env.PHONEPE_CLIENT_ID ?? "",
    clientSecret: process.env.PHONEPE_CLIENT_SECRET ?? "",
    clientVersion: process.env.PHONEPE_CLIENT_VERSION ?? "1",
  };
}

/** Production / PG V1 credentials (API Key + Key Index from live dashboard) */
export function getPhonePeV1Credentials() {
  return {
    merchantId: process.env.PHONEPE_MERCHANT_ID ?? "",
    apiKey: process.env.PHONEPE_API_KEY ?? "",
    keyIndex: process.env.PHONEPE_KEY_INDEX ?? "1",
  };
}

export function assertPhonePeCredentialsConfigured():
  | { ok: true }
  | { ok: false; error: string } {
  if (isPhonePeProductionV1()) {
    const { merchantId, apiKey } = getPhonePeV1Credentials();
    if (!merchantId || !apiKey) {
      return { ok: false, error: PAYMENT_ERRORS.PROD_CREDENTIALS_MISSING };
    }
    return { ok: true };
  }

  const { clientId, clientSecret } = getPhonePeV2Credentials();
  if (!clientId || !clientSecret) {
    return { ok: false, error: PAYMENT_ERRORS.CREDENTIALS_MISSING };
  }
  return { ok: true };
}

/** OAuth access token for PhonePe PG V2 (sandbox). */
export async function getPhonePeAccessToken(): Promise<string> {
  const { clientId, clientSecret, clientVersion } = getPhonePeV2Credentials();
  if (!clientId || !clientSecret) {
    throw new Error(PAYMENT_ERRORS.CREDENTIALS_MISSING);
  }

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAtMs > now + 60_000) {
    return tokenCache.accessToken;
  }

  const { oauthHost } = getPhonePeHosts();
  const body = new URLSearchParams({
    client_id: clientId,
    client_version: clientVersion,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(`${oauthHost}/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const raw = (await response.json()) as {
    access_token?: string;
    expires_at?: number;
    message?: string;
    code?: string;
  };

  if (!response.ok || !raw.access_token) {
    throw new Error(
      raw.message ?? raw.code ?? "Failed to get PhonePe access token",
    );
  }

  const expiresAtMs =
    typeof raw.expires_at === "number"
      ? raw.expires_at * 1000
      : now + 50 * 60_000;

  tokenCache = { accessToken: raw.access_token, expiresAtMs };
  return raw.access_token;
}
