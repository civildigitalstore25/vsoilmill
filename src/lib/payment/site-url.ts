/**
 * Prefer the host the browser actually used (ngrok/localhost) for PhonePe redirect,
 * so the user returns to the same origin where their session cookie exists.
 */
export function resolveSiteUrl(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (host) {
    const proto =
      forwardedProto ??
      (forwardedHost || host.includes("ngrok") ? "https" : "http");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}
