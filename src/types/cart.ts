export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantLabel: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock: number;
  gstExempt?: boolean;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  /** Replace entire cart with a single item (Buy Now). */
  buyNowItem: (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  /** Refresh gstExempt (and related) flags from live product data. */
  syncProductFlags: (
    flags: Array<{ productId: string; gstExempt: boolean }>,
  ) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}
