"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Images } from "lucide-react";
import { toast } from "sonner";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import {
  AdminAddButton,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/features/admin/AdminUi";
import { CarouselSlideForm } from "@/components/features/admin/carousels/CarouselSlideForm";
import { CarouselSlidesTable } from "@/components/features/admin/carousels/CarouselSlidesTable";
import { DeleteCarouselDialog } from "@/components/features/admin/carousels/DeleteCarouselDialog";
import { ADMIN_CAROUSEL_COPY } from "@/constants/admin";
import { ADMIN_ACTIVE_OPTIONS, ADMIN_LIST } from "@/constants/admin-list";
import { API_ENDPOINTS } from "@/constants/api";
import { useAdminList } from "@/hooks/useAdminList";
import type { CarouselSlide } from "@/types/carousel";

interface AdminCarouselsClientProps {
  initialSlides: CarouselSlide[];
}

export function AdminCarouselsClient({
  initialSlides,
}: AdminCarouselsClientProps) {
  const router = useRouter();
  const [slides, setSlides] = useState<CarouselSlide[]>(initialSlides);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<CarouselSlide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state if initialSlides change after SSR refresh
  if (slides !== initialSlides && initialSlides) {
    setSlides(initialSlides);
  }

  function openCreate() {
    setEditingSlide(null);
    setFormOpen(true);
  }

  function openEdit(slide: CarouselSlide) {
    setEditingSlide(slide);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingSlide(null);
  }

  async function handleDeleteConfirm() {
    if (!deletingSlide) return;

    setIsDeleting(true);
    try {
      const res = await fetch(API_ENDPOINTS.CAROUSEL(deletingSlide._id), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete slide");
      }

      toast.success(ADMIN_CAROUSEL_COPY.deleted);
      setDeletingSlide(null);
      router.refresh();
    } catch {
      toast.error(ADMIN_CAROUSEL_COPY.deleteFailed);
    } finally {
      setIsDeleting(false);
    }
  }

  const list = useAdminList(
    slides,
    (slide) => `${slide.headline ?? ""} ${slide.subheadline ?? ""}`,
    [
      {
        id: "status",
        label: ADMIN_LIST.status,
        allLabel: ADMIN_LIST.all,
        options: ADMIN_ACTIVE_OPTIONS,
        match: (slide, value) => (value === "inactive" ? !slide.isActive : slide.isActive),
      },
    ],
  );
  const activeCount = slides.filter((s) => s.isActive).length;
  const inactiveCount = slides.length - activeCount;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={ADMIN_CAROUSEL_COPY.title}
        description={ADMIN_CAROUSEL_COPY.description}
        actions={
          <AdminAddButton
            label={ADMIN_CAROUSEL_COPY.addButton}
            onClick={openCreate}
          />
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Total Slides"
          value={slides.length.toString()}
          hint="All configured slides"
          icon={<Images className="h-5 w-5" />}
          tone="dark"
        />
        <AdminStatCard
          label="Active Slides"
          value={activeCount.toString()}
          hint="Visible in homepage hero"
          icon={<Eye className="h-5 w-5" />}
          tone="primary"
        />
        <AdminStatCard
          label="Inactive Slides"
          value={inactiveCount.toString()}
          hint="Hidden from storefront"
          icon={<EyeOff className="h-5 w-5" />}
          tone="muted"
        />
      </div>

      {/* Main Listing Table */}
      <AdminListControls list={list} />
      {list.noMatches ? (
        <p className="text-sm text-muted">{ADMIN_LIST.empty}</p>
      ) : (
        <CarouselSlidesTable
          slides={list.pageItems}
          onEdit={openEdit}
          onRequestDelete={(slide) => setDeletingSlide(slide)}
          onRefresh={() => router.refresh()}
        />
      )}
      <AdminListPagination list={list} />

      {/* Add / Edit Slide Dialog */}
      <AdminFormDialog
        open={formOpen}
        onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}
        title={
          editingSlide
            ? ADMIN_CAROUSEL_COPY.editTitle
            : ADMIN_CAROUSEL_COPY.createTitle
        }
        className="max-w-2xl"
      >
        <CarouselSlideForm
          key={editingSlide?._id ?? "new"}
          slide={editingSlide}
          onDone={() => {
            closeForm();
            router.refresh();
          }}
          onCancel={closeForm}
        />
      </AdminFormDialog>

      {/* Delete Confirmation Modal */}
      <DeleteCarouselDialog
        open={Boolean(deletingSlide)}
        slide={deletingSlide}
        loading={isDeleting}
        onOpenChange={(open) => !open && setDeletingSlide(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
