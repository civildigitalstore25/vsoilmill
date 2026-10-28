export interface AnalyticsPurchaseItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

export interface PurchaseTracking {
  orderId: string;
  value: number;
  items: AnalyticsPurchaseItem[];
}
