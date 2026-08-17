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
  stock: number;
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
  categoryId: string | Category;
  variants: ProductVariant[];
  tags: string[];
  isActive: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
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
