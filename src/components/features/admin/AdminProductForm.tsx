"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2, Tag, Layers, Sparkles, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { AdminImageUploader } from "@/components/features/admin/AdminImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/constants/api";
import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/constants/routes";
import type { Category, Product } from "@/types/product";

export function AdminProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [pendingUrl, setPendingUrl] = useState("");

  const initialCategoryId =
    typeof product?.categoryId === "string"
      ? product.categoryId
      : typeof product?.categoryId === "object" && product?.categoryId !== null
        ? (product.categoryId as { _id?: string })._id ?? categories[0]?._id ?? ""
        : categories[0]?._id ?? "";

  const [form, setForm] = useState({
    name: product?.name ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    categoryId: initialCategoryId,
    isActive: product?.isActive ?? true,
    isBestSeller: product?.isBestSeller ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    metaTitle: product?.seo?.metaTitle ?? "",
    metaDescription: product?.seo?.metaDescription ?? "",
    metaKeywords: product?.seo?.metaKeywords?.join(", ") ?? "",
    ogImage: product?.seo?.ogImage ?? "",
  });

  const [variants, setVariants] = useState<
    {
      _id?: string;
      label: string;
      sku: string;
      originalPrice: number;
      price: number;
      stock: number;
    }[]
  >(
    product?.variants?.length
      ? product.variants.map((v) => ({
          _id: v._id,
          label: v.label,
          sku: v.sku,
          originalPrice: v.originalPrice,
          price: v.price,
          stock: v.stock,
        }))
      : [
          {
            label: "1L Bottle",
            sku: "",
            originalPrice: 400,
            price: 350,
            stock: 100,
          },
        ],
  );

  function addVariant(presetLabel = "1L Bottle") {
    setVariants((prev) => [
      ...prev,
      {
        label: presetLabel,
        sku: `${form.name.slice(0, 3).toUpperCase() || "OIL"}-${prev.length + 1}`,
        originalPrice: 400,
        price: 350,
        stock: 50,
      },
    ]);
  }

  function removeVariant(index: number) {
    if (variants.length <= 1) {
      toast.error("Products must have at least 1 variant");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, key: string, value: string | number) {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const allImages = [...images];
    if (pendingUrl.trim()) {
      const cleaned = pendingUrl.trim().replace(/^['"]|['"]$/g, "");
      if (cleaned && !allImages.includes(cleaned)) {
        allImages.push(cleaned);
      }
    }

    const cleanImages = allImages
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);

    const formattedVariants = variants.map((v, i) => ({
      ...(v._id ? { _id: v._id } : {}),
      label: v.label || `Variant ${i + 1}`,
      sku: v.sku || `${form.name.slice(0, 3).toUpperCase() || "PRD"}-${i + 1}`,
      originalPrice: Number(v.originalPrice),
      price: Number(v.price),
      stock: Number(v.stock),
    }));

    const payload = {
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      categoryId: form.categoryId,
      images: cleanImages.length ? cleanImages : [ASSETS.PLACEHOLDER_PRODUCT],
      isActive: form.isActive,
      isBestSeller: form.isBestSeller,
      isNewArrival: form.isNewArrival,
      variants: formattedVariants,
      seo: {
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        metaKeywords: form.metaKeywords
          ? form.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
          : undefined,
        ogImage: form.ogImage || cleanImages[0] || undefined,
      },
    };

    try {
      const res = await fetch(
        product ? API_ENDPOINTS.PRODUCT(product._id) : API_ENDPOINTS.PRODUCTS,
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      toast.success(
        product ? "Product updated successfully" : "Product created successfully",
      );
      router.push(ROUTES.ADMIN.PRODUCTS);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      {/* Basic Details Section */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Tag className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-dark">
            Basic Information
          </h2>
        </div>

        <div>
          <Label htmlFor="name" className="text-sm font-semibold">
            Product Title / Name *
          </Label>
          <Input
            id="name"
            className="mt-1.5 font-medium"
            placeholder="e.g. Wooden Pressed Sesame Oil"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="categoryId" className="text-sm font-semibold">
            Product Category *
          </Label>
          <select
            id="categoryId"
            className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-card px-3 text-sm font-medium"
            value={form.categoryId}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoryId: e.target.value }))
            }
            required
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="shortDescription" className="text-sm font-semibold">
            Short Description / Tagline (Optional)
          </Label>
          <Input
            id="shortDescription"
            className="mt-1.5 text-xs sm:text-sm"
            placeholder="e.g. Traditional Mara Chekku | Gingelly Oil"
            value={form.shortDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, shortDescription: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-semibold">
            Full Description (HTML Allowed) *
          </Label>
          <Textarea
            id="description"
            rows={4}
            className="mt-1.5 text-xs sm:text-sm"
            placeholder="<p>Cold-pressed sesame oil extracted using traditional Mara Chekku mill...</p>"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
        </div>
      </div>

      {/* Product Image Uploader */}
      <AdminImageUploader
        images={images}
        onChange={setImages}
        onPendingUrlChange={setPendingUrl}
      />

      {/* Dynamic Product Variants & Pricing */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-display text-lg font-bold text-dark">
                Product Variants & Pricing
              </h2>
              <p className="text-xs text-muted">
                Add size options (e.g. 100ml, 500ml, 1L Bottle, 5L Can, 15Kg Tin)
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addVariant()}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Variant
          </Button>
        </div>

        {/* Preset size row shortcuts */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="self-center font-medium text-muted mr-1">Quick Add:</span>
          {["100ml", "200ml", "500ml", "1L Bottle", "5L Can", "15Kg Tin"].map(
            (size) => (
              <button
                key={size}
                type="button"
                className="rounded-md border border-border/80 bg-cream/50 px-2.5 py-1 font-medium hover:border-primary hover:text-primary transition"
                onClick={() => addVariant(size)}
              >
                + {size}
              </button>
            ),
          )}
        </div>

        {/* Variants List Table / Grid */}
        <div className="space-y-3 pt-2">
          {variants.map((v, index) => (
            <div
              key={`${v._id || index}-${index}`}
              className="grid gap-3 rounded-lg border border-border/70 bg-cream/30 p-3 sm:grid-cols-12 items-end"
            >
              <div className="sm:col-span-3">
                <Label className="text-xs font-semibold">Variant Label *</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. 1L Bottle"
                  value={v.label}
                  onChange={(e) =>
                    updateVariant(index, "label", e.target.value)
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">SKU</Label>
                <Input
                  className="mt-1 h-9 text-xs uppercase"
                  placeholder="SES-1L"
                  value={v.sku}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">Original Price (₹) *</Label>
                <Input
                  type="number"
                  className="mt-1 h-9 text-xs"
                  value={v.originalPrice}
                  onChange={(e) =>
                    updateVariant(index, "originalPrice", Number(e.target.value))
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">Sale Price (₹) *</Label>
                <Input
                  type="number"
                  className="mt-1 h-9 text-xs font-bold text-dark"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(index, "price", Number(e.target.value))
                  }
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold">Stock Qty *</Label>
                <Input
                  type="number"
                  className="mt-1 h-9 text-xs"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", Number(e.target.value))
                  }
                  required
                />
              </div>

              <div className="sm:col-span-1 flex justify-end pb-0.5">
                <button
                  type="button"
                  aria-label="Remove variant"
                  className="rounded-lg p-2 text-muted hover:bg-destructive/10 hover:text-destructive transition"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storefront Display Badges & Visibility */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-dark">
            Storefront Badges & Menu Displays
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-3 rounded-xl border border-border bg-cream/40 p-3 transition hover:bg-card cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
            />
            <div>
              <span className="text-xs font-bold text-dark block">Active Product</span>
              <span className="text-[11px] text-muted">Visible in public store</span>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 transition hover:bg-amber-500/10 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-amber-600"
              checked={form.isBestSeller}
              onChange={(e) =>
                setForm((f) => ({ ...f, isBestSeller: e.target.checked }))
              }
            />
            <div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Best Seller Menu
              </span>
              <span className="text-[11px] text-muted">Show in Best Sellers tab</span>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 transition hover:bg-emerald-500/10 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-600"
              checked={form.isNewArrival}
              onChange={(e) =>
                setForm((f) => ({ ...f, isNewArrival: e.target.checked }))
              }
            />
            <div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                New Arrival Menu
              </span>
              <span className="text-[11px] text-muted">Show in New Arrivals tab</span>
            </div>
          </label>
        </div>
      </div>

      {/* SEO Metadata Settings */}
      <fieldset className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <legend className="px-2 text-sm font-bold text-dark">SEO Metadata Settings</legend>
        <div>
          <Label htmlFor="metaTitle" className="text-xs font-semibold">Meta Title</Label>
          <Input
            id="metaTitle"
            className="mt-1 text-xs"
            placeholder="Buy Wooden Pressed Sesame Oil Online | VS OilMill"
            value={form.metaTitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, metaTitle: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="metaDescription" className="text-xs font-semibold">Meta Description</Label>
          <Textarea
            id="metaDescription"
            rows={2}
            className="mt-1 text-xs"
            placeholder="Pure Mara Chekku wooden-pressed sesame oil. Free shipping available."
            value={form.metaDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, metaDescription: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="metaKeywords" className="text-xs font-semibold">Meta Keywords (Comma-separated)</Label>
            <Input
              id="metaKeywords"
              className="mt-1 text-xs"
              placeholder="sesame oil, gingelly oil, cold pressed"
              value={form.metaKeywords}
              onChange={(e) =>
                setForm((f) => ({ ...f, metaKeywords: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="ogImage" className="text-xs font-semibold">Social OG Share Image URL</Label>
            <Input
              id="ogImage"
              className="mt-1 text-xs"
              placeholder="Defaults to main product image"
              value={form.ogImage}
              onChange={(e) =>
                setForm((f) => ({ ...f, ogImage: e.target.value }))
              }
            />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3 pt-2">
        <Button disabled={loading} size="lg" className="flex-1 font-bold">
          {loading ? "Saving Product..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push(ROUTES.ADMIN.PRODUCTS)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
