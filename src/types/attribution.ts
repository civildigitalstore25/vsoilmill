export interface CampaignAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPath?: string;
}

export interface StoredAttribution extends CampaignAttribution {
  capturedAt: number;
}

export interface MarketingVisitInput extends CampaignAttribution {
  sessionKey: string;
}

export interface TrafficSourceRow {
  source: string;
  label: string;
  visits: number;
  orders: number;
  paidOrders: number;
  revenue: number;
}

export interface TrafficCampaignRow {
  source: string;
  sourceLabel: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPath: string;
  visits: number;
  orders: number;
  paidOrders: number;
  revenue: number;
  lastActivityAt?: string;
}

export interface TrafficSummary {
  visits: number;
  orders: number;
  paidOrders: number;
  revenue: number;
}

export interface TrafficVisitRow {
  id: string;
  source: string;
  sourceLabel: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landingPath: string;
  createdAt: string;
}

export interface TrafficOrderRow {
  id: string;
  customer: string;
  sourceLabel: string;
  attributionLine: string;
  total: number;
  paymentStatus: string;
  createdAt: string;
}

export interface TrafficReport {
  summary: TrafficSummary;
  sources: TrafficSourceRow[];
  campaigns: TrafficCampaignRow[];
}
