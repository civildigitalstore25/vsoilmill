import { WhatsAppLeadContext, WhatsAppLeadStatus } from "@/types/whatsapp-lead";

export const WHATSAPP_LEAD_STATUSES = [
  WhatsAppLeadStatus.NEW,
  WhatsAppLeadStatus.CONTACTED,
  WhatsAppLeadStatus.ORDERED,
  WhatsAppLeadStatus.LOST,
] as const;

export const WHATSAPP_LEAD_CONTEXTS = [
  WhatsAppLeadContext.PRODUCT,
  WhatsAppLeadContext.COMBO,
  WhatsAppLeadContext.CART,
  WhatsAppLeadContext.CHECKOUT,
] as const;

export const WHATSAPP_LEAD_LIMITS = {
  maxItems: 40,
  maxNameLength: 200,
  maxPathLength: 200,
  maxSessionLength: 120,
  maxClicksPerSession: 40,
  recentItems: 80,
  topProducts: 24,
  guestLabel: "Guest",
} as const;

export const WHATSAPP_LEAD_COPY = {
  invalidClick: "Invalid WhatsApp click",
  clickFailed: "Could not record WhatsApp click",
  notFound: "WhatsApp lead not found",
  updateFailed: "Could not update WhatsApp lead",
  updated: "WhatsApp lead updated",
  statusLabel: "Status",
} as const;
