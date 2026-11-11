"use client";

import { AdminCard } from "@/components/features/admin/AdminUi";
import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { cn } from "@/lib/utils/cn";
import type { WhatsAppProductStat } from "@/types/whatsapp-lead";

export function AdminWhatsAppProductStats({
  products,
  selectedKey,
  onSelect,
}: {
  products: WhatsAppProductStat[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <AdminCard className="mb-6 overflow-hidden p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl text-dark">
            {ADMIN_TRAFFIC_COPY.whatsappByProductTitle}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.whatsappByProductHint}
          </p>
        </div>
        {selectedKey ? (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-dark transition hover:bg-cream"
          >
            {ADMIN_TRAFFIC_COPY.whatsappClearProduct}
          </button>
        ) : null}
      </div>

      {products.length === 0 ? (
        <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
          {ADMIN_TRAFFIC_COPY.whatsappNoProducts}
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const active = selectedKey === product.key;
            return (
              <button
                key={product.key}
                type="button"
                onClick={() => onSelect(active ? null : product.key)}
                className={cn(
                  "rounded-xl border p-4 text-left transition",
                  active
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/70 bg-cream/40 hover:border-primary/40 hover:bg-cream/70",
                )}
              >
                <p className="line-clamp-2 text-sm font-semibold text-dark">
                  {product.name}
                </p>
                <p className="mt-3 text-2xl font-bold text-dark">
                  {product.clicks}
                  <span className="ml-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    {ADMIN_TRAFFIC_COPY.whatsappClicksCount}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted">
                  {product.open} {ADMIN_TRAFFIC_COPY.whatsappOpenCount} ·{" "}
                  {product.ordered} {ADMIN_TRAFFIC_COPY.whatsappOrderedCount}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </AdminCard>
  );
}
