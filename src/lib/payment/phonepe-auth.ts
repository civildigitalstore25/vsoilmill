import { PHONEPE_ENVS, PAYMENT_ERRORS } from "@/constants/payment";

type PhonePeEnv = (typeof PHONEPE_ENVS)[keyof typeof PHONEPE_ENVS];

type TokenCache = {
  accessToken: string;
  expiresAtMs: number;
};

let tokenCache: TokenCache | null = null;

function getEnv(): PhonePeEnv {
  const env = (process.env.PHONEPE_ENV ?? PHONEPE_ENVS.SANDBOX).toUpperCase();
  return env === PHONEPE_ENVS.PRODUCTION
    ? PHONEPE_ENVS.PRODUCTION
    : PHONEPE_ENVS.SANDBOX;
}

export function getPhonePeHosts() {
  const env = getEnv();
  if (env === PHONEPE_ENVS.PRODUCTION) {
    return {
      env,
      oauthHost: "https://api.phonepe.com/apis/identity-manager",
      apiHost: "https://api.phonepe.com/apis/pg",
    };
  }
  return {
    env,
    oauthHost: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    apiHost: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  };
}

export function getPhonePeCredentials() {
  return {
    clientId: process.env.PHONEPE_CLIENT_ID ?? "",
    clientSecret: process.env.PHONEPE_CLIENT_SECRET ?? "",
    clientVersion: process.env.PHONEPE_CLIENT_VERSION ?? "1",
  };
}

/** OAuth access token for PhonePe PG V2 (cached until near expiry). */
export async function getPhonePeAccessToken(): Promise<string> {
  const { clientId, clientSecret, clientVersion } = getPhonePeCredentials();
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
