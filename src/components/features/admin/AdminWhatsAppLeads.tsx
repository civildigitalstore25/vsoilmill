"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminOrderFieldSelect } from "@/components/features/admin/AdminOrderFieldSelect";
import { AdminWhatsAppProductStats } from "@/components/features/admin/AdminWhatsAppProductStats";
import { AdminCard } from "@/components/features/admin/AdminUi";
import { ADMIN_TRAFFIC_COPY } from "@/constants/admin-traffic";
import { API_ENDPOINTS } from "@/constants/api";
import {
  WHATSAPP_LEAD_COPY,
  WHATSAPP_LEAD_STATUSES,
} from "@/constants/whatsapp-leads";
import { cn } from "@/lib/utils/cn";
import { formatInr, formatInrDateTime } from "@/lib/utils/format";
import { whatsappLeadStatusClass } from "@/lib/whatsapp-leads/status-styles";
import {
  WhatsAppLeadStatus,
  type WhatsAppLeadRow,
  type WhatsAppProductStat,
} from "@/types/whatsapp-lead";

type StatusFilter = "ALL" | WhatsAppLeadStatus;

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: ADMIN_TRAFFIC_COPY.whatsappFilterAll, value: "ALL" },
  ...WHATSAPP_LEAD_STATUSES.map((status) => ({
    label: status,
    value: status as StatusFilter,
  })),
];

export function AdminWhatsAppLeads({
  leads,
  products,
}: {
  leads: WhatsAppLeadRow[];
  products: WhatsAppProductStat[];
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [productKey, setProductKey] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.key === productKey) ?? null,
    [productKey, products],
  );

  const visible = useMemo(() => {
    return leads.filter((lead) => {
      const statusOk =
        statusFilter === "ALL" || lead.status === statusFilter;
      const productOk =
        !productKey || lead.productKeys.includes(productKey);
      return statusOk && productOk;
    });
  }, [leads, productKey, statusFilter]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(API_ENDPOINTS.ADMIN_WHATSAPP_CLICK(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error(WHATSAPP_LEAD_COPY.updateFailed);
      return;
    }
    toast.success(WHATSAPP_LEAD_COPY.updated);
    router.refresh();
  }

  return (
    <div>
      <AdminWhatsAppProductStats
        products={products}
        selectedKey={productKey}
        onSelect={setProductKey}
      />

      <AdminCard className="overflow-hidden p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl text-dark">
              {ADMIN_TRAFFIC_COPY.whatsappTitle}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {selectedProduct
                ? `${ADMIN_TRAFFIC_COPY.whatsappShowingProduct} ${selectedProduct.name}`
                : ADMIN_TRAFFIC_COPY.whatsappHint}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all",
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-cream text-muted hover:bg-cream-dark hover:text-dark",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {leads.length === 0 ? (
          <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.whatsappEmpty}
          </p>
        ) : visible.length === 0 ? (
          <p className="mt-5 rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
            {ADMIN_TRAFFIC_COPY.whatsappEmptyFilter}
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {visible.map((lead) => (
              <li
                key={lead.id}
                className="rounded-xl border border-border/70 bg-cream/40 p-4 transition hover:border-primary/30 hover:bg-cream/70"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
                          whatsappLeadStatusClass(lead.status),
                        )}
                      >
                        {lead.status}
                      </span>
                      <span className="rounded-md bg-card px-2 py-0.5 text-[11px] font-semibold capitalize text-muted">
                        {lead.context}
                      </span>
                      <span className="text-xs text-muted">
                        {formatInrDateTime(lead.createdAt)}
                      </span>
                    </div>
                    <p className="font-semibold text-dark">{lead.itemsSummary}</p>
                    <p className="text-sm text-dark">
                      {lead.customer}
                      {lead.userEmail ? (
                        <span className="ml-2 font-normal text-muted">
                          {lead.userEmail}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted">
                      {lead.attributionLine} · {lead.pagePath}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                    <p className="text-base font-bold text-dark">
                      {formatInr(lead.estimatedTotal)}
                    </p>
                    <AdminOrderFieldSelect
                      label={WHATSAPP_LEAD_COPY.statusLabel}
                      showLabel={false}
                      value={lead.status}
                      options={WHATSAPP_LEAD_STATUSES}
                      onChange={(status) => updateStatus(lead.id, status)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
