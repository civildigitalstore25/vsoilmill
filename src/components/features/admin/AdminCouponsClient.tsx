"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Ticket,
  Percent,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  Plus,
  Eye,
  LayoutList,
  Table as TableIcon,
} from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { AdminCouponModal } from "@/components/features/admin/AdminCouponModal";
import { AdminCouponDetailsModal } from "@/components/features/admin/AdminCouponDetailsModal";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import { formatInr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Coupon } from "@/types/coupon";

interface AdminCouponsClientProps {
  initialCoupons: Coupon[];
  categories: Array<{ _id: string; name: string }>;
  products: Array<{ _id: string; name: string; categoryId: string; images?: string[] }>;
  stats?: {
    total: number;
    active: number;
    expired: number;
    totalRedemptions: number;
  };
}

export function AdminCouponsClient({
  initialCoupons,
  categories,
  products,
}: AdminCouponsClientProps) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [viewingCoupon, setViewingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED">("ALL");
  const [viewMode, setViewMode] = useState<"LIST" | "TABLE">("LIST");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep coupons in sync whenever initialCoupons changes
  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  function handleCopy(code: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function openCreateModal() {
    setEditingCoupon(null);
    setModalOpen(true);
  }

  function openEditModal(coupon: Coupon, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setEditingCoupon(coupon);
    setModalOpen(true);
  }

  function openDetailsModal(coupon: Coupon, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setViewingCoupon(coupon);
  }

  function handleSaved(savedCoupon?: Coupon) {
    if (savedCoupon && savedCoupon._id) {
      setCoupons((prev) => {
        const exists = prev.some((c) => c._id === savedCoupon._id);
        if (exists) {
          return prev.map((c) => (c._id === savedCoupon._id ? savedCoupon : c));
        }
        return [savedCoupon, ...prev];
      });
    }
    router.refresh();
  }

  async function handleDelete(id: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_COUPON(id), {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete coupon");
      }
      toast.success("Coupon deleted successfully");
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting coupon");
    } finally {
      setDeletingId(null);
    }
  }

  const now = new Date();

  // Dynamic stats calculated from active state
  const total = coupons.length;
  const active = coupons.filter(
    (c) => c.status === "ACTIVE" && new Date(c.validTo) >= now,
  ).length;
  const expired = coupons.filter((c) => new Date(c.validTo) < now).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.timesUsed || 0), 0);

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const isExpired = new Date(coupon.validTo) < now;
    if (statusFilter === "ACTIVE") {
      return coupon.status === "ACTIVE" && !isExpired;
    }
    if (statusFilter === "INACTIVE") {
      return coupon.status === "INACTIVE";
    }
    if (statusFilter === "EXPIRED") {
      return isExpired;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Coupons"
        description="Create, monitor, and manage promotional discount codes for your customers."
        actions={
          <Button
            onClick={openCreateModal}
            className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Create New Coupon
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminStatCard
          label="Total Coupons"
          value={String(total)}
          hint="All created codes"
          icon={<Ticket className="h-5 w-5" />}
          tone="dark"
        />
        <AdminStatCard
          label="Active Coupons"
          value={String(active)}
          hint="Currently valid"
          icon={<Percent className="h-5 w-5" />}
          tone="primary"
        />
        <AdminStatCard
          label="Expired"
          value={String(expired)}
          hint="Past validity end date"
          icon={<Calendar className="h-5 w-5" />}
          tone="muted"
        />
        <AdminStatCard
          label="Total Redemptions"
          value={String(totalRedemptions)}
          hint="Orders used with coupon"
          icon={<Layers className="h-5 w-5" />}
          tone="accent"
        />
      </div>

      {/* Filter and Search Bar */}
      <AdminCard className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search by coupon code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-cream/40 pl-10 pr-4 py-2 text-sm text-dark placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(
                [
                  { label: "All", value: "ALL" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Inactive", value: "INACTIVE" },
                  { label: "Expired", value: "EXPIRED" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    statusFilter === tab.value
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-cream text-muted hover:bg-cream-dark hover:text-dark"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher: List vs Table */}
            <div className="flex items-center rounded-lg border border-border bg-cream p-1">
              <button
                type="button"
                onClick={() => setViewMode("LIST")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  viewMode === "LIST"
                    ? "bg-white text-dark shadow-xs font-semibold"
                    : "text-muted hover:text-dark",
                )}
                title="List View"
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("TABLE")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  viewMode === "TABLE"
                    ? "bg-white text-dark shadow-xs font-semibold"
                    : "text-muted hover:text-dark",
                )}
                title="Table View"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area: List View vs Table View */}
        <div className="mt-6">
          {filteredCoupons.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-dark text-muted">
                <Ticket className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-semibold text-dark">No coupons found</p>
              <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your search query or status filter to find what you are looking for."
                  : "Click 'Create New Coupon' to add your first promotional discount."}
              </p>
              {!searchQuery && statusFilter === "ALL" && (
                <Button onClick={openCreateModal} className="mt-4 gap-2" size="sm">
                  <Plus className="h-4 w-4" />
                  Add Coupon
                </Button>
              )}
            </div>
          ) : viewMode === "LIST" ? (
            /* ============================================================== */
            /* LIST FORMAT: Rich card list to easily view coupon details       */
            /* ============================================================== */
            <div className="space-y-3.5">
              {filteredCoupons.map((coupon) => {
                const isExpired = new Date(coupon.validTo) < now;
                const isNotStarted = new Date(coupon.validFrom) > now;
                const appProductsCount = coupon.applicableProducts?.length || 0;

                return (
                  <div
                    key={coupon._id}
                    onClick={() => openDetailsModal(coupon)}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/80 bg-white hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                  >
                    {/* Left: Code, Name, Description, Discount */}
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Ticket Icon / Discount Box */}
                      <div className="flex flex-col items-center justify-center h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-primary/10 via-cream to-primary/5 border border-primary/20 text-center p-1">
                        <span className="font-extrabold text-xs text-primary leading-tight">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}%`
                            : formatInr(coupon.discountValue)}
                        </span>
                        <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">
                          OFF
                        </span>
                      </div>

                      {/* Coupon Info */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-base font-bold tracking-wider text-dark bg-cream-dark px-2.5 py-0.5 rounded-lg border border-border/80">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(coupon.code, e)}
                            className="p-1 text-muted hover:text-dark rounded transition-colors"
                            title="Copy Code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <AdminStatusPill
                            active={coupon.status === "ACTIVE" && !isExpired}
                            label={
                              isExpired
                                ? "Expired"
                                : isNotStarted
                                ? "Starts soon"
                                : coupon.status === "ACTIVE"
                                ? "Active"
                                : "Inactive"
                            }
                          />
                        </div>

                        <p className="font-semibold text-dark text-sm truncate">
                          {coupon.name}
                        </p>
                        {coupon.description ? (
                          <p className="text-xs text-muted line-clamp-1 max-w-md">
                            {coupon.description}
                          </p>
                        ) : null}

                        {/* Meta tags */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(coupon.validFrom).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}{" "}
                            –{" "}
                            {new Date(coupon.validTo).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5" />
                            Redeemed:{" "}
                            <strong className="text-dark font-medium">
                              {coupon.timesUsed || 0}
                            </strong>
                            {coupon.usageLimit > 0
                              ? ` / ${coupon.usageLimit}`
                              : " (Unlimited)"}
                          </span>
                          <span>
                            {appProductsCount === 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                Site-wide (All Products)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                                {appProductsCount}{" "}
                                {appProductsCount === 1 ? "Product" : "Products"}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                      <button
                        type="button"
                        onClick={(e) => openDetailsModal(coupon, e)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-dark hover:bg-cream hover:border-dark/30 shadow-2xs transition-all"
                        title="View Coupon Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>View Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => openEditModal(coupon, e)}
                        className="p-2 rounded-lg border border-border text-muted hover:text-dark hover:bg-cream hover:border-dark/30 transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(coupon._id, e)}
                        disabled={deletingId === coupon._id}
                        className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ============================================================== */
            /* TABLE FORMAT: Tabular layout with action buttons               */
            /* ============================================================== */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/80 bg-cream/50 text-xs uppercase tracking-wider text-muted font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Coupon</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4">Validity</th>
                    <th className="py-3.5 px-4">Usage</th>
                    <th className="py-3.5 px-4">Applicable</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCoupons.map((coupon) => {
                    const isExpired = new Date(coupon.validTo) < now;
                    const isNotStarted = new Date(coupon.validFrom) > now;
                    const appProductsCount = coupon.applicableProducts?.length || 0;

                    return (
                      <tr
                        key={coupon._id}
                        onClick={() => openDetailsModal(coupon)}
                        className="transition-colors hover:bg-cream/40 cursor-pointer"
                      >
                        {/* Coupon Code & Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold tracking-wider text-dark bg-cream-dark px-2.5 py-1 rounded-md border border-border/80">
                              {coupon.code}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopy(coupon.code, e)}
                              className="p-1 text-muted hover:text-dark rounded transition-colors"
                              title="Copy Code"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="mt-1 font-medium text-dark text-xs">{coupon.name}</p>
                          {coupon.description ? (
                            <p className="text-[11px] text-muted truncate max-w-[200px]">
                              {coupon.description}
                            </p>
                          ) : null}
                        </td>

                        {/* Discount */}
                        <td className="py-4 px-4 font-semibold text-primary">
                          {coupon.discountType === "PERCENTAGE" ? (
                            <span>{coupon.discountValue}% OFF</span>
                          ) : (
                            <span>{formatInr(coupon.discountValue)} OFF</span>
                          )}
                        </td>

                        {/* Validity */}
                        <td className="py-4 px-4 text-xs text-muted">
                          <div>
                            <span className="text-dark font-medium">
                              {new Date(coupon.validFrom).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                            {" to "}
                            <span
                              className={
                                isExpired ? "text-red-500 font-medium" : "text-dark font-medium"
                              }
                            >
                              {new Date(coupon.validTo).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {isExpired ? (
                            <span className="inline-block mt-0.5 text-[10px] text-red-500 font-semibold uppercase">
                              Expired
                            </span>
                          ) : isNotStarted ? (
                            <span className="inline-block mt-0.5 text-[10px] text-amber-600 font-semibold uppercase">
                              Starts soon
                            </span>
                          ) : (
                            <span className="inline-block mt-0.5 text-[10px] text-emerald-600 font-semibold uppercase">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Usage */}
                        <td className="py-4 px-4 text-xs">
                          <span className="font-semibold text-dark">
                            {coupon.timesUsed || 0}
                          </span>
                          <span className="text-muted">
                            {coupon.usageLimit > 0
                              ? ` / ${coupon.usageLimit} max`
                              : " / Unlimited"}
                          </span>
                        </td>

                        {/* Applicable Products */}
                        <td className="py-4 px-4 text-xs">
                          {appProductsCount === 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                              Site-wide (All)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">
                              {appProductsCount}{" "}
                              {appProductsCount === 1 ? "Product" : "Products"}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <AdminStatusPill
                            active={coupon.status === "ACTIVE" && !isExpired}
                            label={
                              isExpired
                                ? "Expired"
                                : coupon.status === "ACTIVE"
                                ? "Active"
                                : "Inactive"
                            }
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => openDetailsModal(coupon, e)}
                              className="p-1.5 rounded-lg border border-border text-primary hover:bg-primary/10 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => openEditModal(coupon, e)}
                              className="p-1.5 rounded-lg border border-border text-muted hover:text-dark hover:border-dark/30 transition-colors"
                              title="Edit Coupon"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(coupon._id, e)}
                              disabled={deletingId === coupon._id}
                              className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Delete Coupon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Modal 1: Create / Edit Coupon */}
      <AdminCouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        editingCoupon={editingCoupon}
        categories={categories}
        products={products}
      />

      {/* Modal 2: View Coupon Details */}
      <AdminCouponDetailsModal
        isOpen={Boolean(viewingCoupon)}
        coupon={viewingCoupon}
        onClose={() => setViewingCoupon(null)}
        onEdit={(c) => {
          setViewingCoupon(null);
          setEditingCoupon(c);
          setModalOpen(true);
        }}
        onDelete={(id) => handleDelete(id)}
        categories={categories}
        products={products}
      />
    </div>
  );
}
