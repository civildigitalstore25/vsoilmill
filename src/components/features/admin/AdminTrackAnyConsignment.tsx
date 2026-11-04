"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import { CONSIGNMENT_PATTERN } from "@/lib/shipping/st-courier";

export function AdminTrackAnyConsignment({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const trimmed = value.trim();
  const valid = CONSIGNMENT_PATTERN.test(trimmed);

  function open() {
    if (!valid) {
      toast.error(ADMIN_ORDERS_COPY.trackingInvalid);
      return;
    }
    router.push(ROUTES.ADMIN.TRACKING(trimmed));
  }

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        open();
      }}
    >
      <div>
        <Label htmlFor="track-any-consignment" className="text-xs">
          {ADMIN_ORDERS_COPY.trackAnyLabel}
        </Label>
        <Input
          id="track-any-consignment"
          className="mt-1 w-56"
          inputMode="numeric"
          autoComplete="off"
          maxLength={11}
          placeholder={ADMIN_ORDERS_COPY.trackingInputPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" variant="outline" disabled={!valid} className="gap-1.5">
        <Search className="h-3.5 w-3.5" />
        {ADMIN_ORDERS_COPY.trackAnyButton}
      </Button>
    </form>
  );
}