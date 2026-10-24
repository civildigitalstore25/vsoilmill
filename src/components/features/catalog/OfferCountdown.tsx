"use client";

import { useEffect, useState } from "react";
import { CATALOG_COPY } from "@/constants/catalog";

function parts(endsAt: string, now: number) {
  const diff = new Date(endsAt).getTime() - now;
  if (Number.isNaN(diff) || diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function OfferCountdown({
  endsAt,
  compact = false,
}: {
  endsAt: string;
  compact?: boolean;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (now === null) return null;
  const left = parts(endsAt, now);
  if (!left) return null;

  if (compact) {
    const dayPrefix = left.days > 0 ? `${left.days}d ` : "";
    return (
      <p className="text-[10px] font-semibold text-primary">
        {CATALOG_COPY.offerEndsIn} {dayPrefix}
        {pad(left.hours)}:{pad(left.minutes)}:{pad(left.seconds)}
      </p>
    );
  }

  const boxes = [
    [left.days, CATALOG_COPY.offerDays],
    [left.hours, CATALOG_COPY.offerHours],
    [left.minutes, CATALOG_COPY.offerMinutes],
    [left.seconds, CATALOG_COPY.offerSeconds],
  ] as const;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {CATALOG_COPY.offerEndsIn}
      </p>
      <div className="flex gap-2">
        {boxes.map(([value, label]) => (
          <div
            key={label}
            className="flex min-w-14 flex-col items-center rounded-lg bg-primary px-2 py-1.5 text-primary-foreground"
          >
            <span className="text-lg font-semibold leading-none">{pad(value)}</span>
            <span className="mt-1 text-[10px] uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
