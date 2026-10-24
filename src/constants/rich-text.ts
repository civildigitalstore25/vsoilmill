export const RICH_TEXT_COPY = {
  placeholder: "Write a detailed description…",
  footerHelp:
    "Click an image to select it, then use Remove image. Headings, lists, links, and YouTube are supported.",
  characters: "characters",
  styleNormal: "Normal",
  styleH2: "Heading 2",
  styleH3: "Heading 3",
  linkPrompt: "Paste link URL",
  imagePlaceholder: "Paste image URL",
  youtubePlaceholder: "Paste YouTube URL",
  insert: "Insert",
  embed: "Embed",
  removeImage: "Remove image",
  textStyle: "Text style",
} as const;

export const RICH_TEXT_COLORS = [
  { label: "Default", value: "", swatch: "bg-card" },
  { label: "Dark", value: "var(--color-dark)", swatch: "bg-dark" },
  { label: "Green", value: "var(--color-primary)", swatch: "bg-primary" },
  { label: "Gold", value: "var(--color-accent)", swatch: "bg-accent" },
  { label: "Muted", value: "var(--color-muted)", swatch: "bg-muted" },
  { label: "Red", value: "var(--color-destructive)", swatch: "bg-destructive" },
] as const;

export const CHECKOUT_PAYMENT_COPY = {
  subtitle: "Review your address, then pay online.",
  gatewayTitle: "Secure online payment",
  gatewayHint: "UPI, cards, and net banking",
  pay: (amount: string) => `Pay ${amount}`,
  confirming: "Confirming your payment…",
} as const;
