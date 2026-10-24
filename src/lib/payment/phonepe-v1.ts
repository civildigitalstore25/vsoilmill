import crypto from "crypto";
import { PAYMENT_ERRORS } from "@/constants/payment";
import {
  getPhonePeHosts,
  getPhonePeV1Credentials,
} from "@/lib/payment/phonepe-auth";

type CreatePaymentResult =
  | { redirectUrl: string; phonepeOrderId?: string; raw: unknown }
  | { error: string; raw?: unknown };

type StatusResult = {
  success: boolean;
  state?: string;
  raw: unknown;
};

function checksum(
  base64Payload: string,
  path: string,
  salt: string,
  index: string,
): string {
  const hash = crypto
    .createHash("sha256")
    .update(`${base64Payload}${path}${salt}`)
    .digest("hex");
  return `${hash}###${index}`;
}

/** Production live credentials use classic PG v1 Pay API + X-VERIFY. */
export async function createPhonePePaymentV1(input: {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  callbackUrl?: string;
}): Promise<CreatePaymentResult> {
  const { merchantId, apiKey, keyIndex } = getPhonePeV1Credentials();
  if (!merchantId || !apiKey) {
    return { error: PAYMENT_ERRORS.PROD_CREDENTIALS_MISSING };
  }

  try {
    const { v1Host } = getPhonePeHosts();
    const payload = {
      merchantId,
      merchantTransactionId: input.merchantOrderId,
      merchantUserId: `MUID-${input.merchantOrderId.slice(0, 12)}`,
      amount: input.amountInPaise,
      redirectUrl: input.redirectUrl,
      redirectMode: "REDIRECT",
      ...(input.callbackUrl ? { callbackUrl: input.callbackUrl } : {}),
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const path = "/pg/v1/pay";
    const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const xVerify = checksum(base64, path, apiKey, keyIndex);

    const response = await fetch(`${v1Host}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-VERIFY": xVerify,
      },
      body: JSON.stringify({ request: base64 }),
    });

    const raw = (await response.json()) as {
      success?: boolean;
      code?: string;
      message?: string;
      data?: {
        instrumentResponse?: {
          redirectInfo?: { url?: string };
        };
        redirectUrl?: string;
      };
    };

    const redirectUrl =
      raw?.data?.instrumentResponse?.redirectInfo?.url ??
      raw?.data?.redirectUrl;

    if (!redirectUrl) {
      return {
        error: raw.message ?? raw.code ?? PAYMENT_ERRORS.INIT_FAILED,
        raw,
      };
    }

    return { redirectUrl, raw };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : PAYMENT_ERRORS.INIT_FAILED,
    };
  }
}

export async function getPhonePeStatusV1(
  merchantOrderId: string,
): Promise<StatusResult> {
  try {
    const { merchantId, apiKey, keyIndex } = getPhonePeV1Credentials();
    if (!merchantId || !apiKey) {
      return {
        success: false,
        state: "ERROR",
        raw: { message: PAYMENT_ERRORS.PROD_CREDENTIALS_MISSING },
      };
    }

    const { v1Host } = getPhonePeHosts();
    const path = `/pg/v1/status/${merchantId}/${merchantOrderId}`;
    const xVerify = checksum("", path, apiKey, keyIndex);

    const response = await fetch(`${v1Host}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-VERIFY": xVerify,
        "X-MERCHANT-ID": merchantId,
      },
    });

    const raw = (await response.json()) as {
      success?: boolean;
      code?: string;
      data?: { state?: string; paymentState?: string };
    };

    const state = raw?.data?.state ?? raw?.data?.paymentState;
    const success =
      raw?.success === true ||
      state === "COMPLETED" ||
      state === "SUCCESS" ||
      raw?.code === "PAYMENT_SUCCESS";

    return { success, state, raw };
  } catch (error) {
    return {
      success: false,
      state: "ERROR",
      raw: {
        message: error instanceof Error ? error.message : "Status check failed",
      },
    };
  }
}
