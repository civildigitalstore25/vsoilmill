"use client";

import { ManualOrderCustomerFields } from "@/components/features/admin/manual-orders/ManualOrderCustomerFields";
import { ManualOrderItemPickers } from "@/components/features/admin/manual-orders/ManualOrderItemPickers";
import { draftTotal } from "@/components/features/admin/manual-orders/manual-order-draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ACTIONS } from "@/constants/admin";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { useManualOrderForm } from "@/hooks/useManualOrderForm";
import { formatInr } from "@/lib/utils/format";
import type { ManualShipment } from "@/types/manual-shipment";
import type { AdminProductOption } from "@/types/order";

export function AdminManualOrderForm({
  products,
  shipment,
  onCancel,
  onSaved,
}: {
  products: AdminProductOption[];
  shipment?: ManualShipment;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const form = useManualOrderForm({ products, shipment, onSaved });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.submit();
      }}
      className="mx-auto max-w-3xl space-y-6"
    >
      <ManualOrderCustomerFields
        name={form.name}
        phone={form.phone}
        email={form.email}
        onName={form.setName}
        onPhone={form.setPhone}
        onEmail={form.setEmail}
      />

      <ManualOrderItemPickers
        products={products}
        selected={form.selected}
        productId={form.productId}
        variantId={form.variantId}
        qty={form.qty}
        customName={form.customName}
        customPrice={form.customPrice}
        customQty={form.customQty}
        onProductId={(id, firstVariantId) => {
          form.setProductId(id);
          form.setVariantId(firstVariantId);
        }}
        onVariantId={form.setVariantId}
        onQty={form.setQty}
        onCustomName={form.setCustomName}
        onCustomPrice={form.setCustomPrice}
        onCustomQty={form.setCustomQty}
        onAddCatalog={form.addCatalog}
        onAddCustom={form.addCustom}
      />

      {form.items.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {form.items.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-lg bg-cream/50 px-3 py-2"
            >
              <span>{item.label}</span>
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => form.removeItem(item.key)}
              >
                {MANUAL_SHIPMENT_COPY.removeItem}
              </button>
            </li>
          ))}
          <li className="font-semibold text-dark">
            {MANUAL_SHIPMENT_COPY.total}: {formatInr(draftTotal(form.items))}
          </li>
        </ul>
      ) : null}

      {!form.isEdit ? (
        <div>
          <Label htmlFor="mo-awb">{MANUAL_SHIPMENT_COPY.awb}</Label>
          <Input
            id="mo-awb"
            className="mt-1.5 font-mono"
            value={form.awb}
            onChange={(e) => form.setAwb(e.target.value)}
            placeholder="58240292331"
          />
          <p className="mt-1 text-xs text-muted">{MANUAL_SHIPMENT_COPY.awbHint}</p>
        </div>
      ) : null}

      <div>
        <Label htmlFor="mo-notes">{MANUAL_SHIPMENT_COPY.notes}</Label>
        <Input
          id="mo-notes"
          className="mt-1.5"
          value={form.notes}
          onChange={(e) => form.setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={form.loading}>
          {form.loading
            ? form.isEdit
              ? MANUAL_SHIPMENT_COPY.saving
              : MANUAL_SHIPMENT_COPY.creating
            : form.isEdit
              ? MANUAL_SHIPMENT_COPY.saveChanges
              : MANUAL_SHIPMENT_COPY.submit}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onCancel
              ? onCancel()
              : form.router.push(ROUTES.ADMIN.MANUAL_ORDERS)
          }
        >
          {form.isEdit ? MANUAL_SHIPMENT_COPY.cancelEdit : ADMIN_ACTIONS.cancel}
        </Button>
      </div>
    </form>
  );
}
