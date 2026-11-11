import type { CampaignAttribution } from "@/types/attribution";

export enum WhatsAppLeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  ORDERED = "ORDERED",
  LOST = "LOST",
}

export enum WhatsAppLeadContext {
  PRODUCT = "product",
  COMBO = "combo",
  CART = "cart",
  CHECKOUT = "checkout",
}

export interface WhatsAppLeadItem {
  productId?: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  price: number;
}

export interface WhatsAppLeadUser {
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface WhatsAppClickInput extends WhatsAppLeadUser {
  context: WhatsAppLeadContext;
  pagePath: string;
  items: WhatsAppLeadItem[];
  estimatedTotal: number;
  sessionKey?: string;
  attribution?: CampaignAttribution;
}

export interface WhatsAppLeadSummary {
  clicks: number;
  open: number;
  ordered: number;
}

export interface WhatsAppProductStat {
  key: string;
  name: string;
  clicks: number;
  ordered: number;
  open: number;
  lastClickAt: string;
}

export interface WhatsAppLeadRow {
  id: string;
  status: WhatsAppLeadStatus;
  context: WhatsAppLeadContext;
  pagePath: string;
  itemsSummary: string;
  productKeys: string[];
  estimatedTotal: number;
  customer: string;
  userEmail?: string;
  attributionLine: string;
  createdAt: string;
}
