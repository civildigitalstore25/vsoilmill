import { PAYMENT_CALLBACK_AUTH, PAYMENT_ERRORS } from "@/constants/payment";

export function verifyPhonePeCallbackAuth(
  request: Request,
): { ok: true } | { ok: false; error: string } {
  const username = process.env.PHONEPE_CALLBACK_USERNAME ?? "";
  const password = process.env.PHONEPE_CALLBACK_PASSWORD ?? "";

  if (!username || !password) {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  const header = request.headers.get(PAYMENT_CALLBACK_AUTH.HEADER);
  if (!header?.startsWith(`${PAYMENT_CALLBACK_AUTH.SCHEME} `)) {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  const encoded = header.slice(PAYMENT_CALLBACK_AUTH.SCHEME.length + 1).trim();
  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  const separator = decoded.indexOf(":");
  if (separator < 0) {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  const user = decoded.slice(0, separator);
  const pass = decoded.slice(separator + 1);
  if (user !== username || pass !== password) {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  return { ok: true };
}
