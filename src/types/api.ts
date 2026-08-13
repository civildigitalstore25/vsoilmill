export interface ApiResponse<T> {
  data?: T;
  error?: string | unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
