import { ManualShipmentStatus } from "@/types/manual-shipment";

export const MANUAL_SHIPMENT_STATUSES = [
  ManualShipmentStatus.DRAFT,
  ManualShipmentStatus.CONFIRMED,
  ManualShipmentStatus.SHIPPED,
  ManualShipmentStatus.DELIVERED,
  ManualShipmentStatus.CANCELLED,
] as const;

export const MANUAL_SHIPMENT_LIMITS = {
  tokenBytes: 18,
  maxItems: 40,
  maxNameLength: 200,
  maxNotesLength: 1000,
  phoneMin: 10,
} as const;

export const MANUAL_SHIPMENT_COPY = {
  navLabel: "Manual orders",
  navHint: "WhatsApp & offline shipments",
  title: "Manual orders",
  description:
    "Create tracking links for WhatsApp or offline customers who are not registered on the website.",
  createTitle: "New manual order",
  createDescription: "Add customer details, products, and optional AWB.",
  detailTitle: "Manual order",
  empty: "No manual orders yet.",
  createCta: "New manual order",
  name: "Customer name",
  phone: "Phone",
  email: "Email (optional)",
  notes: "Notes (optional)",
  awb: "AWB / consignment",
  awbHint: "11-digit ST Courier number. Leave blank and add later if needed.",
  addCatalog: "Add catalog product",
  addCustom: "Add custom product",
  customName: "Custom product name",
  customPrice: "Price",
  quantity: "Qty",
  items: "Items",
  total: "Total",
  noItems: "Add at least one product",
  submit: "Create manual order",
  creating: "Creating…",
  created: "Manual order created",
  createFailed: "Could not create manual order",
  updated: "Manual order updated",
  updateFailed: "Could not update manual order",
  notFound: "Manual order not found",
  invalid: "Invalid manual order data",
  copyLink: "Copy track link",
  linkCopied: "Track link copied",
  shareWhatsApp: "Share on WhatsApp",
  openDetails: "Open details",
  editOrder: "Edit order",
  saveChanges: "Save changes",
  saving: "Saving…",
  cancelEdit: "Cancel edit",
  saveAwb: "Save AWB",
  removeItem: "Remove",

  publicLink: "Customer track link",
  totalAmount: "Total amount",
  placedOn: "Created on",
  noAwb: "No AWB yet",
  awbLabel: "AWB",
  statsTotal: "Total orders",
  statsTotalHint: "All manual WhatsApp / offline orders",
  statsShipped: "Shipped",
  statsShippedHint: "Orders with AWB handed to courier",
  statsDelivered: "Delivered",
  statsDeliveredHint: "Marked delivered from tracking",
  statsRevenue: "Revenue",
  statsRevenueHint: "Sum of manual order totals",
  tableCustomer: "Customer",
  tableDate: "Date",
  tableItems: "Items",
  tableTotal: "Total",
  tableStatus: "Status",
  tableAwb: "AWB",
  tableActions: "Actions",
  view: "View",

  notShipped:
    "This shipment does not have an AWB yet. Tracking will appear once the admin adds the courier number.",
  trackTitle: "Track your shipment",
  trackSubtitle: "Live status from ST Courier",
  trackMissing: "Tracking link not found",
} as const;

export function manualTrackShareMessage(
  customerName: string,
  trackUrl: string,
  shortId: string,
): string {
  return `Hi ${customerName},\n\nYour VS OilMill order #${shortId} is on the way.\n\nTrack live status here:\n${trackUrl}\n\nThank you!`;
}
