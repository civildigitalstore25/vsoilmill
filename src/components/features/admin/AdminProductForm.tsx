"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    variantLabel: product?.variants[0]?.label ?? "1L Bottle",
    sku: product?.variants[0]?.sku ?? "",
    originalPrice: product?.variants[0]?.originalPrice ?? 0,
    price: product?.variants[0]?.price ?? 0,
    stock: product?.variants[0]?.stock ?? 0,
    metaTitle: product?.seo?.metaTitle ?? "",
    metaDescription: product?.seo?.metaDescription ?? "",
    metaKeywords: product?.seo?.metaKeywords?.join(", ") ?? "",
    ogImage: product?.seo?.ogImage ?? "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const cleanImages = images.map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      categoryId: form.categoryId,
      images: cleanImages.length ? cleanImages : [ASSETS.PLACEHOLDER_PRODUCT],
      isActive: form.isActive,
      isBestSeller: form.isBestSeller,
      isNewArrival: form.isNewArrival,
      variants: [
        {
          label: form.variantLabel,
          sku: form.sku || `${form.name.slice(0, 3).toUpperCase()}-1`,
          originalPrice: Number(form.originalPrice),
          price: Number(form.price),
          stock: Number(form.stock),
          ...(product?.variants[0]?._id
            ? { _id: product.variants[0]._id }
            : {}),
        },
        ...(product?.variants.slice(1) ?? []),
      ],
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
      toast.success(product ? "Product updated successfully" : "Product created successfully");
      router.push(ROUTES.ADMIN.PRODUCTS);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          className="mt-1.5"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-card px-3 text-sm"
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
        <Label htmlFor="shortDescription">Short description</Label>
        <Input
          id="shortDescription"
          className="mt-1.5"
          value={form.shortDescription}
          onChange={(e) =>
            setForm((f) => ({ ...f, shortDescription: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="description">Description (HTML allowed)</Label>
        <Textarea
          id="description"
          className="mt-1.5"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          required
        />
      </div>

      <AdminImageUploader images={images} onChange={setImages} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="variantLabel">Primary variant label</Label>
          <Input
            id="variantLabel"
            className="mt-1.5"
            value={form.variantLabel}
            onChange={(e) =>
              setForm((f) => ({ ...f, variantLabel: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            className="mt-1.5"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original price</Label>
          <Input
            id="originalPrice"
            type="number"
            className="mt-1.5"
            value={form.originalPrice}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                originalPrice: Number(e.target.value),
              }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            className="mt-1.5"
            value={form.price}
            onChange={(e) =>
              setForm((f) => ({ ...f, price: Number(e.target.value) }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            className="mt-1.5"
            value={form.stock}
            onChange={(e) =>
              setForm((f) => ({ ...f, stock: Number(e.target.value) }))
            }
            required
          />
        </div>
      </div>

      <fieldset className="space-y-3 rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-semibold">SEO</legend>
        <div>
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input
            id="metaTitle"
            className="mt-1.5"
            value={form.metaTitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, metaTitle: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="metaDescription">Meta description</Label>
          <Textarea
            id="metaDescription"
            className="mt-1.5"
            value={form.metaDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, metaDescription: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="metaKeywords">Meta keywords (comma-separated)</Label>
          <Input
            id="metaKeywords"
            className="mt-1.5"
            value={form.metaKeywords}
            onChange={(e) =>
              setForm((f) => ({ ...f, metaKeywords: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="ogImage">OG image URL (optional)</Label>
          <Input
            id="ogImage"
            className="mt-1.5"
            placeholder="Defaults to first product image"
            value={form.ogImage}
            onChange={(e) =>
              setForm((f) => ({ ...f, ogImage: e.target.value }))
            }
          />
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-4 text-sm">
        {(
          [
            ["isActive", "Active"],
            ["isBestSeller", "Best seller"],
            ["isNewArrival", "New arrival"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.checked }))
              }
            />
            {label}
          </label>
        ))}
      </div>

      <Button disabled={loading}>{loading ? "Saving…" : "Save product"}</Button>
    </form>
  );
}
