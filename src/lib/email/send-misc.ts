import { EMAIL_COPY, getAdminNotifyEmail } from "@/constants/email";
import { sendBrevoEmail } from "@/lib/email/brevo";
import { renderEmailHtml } from "@/lib/email/template";

/** Admin: contact form submission. */
export async function sendContactFormEmail(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const to = getAdminNotifyEmail();
  const text = [
    "Contact form message",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "—"}`,
    "",
    input.message,
  ].join("\n");
  const html = renderEmailHtml({
    title: "New contact message",
    paragraphs: ["Someone submitted the contact form on your website."],
    details: [
      { label: "Name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone || "—" },
      { label: "Message", value: input.message },
    ],
  });

  if (!to) {
    console.info("[email:console:contact]", { text });
    return { sent: false, mode: "console" as const };
  }

  return sendBrevoEmail({
    to,
    subject: EMAIL_COPY.contactSubject(input.name),
    text,
    html,
    replyTo: input.email,
    replyToName: input.name,
  });
}

/** Customer: password reset. */
export async function sendPasswordResetEmail(input: {
  email: string;
  resetUrl: string;
}) {
  const text = `Reset your password: ${input.resetUrl}\nThis link expires in 1 hour.`;
  const html = renderEmailHtml({
    title: "Reset your password",
    paragraphs: [
      "We received a request to reset your VS OilMill account password.",
      "This link expires in 1 hour. If you did not request this, you can ignore this email.",
    ],
    cta: { label: "Choose a new password", href: input.resetUrl },
  });

  return sendBrevoEmail({
    to: input.email,
    subject: EMAIL_COPY.resetSubject,
    text,
    html,
  });
}
