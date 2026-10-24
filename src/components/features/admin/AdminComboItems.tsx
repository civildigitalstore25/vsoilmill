"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATALOG_COPY } from "@/constants/catalog";
import type { Product } from "@/types/product";

export type ComboLine = {
  mode: "existing" | "custom";
  productId: string;
  variantId: string;
  quantity: number;
  customName: string;
  customPrice: string;
  customImage: string;
};

export function emptyComboLine(): ComboLine {
  return {
    mode: "existing",
    productId: "",
    variantId: "",
    quantity: 1,
    customName: "",
    customPrice: "",
    customImage: "",
  };
}

export function AdminComboItems({
  lines,
  products,
  onChange,
}: {
  lines: ComboLine[];
  products: Product[];
  onChange: (lines: ComboLine[]) => void;
}) {
  function update(index: number, patch: Partial<ComboLine>) {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        const variants =
          products.find((product) => product._id === line.productId)?.variants ?? [];
        return (
          <div key={index} className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={line.mode === "existing" ? "default" : "outline"}
                onClick={() => update(index, { mode: "existing" })}
              >
                {CATALOG_COPY.comboExisting}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={line.mode === "custom" ? "default" : "outline"}
                onClick={() => update(index, { mode: "custom" })}
              >
                {CATALOG_COPY.comboNew}
              </Button>
            </div>
            {line.mode === "existing" ? (
              <div className="grid gap-2 sm:grid-cols-3">
                <select
                  className="h-11 rounded-md border border-border bg-card px-3 text-sm"
                  value={line.productId}
                  onChange={(e) =>
                    update(index, { productId: e.target.value, variantId: "" })
                  }
                >
                  <option value="">Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <select
                  className="h-11 rounded-md border border-border bg-card px-3 text-sm"
                  value={line.variantId}
                  onChange={(e) => update(index, { variantId: e.target.value })}
                >
                  <option value="">Variant</option>
                  {variants.map((variant) => (
                    <option key={String(variant._id)} value={String(variant._id)}>
                      {variant.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => update(index, { quantity: Number(e.target.value) })}
                />
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder={CATALOG_COPY.comboCustomName}
                  value={line.customName}
                  onChange={(e) => update(index, { customName: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder={CATALOG_COPY.comboCustomPrice}
                  value={line.customPrice}
                  onChange={(e) => update(index, { customPrice: e.target.value })}
                />
                <Input
                  placeholder={CATALOG_COPY.comboCustomImage}
                  value={line.customImage}
                  onChange={(e) => update(index, { customImage: e.target.value })}
                />
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => update(index, { quantity: Number(e.target.value) })}
                />
              </div>
            )}
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={() => onChange([...lines, emptyComboLine()])}>
        {CATALOG_COPY.comboAddLine}
      </Button>
    </div>
  );
}
