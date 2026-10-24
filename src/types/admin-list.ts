export interface AdminProductRow {
  _id: string;
  name: string;
  shortDescription?: string;
  slug: string;
  images?: string[];
  categoryId?: { slug?: string; image?: string } | string | null;
  variants: { price: number; label: string }[];
  isActive: boolean;
  isBestSeller?: boolean;
}

export interface AdminComboRow {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  images?: string[];
  price: number;
  isActive: boolean;
}

export interface AdminListFilterOption {
  value: string;
  label: string;
}

export interface AdminListFilter<T> {
  id: string;
  label: string;
  allLabel: string;
  options: readonly AdminListFilterOption[];
  match: (item: T, value: string) => boolean;
}

export interface AdminListFilterControl {
  id: string;
  label: string;
  allLabel: string;
  value: string;
  options: readonly AdminListFilterOption[];
  setValue: (value: string) => void;
}

export interface AdminListControlsState {
  query: string;
  setQuery: (value: string) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  page: number;
  setPage: (value: number) => void;
  pageCount: number;
  total: number;
  from: number;
  to: number;
  filters: AdminListFilterControl[];
}
