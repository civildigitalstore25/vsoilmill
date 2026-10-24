"use client";

import { useEffect, useState } from "react";
import { ADMIN_PAGE_SIZES } from "@/constants/admin-list";
import type { AdminListFilter } from "@/types/admin-list";

export function useAdminList<T>(
  items: T[],
  searchText: (item: T) => string,
  filters: AdminListFilter<T>[] = [],
) {
  const [query, setQueryState] = useState("");
  const [pageSize, setPageSizeState] = useState<number>(ADMIN_PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const filtered = items.filter((item) => {
    const text = query.trim().toLowerCase();
    if (text && !searchText(item).toLowerCase().includes(text)) return false;
    return filters.every((filter) => {
      const value = selected[filter.id] ?? "";
      return value ? filter.match(item, value) : true;
    });
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, filtered.length);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function setQuery(value: string) {
    setQueryState(value);
    setPage(1);
  }

  function setPageSize(value: number) {
    setPageSizeState(value);
    setPage(1);
  }

  return {
    pageItems,
    query,
    setQuery,
    pageSize,
    setPageSize,
    page: currentPage,
    setPage,
    pageCount,
    total: filtered.length,
    from,
    to,
    noMatches: items.length > 0 && filtered.length === 0,
    filters: filters.map((filter) => ({
      id: filter.id,
      label: filter.label,
      allLabel: filter.allLabel,
      value: selected[filter.id] ?? "",
      options: filter.options,
      setValue: (value: string) => {
        setSelected((current) => ({ ...current, [filter.id]: value }));
        setPage(1);
      },
    })),
  };
}
