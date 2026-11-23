export enum ManualShipmentStatus {
  DRAFT = "DRAFT",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface ManualShipmentCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface ManualShipmentItem {
  productId?: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  image?: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
}

export interface ManualShipmentPricing {
  total: number;
}

export interface ManualShipment {
  _id: string;
  customer: ManualShipmentCustomer;
  items: ManualShipmentItem[];
  pricing: ManualShipmentPricing;
  trackingNumber?: string;
  courier?: string;
  publicTrackToken: string;
  status: ManualShipmentStatus;
  notes?: string;
  createdBy?: string;
  shippedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManualShipmentListRow {
  id: string;
  customerName: string;
  phone: string;
  itemsSummary: string;
  total: number;
  trackingNumber?: string;
  status: ManualShipmentStatus;
  publicTrackToken: string;
  createdAt: string;
}
