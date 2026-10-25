"use client";

import { Box, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATALOG_COPY } from "@/constants/catalog";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product";

export type ComboLine = {
  mode: "existing" | "custom";
  productId: string;
  variantMode?: "existing" | "custom";
  variantId: string;
  quantity: number;
  customName: string;
  customVariantLabel: string;
  customPrice: string;
  customImage: string;
};

export function emptyComboLine(): ComboLine {
  return {
    mode: "existing",
    productId: "",
    variantMode: "existing",
    variantId: "",
    quantity: 1,
    customName: "",
    customVariantLabel: "",
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

  function remove(index: number) {
    if (lines.length <= 1) {
      onChange([emptyComboLine()]);
      return;
    }
    onChange(lines.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        const product = products.find((entry) => entry._id === line.productId);
        const variants = product?.variants ?? [];
        const isCustomVariant = line.variantMode === "custom";

        return (
          <div
            key={index}
            className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-2xs transition"
          >
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  Item #{index + 1}
                </span>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={line.mode === "existing" ? "default" : "outline"}
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => update(index, { mode: "existing" })}
                  >
                    <Box className="h-3.5 w-3.5" />
                    {CATALOG_COPY.comboExisting}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={line.mode === "custom" ? "default" : "outline"}
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => update(index, { mode: "custom" })}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {CATALOG_COPY.comboNew}
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => remove(index)}
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>

            {/* Mode: Existing Product */}
            {line.mode === "existing" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-dark">
                    Select Product *
                  </Label>
                  <select
                    className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={line.productId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const prod = products.find((p) => p._id === selectedId);
                      const defaultVariant = prod?.variants?.[0];
                      update(index, {
                        productId: selectedId,
                        variantId: defaultVariant ? String(defaultVariant._id) : "",
                        variantMode: "existing",
                        customVariantLabel: "",
                        customPrice: defaultVariant ? String(defaultVariant.price) : "",
                      });
                    }}
                  >
                    <option value="">-- Choose a product from catalog --</option>
                    {products.map((entry) => (
                      <option key={entry._id} value={entry._id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                </div>

                {line.productId && product ? (
                  <div className="space-y-2 rounded-lg border border-border/80 bg-cream/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Label className="text-xs font-semibold text-dark">
                        Variant for {product.name} *
                      </Label>
                      <div className="inline-flex rounded-lg border border-border bg-card p-0.5 text-xs shadow-2xs">
                        <button
                          type="button"
                          onClick={() => update(index, { variantMode: "existing" })}
                          className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition",
                            !isCustomVariant
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted hover:text-dark",
                          )}
                        >
                          Existing Variant ({variants.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => update(index, { variantMode: "custom" })}
                          className={cn(
                            "rounded-md px-2.5 py-1 font-medium transition",
                            isCustomVariant
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted hover:text-dark",
                          )}
                        >
                          + Add New Variant
                        </button>
                      </div>
                    </div>

                    {!isCustomVariant ? (
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1 sm:col-span-2">
                          <select
                            className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            value={line.variantId}
                            onChange={(e) => {
                              if (e.target.value === "__add_new_variant__") {
                                update(index, { variantMode: "custom" });
                              } else {
                                const selectedVariant = variants.find(
                                  (v) => String(v._id) === e.target.value,
                                );
                                update(index, {
                                  variantId: e.target.value,
                                  customPrice: selectedVariant
                                    ? String(selectedVariant.price)
                                    : line.customPrice,
                                });
                              }
                            }}
                          >
                            <option value="">-- Choose existing variant --</option>
                            {variants.map((variant) => (
                              <option key={String(variant._id)} value={String(variant._id)}>
                                {variant.label} — ₹{variant.price} (Stock: {variant.stock})
                              </option>
                            ))}
                            <option value="__add_new_variant__">
                              + Add new variant for this product...
                            </option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Input
                            type="number"
                            min={1}
                            placeholder="Quantity"
                            value={line.quantity}
                            onChange={(e) =>
                              update(index, { quantity: Math.max(1, Number(e.target.value)) })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1">
                        <p className="text-xs text-muted">
                          Define a new / custom variant for <strong>{product.name}</strong> for this combo bundle.
                        </p>
                        <div className="grid gap-2 sm:grid-cols-4">
                          <div className="sm:col-span-2">
                            <Input
                              placeholder="Variant label / size * (e.g. 500ml pouch, 250ml sample)"
                              value={line.customVariantLabel}
                              onChange={(e) =>
                                update(index, { customVariantLabel: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Price ₹ (optional)"
                              value={line.customPrice}
                              onChange={(e) =>
                                update(index, { customPrice: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Quantity *"
                              value={line.quantity}
                              onChange={(e) =>
                                update(index, {
                                  quantity: Math.max(1, Number(e.target.value)),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-1">
                          <Input
                            placeholder="Variant image URL (optional, defaults to product image)"
                            value={line.customImage}
                            onChange={(e) => update(index, { customImage: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              /* Mode: Add New Product & Variant */
              <div className="space-y-3 rounded-lg border border-border/80 bg-cream/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Add a new product with its variant for this combo bundle</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1 block text-xs font-semibold text-dark">
                      Product Name *
                    </Label>
                    <Input
                      placeholder="Product name (e.g. Pure Cold Pressed Sesame Oil)"
                      value={line.customName}
                      onChange={(e) => update(index, { customName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs font-semibold text-dark">
                      Variant Label / Size *
                    </Label>
                    <Input
                      placeholder="Variant label (e.g. 1 Litre, 500ml Bottle)"
                      value={line.customVariantLabel}
                      onChange={(e) =>
                        update(index, { customVariantLabel: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs font-semibold text-dark">
                      Selling Price (₹)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Price ₹ (e.g. 299)"
                      value={line.customPrice}
                      onChange={(e) => update(index, { customPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs font-semibold text-dark">
                      Quantity *
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Quantity"
                      value={line.quantity}
                      onChange={(e) =>
                        update(index, {
                          quantity: Math.max(1, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-semibold text-dark">
                    Image URL (optional)
                  </Label>
                  <Input
                    placeholder="https://... Image URL (ImageKit, Cloudinary, etc.)"
                    value={line.customImage}
                    onChange={(e) => update(index, { customImage: e.target.value })}
                  />
                </div>
                {line.customImage ? (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-cream-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={line.customImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted">Thumbnail preview</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...lines, emptyComboLine()])}
        className="w-full gap-2 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        {CATALOG_COPY.comboAddLine}
      </Button>
    </div>
  );
}
