export interface ProductSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface ProductVariant {
  _id?: string;
  label: string;
  sku: string;
  originalPrice: number;
  price: number;
  /** Timed offer price. Used only while the product offer window is active. */
  offerPrice?: number;
  /** Admin availability toggle. False means out of stock. */
  available?: boolean;
  stock: number;
  /** Variant-specific image (ImageKit, Cloudinary, or any https URL). */
  image?: string;
  weightGrams?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  badge?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  /** Product videos (YouTube, Instagram, Drive, ImageKit, Cloudinary, etc.). */
  videos?: string[];
  categoryId: string | Category;
  variants: ProductVariant[];
  tags: string[];
  isActive: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  /** Skip GST on this product (e.g. ₹1 payment test). */
  gstExempt?: boolean;
  offerEnabled?: boolean;
  offerStartsAt?: string | null;
  offerEndsAt?: string | null;
  seo: ProductSeo;
  averageRating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, variantId: string) => void;
}

export interface ProductGridProps {
  products: Product[];
  resetKey?: string;
}

export interface ProductShareProps {
  name: string;
  text: string;
}

export interface ProductShareLink {
  key: "whatsapp" | "facebook" | "x" | "email";
  label: string;
  href: string;
}

export interface ProductDetailHeadingProps {
  name: string;
  shortDescription?: string;
  discount: number;
}
