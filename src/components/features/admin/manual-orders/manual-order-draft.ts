export type ManualOrderDraftItem = {
  key: string;
  productId?: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  isCustom: boolean;
  label: string;
};

export function draftTotal(items: ManualOrderDraftItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
