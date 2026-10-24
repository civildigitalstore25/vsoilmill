export const ADMIN_PAGE_SIZES = [10, 20, 50] as const;

export const ADMIN_LIST = {
  search: "Search",
  searchPlaceholder: "Search…",
  show: "Show",
  perPage: "per page",
  previous: "Previous",
  next: "Next",
  clear: "Clear",
  rows: "Rows",
  pageWindow: 5,
  empty: "No matching results.",
  all: "All",
  status: "Status",
  active: "Active",
  inactive: "Inactive",
  bestseller: "Bestseller",
  role: "Role",
  payment: "Payment",
  orderStatus: "Order status",
  reviewStatus: "Review status",
  approved: "Approved",
  pending: "Pending",
  range: (from: number, to: number, total: number) => `${from}–${to} of ${total}`,
} as const;

export const ADMIN_ACTIVE_OPTIONS = [
  { value: "active", label: ADMIN_LIST.active },
  { value: "inactive", label: ADMIN_LIST.inactive },
] as const;

export const ADMIN_PRODUCT_STATUS_OPTIONS = [
  ...ADMIN_ACTIVE_OPTIONS,
  { value: "bestseller", label: ADMIN_LIST.bestseller },
] as const;
