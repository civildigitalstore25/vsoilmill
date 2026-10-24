import { ASSETS } from "@/constants/assets";
import { UI } from "@/constants/ui";

/** Matches app theme from globals.css (inline for email clients). */
export const EMAIL_THEME = {
  primary: "#2d5a3d",
  primaryForeground: "#f7f3eb",
  accent: "#c4a35a",
  cream: "#f7f3eb",
  creamDark: "#ebe4d6",
  dark: "#1a1a16",
  muted: "#6b6b5e",
  border: "#ddd5c4",
  card: "#ffffff",
  fontSans: "Georgia, 'Times New Roman', serif",
  fontBody: "Arial, Helvetica, sans-serif",
  logoUrl: ASSETS.LOGO,
} as const;

export type EmailSocialLink = {
  label: string;
  href: string;
};

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

function whatsappHref(): string {
  const n = UI.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${n}`;
}

/** Only links with a real href are shown in the email footer. */
export function getEmailSocialLinks(): EmailSocialLink[] {
  const links: EmailSocialLink[] = [
    { label: "WhatsApp", href: whatsappHref() },
    { label: "Instagram", href: "https://www.instagram.com/vsoilmillstore/" },
    { label: "Facebook", href: "https://www.facebook.com/VSOilMillStore/" },
    { label: "YouTube", href: "https://www.youtube.com/@Sarathkumar-pd" },
  ];
  return links.filter((l) => Boolean(l.href));
}

export function getEmailSiteUrl(path = ""): string {
  return `${siteBase()}${path.startsWith("/") ? path : path ? `/${path}` : ""}`;
}

export const EMAIL_COPY = {
  orderConfirmSubject: `${UI.brand} — order confirmed`,
  orderAdminSubject: (orderId: string) =>
    `${UI.brand} — new paid order ${orderId}`,
  statusSubject: (status: string) =>
    `${UI.brand} — order ${status.toLowerCase()}`,
  contactSubject: (name: string) =>
    `${UI.brand} — contact from ${name}`,
  resetSubject: `${UI.brand} — reset your password`,
  contactThanks: "Thanks — we received your message and will reply soon.",
  contactError: "Could not send your message. Please try WhatsApp or call us.",
  contactSubmit: "Send message",
  contactSending: "Sending…",
  contactName: "Your name",
  contactEmail: "Email",
  contactPhone: "Phone",
  contactMessage: "Message",
  footerTagline: UI.since,
  shopCta: "Visit our store",
  address: "Address",
  city: "City",
  state: "State",
  pincode: "Pincode",
  country: "Country",
} as const;

/** Inbox for admin alerts (contact form, new paid orders). */
export function getAdminNotifyEmail(): string {
  return (
    process.env.ADMIN_NOTIFY_EMAIL?.trim() || "sarathkumar.agri001@gmail.com"
  );
}
