import {
  EMAIL_COPY,
  EMAIL_THEME as T,
  getEmailSiteUrl,
  getEmailSocialLinks,
} from "@/constants/email";
import { UI } from "@/constants/ui";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type EmailDetailRow = { label: string; value: string };

/** Professional branded wrapper: header, body, optional data table, footer + social. */
export function renderEmailHtml(input: {
  preheader?: string;
  title: string;
  greeting?: string;
  paragraphs?: string[];
  details?: EmailDetailRow[];
  cta?: { label: string; href: string };
}): string {
  const social = getEmailSocialLinks();
  const shopUrl = getEmailSiteUrl("/shop");
  const preheader = escapeHtml(input.preheader ?? input.title);
  const detailsHtml =
    input.details && input.details.length
      ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0;border:1px solid ${T.border};border-radius:8px;overflow:hidden;">
        ${input.details
          .map(
            (row, i) => `
          <tr style="background:${i % 2 === 0 ? T.cream : T.card};">
            <td style="padding:12px 14px;font-family:${T.fontBody};font-size:13px;color:${T.muted};width:38%;border-bottom:1px solid ${T.border};">${escapeHtml(row.label)}</td>
            <td style="padding:12px 14px;font-family:${T.fontBody};font-size:14px;color:${T.dark};font-weight:600;border-bottom:1px solid ${T.border};">${escapeHtml(row.value)}</td>
          </tr>`,
          )
          .join("")}
      </table>`
      : "";

  const paragraphsHtml = (input.paragraphs ?? [])
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-family:${T.fontBody};font-size:15px;line-height:1.6;color:${T.dark};">${escapeHtml(p)}</p>`,
    )
    .join("");

  const greetingHtml = input.greeting
    ? `<p style="margin:0 0 16px;font-family:${T.fontBody};font-size:16px;color:${T.dark};">Hi ${escapeHtml(input.greeting)},</p>`
    : "";

  const ctaHtml = input.cta
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
        <tr>
          <td style="background:${T.primary};border-radius:8px;">
            <a href="${escapeHtml(input.cta.href)}" style="display:inline-block;padding:12px 22px;font-family:${T.fontBody};font-size:14px;font-weight:700;color:${T.primaryForeground};text-decoration:none;">${escapeHtml(input.cta.label)}</a>
          </td>
        </tr>
      </table>`
    : "";

  const socialHtml = social.length
    ? social
        .map(
          (s, i) =>
            `${i > 0 ? ` <span style="color:${T.border};">·</span> ` : ""}<a href="${escapeHtml(s.href)}" style="color:${T.accent};text-decoration:none;font-weight:600;">${escapeHtml(s.label)}</a>`,
        )
        .join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:${T.cream};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${T.cream};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-collapse:collapse;">
          <tr>
            <td style="background:${T.primary};padding:22px 28px;border-radius:12px 12px 0 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${T.logoUrl}" alt="${escapeHtml(UI.brand)}" width="48" height="48" style="display:block;border-radius:8px;border:2px solid ${T.accent};" />
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <div style="font-family:${T.fontSans};font-size:22px;font-weight:700;color:${T.primaryForeground};letter-spacing:0.02em;">${escapeHtml(UI.brand)}</div>
                    <div style="font-family:${T.fontBody};font-size:12px;color:${T.accent};margin-top:2px;">${escapeHtml(EMAIL_COPY.footerTagline)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:${T.card};padding:28px;border-left:1px solid ${T.border};border-right:1px solid ${T.border};">
              <h1 style="margin:0 0 18px;font-family:${T.fontSans};font-size:22px;line-height:1.3;color:${T.primary};">${escapeHtml(input.title)}</h1>
              ${greetingHtml}
              ${paragraphsHtml}
              ${detailsHtml}
              ${ctaHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${T.dark};padding:22px 28px;border-radius:0 0 12px 12px;text-align:center;">
              <p style="margin:0 0 8px;font-family:${T.fontBody};font-size:13px;color:${T.cream};">${escapeHtml(UI.address)}</p>
              <p style="margin:0 0 12px;font-family:${T.fontBody};font-size:13px;color:${T.accent};">
                <a href="tel:${escapeHtml(UI.phoneDisplay.replace(/\s/g, ""))}" style="color:${T.accent};text-decoration:none;">${escapeHtml(UI.phoneDisplay)}</a>
              </p>
              ${socialHtml ? `<p style="margin:0 0 14px;font-family:${T.fontBody};font-size:13px;">${socialHtml}</p>` : ""}
              <p style="margin:0;">
                <a href="${escapeHtml(shopUrl)}" style="font-family:${T.fontBody};font-size:12px;color:${T.creamDark};text-decoration:underline;">${escapeHtml(EMAIL_COPY.shopCta)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
