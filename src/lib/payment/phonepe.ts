import { PAYMENT_ERRORS } from "@/constants/payment";
import {
  assertPhonePeCredentialsConfigured,
  getPhonePeAccessToken,
  getPhonePeHosts,
  isPhonePeProductionV1,
} from "@/lib/payment/phonepe-auth";
import {
  createPhonePePaymentV1,
  getPhonePeStatusV1,
} from "@/lib/payment/phonepe-v1";

type CreatePaymentResult =
  | { redirectUrl: string; phonepeOrderId?: string; raw: unknown }
  | { error: string; raw?: unknown };

type StatusResult = {
  success: boolean;
  state?: string;
  raw: unknown;
};

export async function createPhonePePayment(input: {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
  callbackUrl?: string;
}): Promise<CreatePaymentResult> {
  const configured = assertPhonePeCredentialsConfigured();
  if (!configured.ok) {
    return { error: configured.error };
  }

  // Live dashboard API Key → classic V1 Pay API
  if (isPhonePeProductionV1()) {
    return createPhonePePaymentV1(input);
  }

  // Sandbox Client Id/Secret → PG V2 OAuth + checkout
  try {
    const token = await getPhonePeAccessToken();
    const { apiHost } = getPhonePeHosts();

    const payload = {
      merchantOrderId: input.merchantOrderId,
      amount: input.amountInPaise,
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: input.redirectUrl,
        },
      },
    };

    const response = await fetch(`${apiHost}/checkout/v2/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const raw = (await response.json()) as {
      redirectUrl?: string;
      orderId?: string;
      state?: string;
      message?: string;
      code?: string;
    };

    if (!response.ok || !raw.redirectUrl) {
      return {
        error: raw.message ?? raw.code ?? PAYMENT_ERRORS.INIT_FAILED,
        raw,
      };
    }

    return {
      redirectUrl: raw.redirectUrl,
      phonepeOrderId: raw.orderId,
      raw,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : PAYMENT_ERRORS.INIT_FAILED,
    };
  }
}

export async function getPhonePeStatus(
  merchantOrderId: string,
): Promise<StatusResult> {
  if (isPhonePeProductionV1()) {
    return getPhonePeStatusV1(merchantOrderId);
  }

  try {
    const token = await getPhonePeAccessToken();
    const { apiHost } = getPhonePeHosts();
    const path = `/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status`;

    const response = await fetch(`${apiHost}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    });

    const raw = (await response.json()) as {
      state?: string;
      orderId?: string;
      message?: string;
    };

    const state = raw.state;
    const success = state === "COMPLETED";
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
