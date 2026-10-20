import { UI } from "@/constants/ui";

const BREVO_SMTP_URL = "https://api.brevo.com/v3/smtp/email";

export type SendEmailInput = {
  to: string;
  toName?: string;
  subject: string;
  text: string;
  html?: string;
};

function parseSender(from: string): { email: string; name: string } {
  const match = from.match(/^(.*)<([^>]+)>$/);
  if (match) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, "") || UI.brand,
      email: match[2].trim(),
    };
  }
  return { email: from.trim(), name: UI.brand };
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.EMAIL_FROM);
}

/** Send transactional email via Brevo (Sendinblue). */
export async function sendBrevoEmail(
  input: SendEmailInput,
): Promise<{ sent: boolean; mode: "email" | "console" }> {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info("[email:console]", {
      to: input.to,
      subject: input.subject,
      body: input.text,
    });
    return { sent: false, mode: "console" };
  }

  const sender = parseSender(from);
  const response = await fetch(BREVO_SMTP_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      to: [{ email: input.to, name: input.toName }],
      subject: input.subject,
      textContent: input.text,
      htmlContent:
        input.html ??
        `<pre style="font-family:sans-serif;white-space:pre-wrap">${input.text}</pre>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      detail || `Brevo email failed (${response.status})`,
    );
  }

  return { sent: true, mode: "email" };
}
