"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Tag,
  Search,
  Layers,
} from "lucide-react";
import { API_ENDPOINTS } from "@/constants/api";
import { formatInr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Coupon, DiscountType, CouponStatus } from "@/types/coupon";

export interface ProductVariantOption {
  _id: string;
  label: string;
  price: number;
  sku?: string;
  stock?: number;
}

export interface ProductOption {
  _id: string;
  name: string;
  categoryId: string;
  images?: string[];
  variants?: ProductVariantOption[];
}

interface CategoryOption {
  _id: string;
  name: string;
}

interface AdminCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedCoupon?: Coupon) => void;
  editingCoupon: Coupon | null;
  categories: CategoryOption[];
  products: ProductOption[];
}

function generateRandomCode(): string {
  const prefixes = ["SAVE", "OFFER", "VSOIL", "SPECIAL", "SUPER", "FESTIVE"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNum = Math.floor(10 + Math.random() * 90);
  return `${randomPrefix}${randomNum}`;
}

function formatDateForInput(dateStr?: string | Date): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

export function AdminCouponModal({
  isOpen,
  onClose,
  onSaved,
  editingCoupon,
  categories,
  products,
}: AdminCouponModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({});
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<CouponStatus>("ACTIVE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCoupon) {
      setCode(editingCoupon.code);
      setName(editingCoupon.name);
      setDescription(editingCoupon.description || "");
      setDiscountType(editingCoupon.discountType);
      setDiscountValue(editingCoupon.discountValue);
      setValidFrom(formatDateForInput(editingCoupon.validFrom));
      setValidTo(formatDateForInput(editingCoupon.validTo));
      setUsageLimit(editingCoupon.usageLimit ?? 0);
      setSelectedProductIds(
        (editingCoupon.applicableProducts || []).map((p: string | { _id: string }) =>
          typeof p === "string" ? p : p._id,
        ),
      );
      setSelectedVariantIds(
        (editingCoupon.applicableVariants || []).map((v) => String(v)),
      );
      setStatus(editingCoupon.status);
    } else {
      // Default new coupon values
      const now = new Date();
      const inOneMonth = new Date();
      inOneMonth.setMonth(now.getMonth() + 1);

      setCode(generateRandomCode());
      setName("");
      setDescription("");
      setDiscountType("PERCENTAGE");
      setDiscountValue(10);
      setValidFrom(formatDateForInput(now));
      setValidTo(formatDateForInput(inOneMonth));
      setUsageLimit(100);
      setSelectedProductIds([]);
      setSelectedVariantIds([]);
      setStatus("ACTIVE");
    }
  }, [editingCoupon, isOpen]);

  if (!isOpen) return null;

  function handleGenerateCode() {
    setCode(generateRandomCode());
  }

  function toggleProduct(productId: string) {
    const prod = products.find((p) => p._id === productId);
    const variants = prod?.variants || [];
    const prodVariantIds = variants.map((v) => v._id);

    const isProdSelected = selectedProductIds.includes(productId);
    const allVariantsSelected =
      prodVariantIds.length > 0 &&
      prodVariantIds.every((vId) => selectedVariantIds.includes(vId));

    if (isProdSelected && (allVariantsSelected || prodVariantIds.length === 0)) {
      // Deselect product and all its variants
      setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
      if (prodVariantIds.length > 0) {
        setSelectedVariantIds((prev) =>
          prev.filter((vId) => !prodVariantIds.includes(vId)),
        );
      }
    } else {
      // Select product and all its variants
      if (!isProdSelected) {
        setSelectedProductIds((prev) => [...prev, productId]);
      }
      if (prodVariantIds.length > 0) {
        setSelectedVariantIds((prev) => [
          ...prev.filter((vId) => !prodVariantIds.includes(vId)),
          ...prodVariantIds,
        ]);
      }
    }
  }

  function toggleVariant(productId: string, variantId: string) {
    if (selectedVariantIds.includes(variantId)) {
      const nextVariants = selectedVariantIds.filter((id) => id !== variantId);
      setSelectedVariantIds(nextVariants);

      const prod = products.find((p) => p._id === productId);
      const prodVariantIds = (prod?.variants || []).map((v) => v._id);
      const anyRemainingInProduct = prodVariantIds.some((vId) =>
        nextVariants.includes(vId),
      );
      if (!anyRemainingInProduct) {
        setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
      }
    } else {
      setSelectedVariantIds((prev) => [...prev, variantId]);
      if (!selectedProductIds.includes(productId)) {
        setSelectedProductIds((prev) => [...prev, productId]);
      }
    }
  }

  function removeProductChip(productId: string) {
    const prod = products.find((p) => p._id === productId);
    const prodVariantIds = (prod?.variants || []).map((v) => v._id);
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    setSelectedVariantIds((prev) =>
      prev.filter((vId) => !prodVariantIds.includes(vId)),
    );
  }

  function removeVariantChip(productId: string, variantId: string) {
    toggleVariant(productId, variantId);
  }

  function handleSelectAllProducts() {
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
      setSelectedVariantIds([]);
    } else {
      setSelectedProductIds(products.map((p) => p._id));
      const allVariantIds = products.flatMap((p) =>
        (p.variants || []).map((v) => v._id),
      );
      setSelectedVariantIds(allVariantIds);
    }
  }

  function handleSetSiteWide() {
    setSelectedProductIds([]);
    setSelectedVariantIds([]);
  }

  function toggleCategoryCollapse(categoryId: string) {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }

  function toggleExpandProduct(productId: string) {
    setExpandedProductIds((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  }

  const visibleCategories =
    selectedCategoryFilter === "ALL"
      ? categories
      : categories.filter((c) => c._id === selectedCategoryFilter);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter or generate a coupon code");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter a coupon name");
      return;
    }
    if (!validFrom || !validTo) {
      toast.error("Please provide valid from and to dates");
      return;
    }
    if (new Date(validFrom) > new Date(validTo)) {
      toast.error("Valid From date cannot be after Valid To date");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        validFrom: new Date(validFrom).toISOString(),
        validTo: new Date(validTo).toISOString(),
        usageLimit: Number(usageLimit),
        applicableProducts: selectedProductIds,
        applicableVariants: selectedVariantIds,
        status,
      };

      const url = editingCoupon
        ? API_ENDPOINTS.ADMIN_COUPON(editingCoupon._id)
        : API_ENDPOINTS.ADMIN_COUPONS;
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to save coupon");
      }

      toast.success(
        editingCoupon ? "Coupon updated successfully" : "Coupon created successfully",
      );
      onSaved(json.data);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error saving coupon");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer on Right Side */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col overflow-hidden text-[#1e293b]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-white sticky top-0 z-10">
            <h2 className="font-display text-xl font-bold text-[#0f2a4a]">
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[#0284c7] p-1.5 text-white hover:bg-[#0369a1] transition-colors shadow-xs"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm"
          >
            {/* Coupon Code * with Generate Button */}
            <div>
              <label className="block font-semibold text-[#1e293b] mb-1.5">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE2024"
                  className="flex-1 rounded-lg border border-[#cbd5e1] px-3.5 py-2.5 text-sm uppercase font-mono tracking-wider focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all placeholder:normal-case placeholder:font-sans placeholder:text-[#94a3b8]"
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white font-medium text-xs sm:text-sm shadow-xs hover:from-[#0369a1] hover:to-[#075985] active:scale-95 transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
                  Generate
                </button>
              </div>
            </div>

            {/* Coupon Name * */}
            <div>
              <label className="block font-semibold text-[#1e293b] mb-1.5">
                Coupon Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Sale 2025"
                className="w-full rounded-lg border border-[#cbd5e1] px-3.5 py-2.5 text-sm focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all placeholder:text-[#94a3b8]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-[#1e293b] mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter coupon description..."
                className="w-full rounded-lg border border-[#cbd5e1] p-3 text-sm focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all placeholder:text-[#94a3b8] resize-none"
              />
            </div>

            {/* Discount Type & Value Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1.5">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1.5">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={discountType === "PERCENTAGE" ? 100 : undefined}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-[#64748b]">
                    {discountType === "PERCENTAGE" ? "%" : "₹"}
                  </span>
                </div>
              </div>
            </div>

            {/* Valid From & Valid To Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1.5">
                  Valid From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1.5">
                  Valid To <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block font-semibold text-[#1e293b] mb-1.5">
                Usage Limit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-[#cbd5e1] px-3.5 py-2.5 text-sm focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
              />
              <p className="mt-1 text-xs text-[#64748b] leading-relaxed">
                Maximum number of times this coupon can be used. Coupon will
                automatically deactivate when limit is reached. (Enter 0 for
                unlimited).
              </p>
            </div>

            {/* Applicable Products & Variants */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-[#1e293b]">
                    Applicable products & sizes
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSetSiteWide}
                      className={cn(
                        "text-xs px-2.5 py-1 rounded-md font-medium transition-colors",
                        selectedProductIds.length === 0
                          ? "bg-emerald-100 text-emerald-800 font-semibold"
                          : "text-[#0284c7] hover:underline",
                      )}
                    >
                      Site-wide (All)
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectAllProducts}
                      className="text-xs text-[#0284c7] hover:underline font-medium px-2 py-1"
                    >
                      {selectedProductIds.length === products.length
                        ? "Clear all"
                        : "Select all"}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-[#64748b] leading-relaxed">
                  Leave empty for site-wide. Or select specific products and variants (e.g. 1 Litre, 500 ml).
                </p>
              </div>

              {/* Selected Items Chips */}
              {selectedProductIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] max-h-28 overflow-y-auto">
                  {selectedProductIds.map((pId) => {
                    const prod = products.find((p) => p._id === pId);
                    if (!prod) return null;
                    const variants = prod.variants || [];
                    const selectedVarsInProd = variants.filter((v) =>
                      selectedVariantIds.includes(v._id),
                    );

                    // If all variants or no specific variants were picked for this product
                    if (
                      variants.length === 0 ||
                      selectedVarsInProd.length === variants.length ||
                      (selectedVariantIds.length === 0 && selectedVarsInProd.length === 0)
                    ) {
                      return (
                        <span
                          key={`prod-${pId}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[#e0f2fe] text-[#0369a1] font-medium border border-[#bae6fd]"
                        >
                          <Tag className="h-3 w-3 shrink-0" />
                          <span className="max-w-[160px] truncate">
                            {prod.name} {variants.length > 0 ? `(All ${variants.length} sizes)` : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProductChip(pId)}
                            className="hover:text-red-600 rounded-full p-0.5"
                            aria-label={`Remove ${prod.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    }

                    // Otherwise show individual chips for each selected variant
                    return selectedVarsInProd.map((v) => (
                      <span
                        key={`var-${v._id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-amber-50 text-amber-900 font-medium border border-amber-200"
                      >
                        <Layers className="h-3 w-3 shrink-0 text-amber-600" />
                        <span className="max-w-[180px] truncate">
                          {prod.name} • <strong>{v.label}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariantChip(pId, v._id)}
                          className="hover:text-red-600 rounded-full p-0.5"
                          aria-label={`Remove ${v.label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ));
                  })}
                </div>
              )}

              {/* Search & Category Filter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="Filter product or size (e.g. 1L)..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#cbd5e1] bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="absolute right-2.5 top-2.5 text-[#94a3b8] hover:text-[#334155]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full rounded-lg border border-[#cbd5e1] px-3 py-1.5 text-xs bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
                >
                  <option value="ALL">All categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products & Variants List */}
              <div className="border border-[#cbd5e1] rounded-lg max-h-64 overflow-y-auto divide-y divide-[#e2e8f0] bg-white shadow-2xs">
                {visibleCategories.map((cat) => {
                  const query = productSearch.toLowerCase().trim();
                  const catProducts = products.filter((p) => {
                    if (String(p.categoryId) !== String(cat._id)) return false;
                    if (!query) return true;
                    const nameMatches = p.name.toLowerCase().includes(query);
                    const variantMatches = (p.variants || []).some((v) =>
                      v.label.toLowerCase().includes(query) ||
                      (v.sku && v.sku.toLowerCase().includes(query)),
                    );
                    return nameMatches || variantMatches;
                  });

                  if (catProducts.length === 0) return null;
                  const isCatCollapsed = Boolean(collapsedCategories[cat._id]);

                  return (
                    <div key={cat._id} className="bg-white">
                      {/* Category Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategoryCollapse(cat._id)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-[#f8fafc] text-left hover:bg-[#f1f5f9] transition-colors"
                      >
                        <span className="font-semibold text-xs tracking-wider uppercase text-[#334155]">
                          {cat.name} ({catProducts.length})
                        </span>
                        {isCatCollapsed ? (
                          <ChevronDown className="h-4 w-4 text-[#64748b]" />
                        ) : (
                          <ChevronUp className="h-4 w-4 text-[#64748b]" />
                        )}
                      </button>

                      {/* Products List */}
                      {!isCatCollapsed && (
                        <div className="px-3 py-1.5 space-y-2">
                          {catProducts.map((prod) => {
                            const isProdChecked = selectedProductIds.includes(prod._id);
                            const variants = prod.variants || [];
                            const selectedVarsInProd = variants.filter((v) =>
                              selectedVariantIds.includes(v._id),
                            );
                            const allVariantsSelected =
                              variants.length > 0 &&
                              selectedVarsInProd.length === variants.length;
                            const isPartiallySelected =
                              variants.length > 0 &&
                              selectedVarsInProd.length > 0 &&
                              selectedVarsInProd.length < variants.length;
                            const isExpanded =
                              expandedProductIds[prod._id] ?? (selectedVarsInProd.length > 0 || Boolean(query));

                            return (
                              <div
                                key={prod._id}
                                className={cn(
                                  "rounded-lg border transition-colors",
                                  isProdChecked
                                    ? "border-[#0284c7]/40 bg-[#f0f9ff]/40"
                                    : "border-[#e2e8f0] bg-white",
                                )}
                              >
                                {/* Product Row */}
                                <div className="flex items-center justify-between p-2">
                                  <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-[#1e293b] flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isProdChecked && (allVariantsSelected || variants.length === 0)}
                                      ref={(el) => {
                                        if (el) el.indeterminate = isPartiallySelected;
                                      }}
                                      onChange={() => toggleProduct(prod._id)}
                                      className="h-4 w-4 rounded border-[#cbd5e1] text-[#0284c7] focus:ring-[#0284c7]"
                                    />
                                    <span className="font-medium truncate">{prod.name}</span>
                                    {variants.length > 0 && (
                                      <span
                                        className={cn(
                                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                                          isPartiallySelected
                                            ? "bg-amber-100 text-amber-800"
                                            : allVariantsSelected
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-slate-100 text-slate-600",
                                        )}
                                      >
                                        {selectedVarsInProd.length > 0
                                          ? `${selectedVarsInProd.length}/${variants.length} selected`
                                          : `${variants.length} sizes`}
                                      </span>
                                    )}
                                  </label>

                                  {variants.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleExpandProduct(prod._id)}
                                      className="p-1 text-[#64748b] hover:text-[#0284c7] hover:bg-[#e0f2fe] rounded transition-colors text-xs flex items-center gap-1"
                                      title={isExpanded ? "Collapse sizes" : "Expand sizes"}
                                    >
                                      <span className="text-[11px] font-semibold text-[#0284c7]">
                                        {isExpanded ? "Hide sizes" : "Choose sizes"}
                                      </span>
                                      {isExpanded ? (
                                        <ChevronUp className="h-3.5 w-3.5" />
                                      ) : (
                                        <ChevronDown className="h-3.5 w-3.5" />
                                      )}
                                    </button>
                                  )}
                                </div>

                                {/* Variants Sub-list */}
                                {variants.length > 0 && isExpanded && (
                                  <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 space-y-1.5 rounded-b-lg">
                                    <p className="text-[11px] text-[#64748b] font-medium mb-1 flex items-center justify-between">
                                      <span>Select specific sizes:</span>
                                      <button
                                        type="button"
                                        onClick={() => toggleProduct(prod._id)}
                                        className="text-[#0284c7] hover:underline text-[10px] font-semibold"
                                      >
                                        {allVariantsSelected ? "Deselect all sizes" : "Select all sizes"}
                                      </button>
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {variants.map((v) => {
                                        const isVariantChecked = selectedVariantIds.includes(v._id);
                                        return (
                                          <label
                                            key={v._id}
                                            className={cn(
                                              "flex items-center justify-between p-1.5 rounded border text-xs cursor-pointer transition-colors",
                                              isVariantChecked
                                                ? "border-[#0284c7] bg-white text-[#0369a1] font-semibold shadow-2xs"
                                                : "border-[#e2e8f0] bg-white hover:bg-slate-50 text-[#334155]",
                                            )}
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <input
                                                type="checkbox"
                                                checked={isVariantChecked}
                                                onChange={() => toggleVariant(prod._id, v._id)}
                                                className="h-3.5 w-3.5 rounded border-[#cbd5e1] text-[#0284c7] focus:ring-[#0284c7]"
                                              />
                                              <span className="truncate">{v.label}</span>
                                            </div>
                                            <span className="text-[11px] font-mono text-[#64748b] ml-1 shrink-0">
                                              {formatInr(v.price)}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status * */}
            <div>
              <label className="block font-semibold text-[#1e293b] mb-1.5">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CouponStatus)}
                className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2.5 text-sm bg-white focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 outline-none transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Bottom space */}
            <div className="h-4" />
          </form>

          {/* Modal Footer with Cancel & Add/Save buttons */}
          <div className="border-t border-border/80 px-6 py-4 bg-white flex justify-end gap-3 sticky bottom-0 z-10 shadow-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-[#0284c7] text-[#0284c7] bg-white font-medium text-sm hover:bg-[#e0f2fe] active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#004b87] text-white font-medium text-sm shadow-sm hover:bg-[#003866] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading
                ? "Saving…"
                : editingCoupon
                ? "Save Changes"
                : "Add Coupon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
