"use client";

import { Copy, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { CONSIGNMENT_PATTERN } from "@/lib/shipping/st-courier";
import { PaymentStatus } from "@/types/order";

function formatIst(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function readError(res: Response, fallback: string) {
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  return json.error || fallback;
}

export function AdminOrderTrackingCard({
  orderId,
  paymentStatus,
  trackingNumber,
  trackingStatus,
  trackingLastCheckedAt,
}: {
  orderId: string;
  paymentStatus?: string;
  trackingNumber?: string;
  trackingStatus?: string;
  trackingLastCheckedAt?: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(trackingNumber ?? "");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isPaid = paymentStatus === PaymentStatus.PAID;
  const trimmed = value.trim();
  const valid = CONSIGNMENT_PATTERN.test(trimmed);

  async function save() {
    if (!valid) {
      toast.error(ADMIN_ORDERS_COPY.trackingInvalid);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ORDER_TRACKING(orderId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: trimmed }),
      });
      if (!res.ok) {
        toast.error(await readError(res, ADMIN_ORDERS_COPY.trackingSaveFailed));
        return;
      }
      toast.success(ADMIN_ORDERS_COPY.trackingSaved);
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ORDER_TRACKING(orderId), {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error(await readError(res, ADMIN_ORDERS_COPY.trackingDeleteFailed));
        return;
      }
      toast.success(ADMIN_ORDERS_COPY.trackingDeleted);
      setConfirmOpen(false);
      setValue("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function checkNow() {
    setChecking(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ORDER_TRACKING_SYNC(orderId), {
        method: "POST",
      });
      if (!res.ok) {
        toast.error(await readError(res, ADMIN_ORDERS_COPY.trackingCheckFailed));
        return;
      }
      toast.success(ADMIN_ORDERS_COPY.trackingChecked);
      router.refresh();
    } finally {
      setChecking(false);
    }
  }

  async function copyNumber() {
    if (!trackingNumber) return;
    try {
      await navigator.clipboard.writeText(trackingNumber);
      toast.success(ADMIN_ORDERS_COPY.trackingCopied);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-dark">
        {ADMIN_ORDERS_COPY.trackingTitle}
      </h2>

      {!isPaid && !trackingNumber ? (
        <p className="text-sm text-muted">{ADMIN_ORDERS_COPY.trackingPaidOnly}</p>
      ) : null}

      {trackingNumber && !editing ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-dark">
              {ADMIN_ORDERS_COPY.trackingCourier} &middot; {trackingNumber}
            </span>
            <Button size="sm" variant="ghost" type="button" onClick={copyNumber}>
              <Copy className="h-3.5 w-3.5" />
              <span className="sr-only">{ADMIN_ORDERS_COPY.trackingCopy}</span>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={ROUTES.ADMIN.TRACKING(trackingNumber)}>
                {ADMIN_ORDERS_COPY.trackingTrackLink}
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          {trackingStatus || trackingLastCheckedAt ? (
            <p className="text-sm text-muted">
              {trackingStatus ? (
                <>
                  {ADMIN_ORDERS_COPY.trackingLastStatus}:{" "}
                  <span className="font-medium text-dark">{trackingStatus}</span>
                </>
              ) : null}
              {trackingLastCheckedAt ? (
                <>
                  <br />
                  {ADMIN_ORDERS_COPY.trackingLastChecked}: {formatIst(trackingLastCheckedAt)} IST
                </>
              ) : null}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={checking || busy}
              onClick={checkNow}
            >
              {checking ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
              )}
              {checking ? ADMIN_ORDERS_COPY.trackingChecking : ADMIN_ORDERS_COPY.trackingCheckNow}
            </Button>
            {isPaid ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => {
                  setValue(trackingNumber);
                  setEditing(true);
                }}
              >
                {ADMIN_ORDERS_COPY.trackingEdit}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={busy}
              onClick={() => setConfirmOpen(true)}
            >
              {ADMIN_ORDERS_COPY.trackingDelete}
            </Button>
          </div>
        </div>
      ) : null}

      {!trackingNumber && !editing ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">{ADMIN_ORDERS_COPY.trackingNone}</p>
          {isPaid ? (
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
              {ADMIN_ORDERS_COPY.trackingAdd}
            </Button>
          ) : null}
        </div>
      ) : null}

      {editing ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <div>
            <Label htmlFor="st-consignment">{ADMIN_ORDERS_COPY.trackingInputLabel}</Label>
            <Input
              id="st-consignment"
              className="mt-1.5"
              inputMode="numeric"
              autoComplete="off"
              maxLength={11}
              placeholder={ADMIN_ORDERS_COPY.trackingInputPlaceholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {trimmed && !valid ? (
              <p className="mt-1 text-xs text-red-600">{ADMIN_ORDERS_COPY.trackingInvalid}</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={busy || !valid}>
              {busy ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
              {ADMIN_ORDERS_COPY.trackingSave}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setValue(trackingNumber ?? "");
              }}
            >
              {ADMIN_ORDERS_COPY.trackingCancel}
            </Button>
          </div>
        </form>
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ADMIN_ORDERS_COPY.trackingDeleteTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted">{ADMIN_ORDERS_COPY.trackingDeleteBody}</p>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={busy}>
                {ADMIN_ORDERS_COPY.trackingCancel}
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" disabled={busy} onClick={remove}>
              {busy ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}
              {ADMIN_ORDERS_COPY.trackingDelete}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}