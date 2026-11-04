"use client";

import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getStCourierTrackingUrl, ST_COURIER_NAME } from "@/lib/shipping/st-courier";
import type { ShipmentTrackingData } from "@/types/tracking";

const SUMMARY_ROWS: { key: keyof ShipmentTrackingData["summary"]; label: string }[] = [
  { key: "currentStatus", label: "Current status" },
  { key: "origin", label: "Origin" },
  { key: "destination", label: "Destination" },
  { key: "consignment", label: "Consignment" },
  { key: "bookedAt", label: "Booked on" },
  { key: "deliveredAt", label: "Delivered on" },
];

function formatIst(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ShipmentTrackingView({
  endpoint,
  trackingNumber,
  title,
}: {
  endpoint: string;
  trackingNumber: string;
  title?: string;
}) {
  const [data, setData] = useState<ShipmentTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const json = (await res.json().catch(() => ({}))) as {
        data?: ShipmentTrackingData;
        error?: string;
      };
      if (!res.ok || !json.data) {
        setError(json.error || "Couldn't load live status right now");
        return;
      }
      setData(json.data);
    } catch {
      setError("Couldn't load live status right now");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      toast.success("Consignment number copied");
    } catch {
      /* clipboard unavailable */
    }
  }

  const delivered = data?.delivered ?? false;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                delivered ? "bg-emerald-50 text-emerald-700" : "bg-primary/10 text-primary"
              }`}
            >
              {delivered ? <CheckCircle2 className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
            </div>
            <div>
              {title ? <p className="text-xs uppercase tracking-[0.12em] text-muted">{title}</p> : null}
              <p className="font-display text-2xl text-dark">
                {loading && !data ? "Checking status..." : data?.status || "Shipment"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span>
                  {data?.courier || ST_COURIER_NAME} &middot;{" "}
                  <span className="font-mono text-dark">{trackingNumber}</span>
                </span>
                <button
                  type="button"
                  onClick={copyNumber}
                  className="inline-flex items-center text-muted hover:text-primary"
                  aria-label="Copy consignment number"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => void load()}
              className="gap-1.5"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <a
                href={getStCourierTrackingUrl(trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={copyNumber}
              >
                View on ST Courier <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
        {data?.fetchedAt ? (
          <p className="mt-3 text-xs text-muted">Updated {formatIst(data.fetchedAt)} IST</p>
        ) : null}
      </div>

      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </span>
          <Button type="button" size="sm" variant="outline" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      {loading && !data && !error ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-cream/40 px-6 py-12 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Fetching live status from ST Courier...
        </div>
      ) : null}

      {data ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-fit rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h2 className="border-b border-border pb-3 font-display text-lg text-dark">
              Shipment details
            </h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              {SUMMARY_ROWS.filter((row) => data.summary[row.key]).map((row) => (
                <div key={row.key} className="flex justify-between gap-3">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="text-right font-medium text-dark">{data.summary[row.key]}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs md:col-span-2">
            <h2 className="border-b border-border pb-3 font-display text-lg text-dark">
              Tracking history
            </h2>
            {data.events.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No scan events yet.</p>
            ) : (
              <ol className="relative mt-5 space-y-6 border-l-2 border-primary/20 pl-6">
                {data.events.map((event, index) => (
                  <li key={`${event.date}-${event.time}-${index}`} className="relative">
                    <span
                      className={`absolute -left-[33px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        index === 0
                          ? "border-primary bg-primary"
                          : "border-primary/40 bg-cream"
                      }`}
                    />
                    <p className={`text-sm font-semibold ${index === 0 ? "text-primary" : "text-dark"}`}>
                      {event.status}
                    </p>
                    {event.location ? (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-muted">
                      {event.date} &middot; {event.time}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}