export interface ComboItem {
  productId?: string;
  variantId?: string;
  quantity: number;
  productName?: string;
  variantLabel?: string;
  isCustom?: boolean;
  customPrice?: number;
  customImage?: string;
}

export interface ComboLineDetail {
  key: string;
  name: string;
  label: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface ComboOffer {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  price: number;
  originalPrice: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  items: ComboItem[];
}
