export const ST_COURIER_NAME = "ST Courier";
export const ST_COURIER_TRACK_PAGE = "https://stcourier.com/track/shipment";
const ST_COURIER_TRACK_POST = "https://stcourier.com/track/doCheck";
const FETCH_TIMEOUT_MS = 15_000;

/** ST Courier consignment (AWB) numbers are exactly 11 digits, e.g. 58240292331. */
export const CONSIGNMENT_PATTERN = /^\d{11}$/;
export const CONSIGNMENT_LENGTH = 11;

export function normalizeConsignment(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return CONSIGNMENT_PATTERN.test(trimmed) ? trimmed : null;
}

/**
 * ST Courier has no GET deep link: results are tied to a server session
 * (ci_session cookie) populated by POST /track/doCheck. Users are sent to the
 * public tracking page and enter / paste the number there.
 */
export function getStCourierTrackingUrl(trackingNumber?: string): string {
  void trackingNumber;
  return ST_COURIER_TRACK_PAGE;
}

export type StCourierStatus = {
  status: string;
  delivered: boolean;
  raw: string;
};

export type StCourierSummary = {
  currentStatus: string | null;
  origin: string | null;
  destination: string | null;
  consignment: string | null;
  bookedAt: string | null;
  deliveredAt: string | null;
};

export type StCourierEvent = {
  date: string;
  time: string;
  status: string;
  location: string;
};

export type StCourierTracking = StCourierStatus & {
  trackingNumber: string;
  summary: StCourierSummary;
  /** Newest first, as ST Courier lists them. */
  events: StCourierEvent[];
};

function extractCookies(res: Response): string {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  const list =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (res.headers.get("set-cookie") ?? "").split(/,(?=\s*[^;,=\s]+=)/);
  return list
    .map((cookie) => cookie.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Split an HTML fragment on <br> into clean text lines. */
function brLines(html: string) {
  return html
    .split(/<br\s*\/?>/i)
    .map((part) => stripTags(part))
    .filter(Boolean);
}

const SUMMARY_LABELS: Record<string, keyof StCourierSummary> = {
  "current status": "currentStatus",
  "orgin src": "origin",
  "origin src": "origin",
  destination: "destination",
  consignment: "consignment",
  "book date/time": "bookedAt",
  "delivery date/time": "deliveredAt",
};

export function parseStCourierResultPage(
  html: string,
  trackingNumber: string,
): StCourierTracking | null {
  const historyStart = html.indexOf("Status of AWB No.");
  const summaryHtml = historyStart >= 0 ? html.slice(0, historyStart) : html;

  const summary: StCourierSummary = {
    currentStatus: null,
    origin: null,
    destination: null,
    consignment: null,
    bookedAt: null,
    deliveredAt: null,
  };
  const rowPattern = /<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
  for (const row of summaryHtml.matchAll(rowPattern)) {
    const key = SUMMARY_LABELS[stripTags(row[1] ?? "").toLowerCase()];
    const value = stripTags(row[2] ?? "");
    if (key && value && !summary[key]) summary[key] = value;
  }

  const events: StCourierEvent[] = [];
  if (historyStart >= 0) {
    const historyHtml = html.slice(historyStart);
    const end = historyHtml.search(/complaintModal|<footer/i);
    const timeline = end > 0 ? historyHtml.slice(0, end) : historyHtml;
    // Each entry is two inner blocks: "date<br>time" then "status<br>location<br>".
    const blocks = [
      ...timeline.matchAll(/<div[^>]*style="margin-top:0[^"]*"[^>]*>([\s\S]*?)<\/div>/gi),
    ].map((m) => brLines(m[1] ?? ""));
    for (let i = 0; i + 1 < blocks.length; i += 2) {
      const [date = "", time = ""] = blocks[i] ?? [];
      const [status = "", ...rest] = blocks[i + 1] ?? [];
      if (!status) continue;
      events.push({
        date,
        time,
        status,
        location: rest.join(" ").replace(/\s*-to-\s*/i, " -> "),
      });
    }
  }

  const status = summary.currentStatus ?? events[0]?.status ?? "";
  if (!status) return null;

  const raw = events
    .map((e) => `${e.date} ${e.time} ${e.status} ${e.location}`.trim())
    .join(" | ")
    .slice(0, 1000);

  return {
    trackingNumber,
    status,
    delivered: /^delivered\b/i.test(status),
    raw,
    summary,
    events,
  };
}

export async function fetchStCourierTracking(
  trackingNumber: string,
): Promise<StCourierTracking | null> {
  const awb = normalizeConsignment(trackingNumber);
  if (!awb) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const baseHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Referer: ST_COURIER_TRACK_PAGE,
  };

  try {
    const first = await fetch(ST_COURIER_TRACK_PAGE, {
      headers: baseHeaders,
      signal: controller.signal,
      cache: "no-store",
    });
    let cookie = extractCookies(first);
    if (!cookie) return null;

    const form = new URLSearchParams({ awb_no: awb });
    const post = await fetch(ST_COURIER_TRACK_POST, {
      method: "POST",
      headers: {
        ...baseHeaders,
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: form.toString(),
      signal: controller.signal,
      cache: "no-store",
    });
    const postCookie = extractCookies(post);
    if (postCookie) cookie = postCookie;
    const postBody = (await post.text()).trim();
    try {
      const json = JSON.parse(postBody) as { code?: number };
      if (json.code !== 200) return null;
    } catch {
      return null;
    }

    const result = await fetch(ST_COURIER_TRACK_PAGE, {
      headers: { ...baseHeaders, Cookie: cookie },
      signal: controller.signal,
      cache: "no-store",
    });
    const html = await result.text();
    return parseStCourierResultPage(html, awb);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchStCourierStatus(
  trackingNumber: string,
): Promise<StCourierStatus | null> {
  const tracking = await fetchStCourierTracking(trackingNumber);
  if (!tracking) return null;
  return { status: tracking.status, delivered: tracking.delivered, raw: tracking.raw };
}