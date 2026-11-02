import { NextResponse } from "next/server";
import { z } from "zod";
import { EMAIL_COPY } from "@/constants/email";
import { sendContactFormEmail } from "@/lib/email/send";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
  // Anti-spam fields
  website: z.string().optional(), // honeypot: real users never fill this
  startedAt: z.number().optional(), // ms timestamp when the form was rendered
});

const MIN_FILL_MS = 3000;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;
// In-memory per-instance limiter (best effort on serverless).
const hits = new Map<string, number[]>();

function getIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function looksLikeSpam(d: { name: string; message: string; email: string }): boolean {
  const name = d.name.trim();
  const message = d.message.trim();
  // Long single random token as name, e.g. "gKzyAVwNDARbWPeSpHZlsnyv"
  if (!/\s/.test(name) && name.length >= 15) return true;
  // Message that is only digits / phone-like characters
  if (/^[\d\s+\-()]+$/.test(message)) return true;
  // Message with no letters at all
  if (!/\p{L}/u.test(message)) return true;
  // Gmail with lots of dots in local part, e.g. "pi.xe.l1.0bo.t@gmail.com"
  const [local, domain] = d.email.toLowerCase().split("@");
  if (domain === "gmail.com" && (local.match(/\./g) ?? []).length >= 3) return true;
  return false;
}

// Pretend success so bots don't learn they were blocked.
const fakeOk = () =>
  NextResponse.json({ data: { ok: true, message: EMAIL_COPY.contactThanks } });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: EMAIL_COPY.contactError },
        { status: 400 },
      );
    }
    const data = parsed.data;

    if (data.website && data.website.trim() !== "") return fakeOk();
    if (!data.startedAt || Date.now() - data.startedAt < MIN_FILL_MS) return fakeOk();
    if (looksLikeSpam(data)) return fakeOk();

    if (rateLimited(getIp(request))) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    }

    await sendContactFormEmail({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
      message: data.message.trim(),
    });

    return NextResponse.json({
      data: { ok: true, message: EMAIL_COPY.contactThanks },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : EMAIL_COPY.contactError,
      },
      { status: 500 },
    );
  }
}