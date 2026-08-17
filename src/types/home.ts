import type { Category, Product } from "@/types/product";

export type ShowcaseTab = "bestsellers" | "newarrivals" | "all";

export interface ShowcaseFilterBarProps {
  products: Product[];
  categories: Category[];
  activeTab: ShowcaseTab;
  selectedCategorySlug: string;
  onTabSelect: (tab: ShowcaseTab) => void;
  onCategorySelect: (slug: string) => void;
}

export interface HomeProductShowcaseProps {
  products: Product[];
  categories: Category[];
}
