import crypto from "crypto";
import { PAYMENT_CALLBACK_AUTH, PAYMENT_ERRORS } from "@/constants/payment";

function expectedSha(username: string, password: string): string {
  return crypto
    .createHash("sha256")
    .update(`${username}:${password}`)
    .digest("hex");
}

/**
 * PhonePe V2 webhook auth (SHA): Authorization is SHA256(username:password).
 * Accepts raw hex, optional "SHA256 " / "Bearer " prefixes, and Basic auth for local tests.
 */
export function verifyPhonePeCallbackAuth(
  request: Request,
): { ok: true } | { ok: false; error: string } {
  const username = (process.env.PHONEPE_CALLBACK_USERNAME ?? "").trim();
  const password = (process.env.PHONEPE_CALLBACK_PASSWORD ?? "").trim();

  if (!username || !password) {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  const header =
    request.headers.get(PAYMENT_CALLBACK_AUTH.HEADER)?.trim() ??
    request.headers.get("Authorization")?.trim() ??
    "";

  if (!header) {
    return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
  }

  const hash = expectedSha(username, password).toLowerCase();
  const normalized = header
    .trim()
    .replace(/^(sha-?256|bearer)\s+/i, "")
    .toLowerCase();

  if (normalized === hash) {
    return { ok: true };
  }

  if (header.toLowerCase().startsWith("basic ")) {
    const encoded = header.slice(6).trim();
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const separator = decoded.indexOf(":");
      if (separator >= 0) {
        const user = decoded.slice(0, separator);
        const pass = decoded.slice(separator + 1);
        if (user === username && pass === password) {
          return { ok: true };
        }
      }
    } catch {
      // fall through
    }
  }

  return { ok: false, error: PAYMENT_ERRORS.CALLBACK_UNAUTHORIZED };
}
