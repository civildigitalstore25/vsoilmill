export const QUERY_KEYS = {
  products: ["products"] as const,
  product: (slug: string) => ["products", slug] as const,
  categories: ["categories"] as const,
  category: (slug: string) => ["categories", slug] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
  reviews: (productId: string) => ["reviews", productId] as const,
  adminStats: ["admin", "stats"] as const,
  adminUsers: ["admin", "users"] as const,
  adminReviews: ["admin", "reviews"] as const,
} as const;
