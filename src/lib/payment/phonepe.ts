import crypto from "crypto";

const PHONEPE_HOST = {
  SANDBOX: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  PRODUCTION: "https://api.phonepe.com/apis/pg",
} as const;

function getConfig() {
  const clientId = process.env.PHONEPE_CLIENT_ID ?? "";
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET ?? "";
  const saltIndex = process.env.PHONEPE_CLIENT_VERSION ?? "1";
  const env = (process.env.PHONEPE_ENV ?? "SANDBOX") as keyof typeof PHONEPE_HOST;
  return { clientId, clientSecret, saltIndex, host: PHONEPE_HOST[env] ?? PHONEPE_HOST.SANDBOX };
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
  const { clientId, clientSecret, saltIndex, host } = getConfig();

  if (!clientId || !clientSecret) {
    return {
      error:
        "PhonePe credentials are not configured. Set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET.",
    };
  }

  const payload = {
    merchantId: clientId,
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
  const xVerify = checksum(base64, path, clientSecret, saltIndex);

  const response = await fetch(`${host}${path}`, {
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
  const { clientId, clientSecret, saltIndex, host } = getConfig();
  const path = `/pg/v1/status/${clientId}/${merchantOrderId}`;
  const xVerify = checksum("", path, clientSecret, saltIndex);

  const response = await fetch(`${host}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": clientId,
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
