import type { ShippingAddress } from "@/types/user";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  pricing: OrderPricing;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  phonepeMerchantOrderId?: string;
  phonepeTransactionId?: string;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
