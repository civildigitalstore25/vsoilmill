"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Film,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Share2,
  MessageCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  GALLERY_VIDEOS,
  GALLERY_IMAGES,
  type GalleryImage,
  type GalleryVideo,
} from "@/constants/gallery";
import { ROUTES } from "@/constants/routes";
import { UI } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

interface GalleryClientProps {
  initialImages?: GalleryImage[];
  initialVideos?: GalleryVideo[];
}

export function GalleryClient({ initialImages, initialVideos }: GalleryClientProps = {}) {
  const images = initialImages && initialImages.length > 0 ? initialImages : GALLERY_IMAGES;
  const videos = initialVideos && initialVideos.length > 0 ? initialVideos : GALLERY_VIDEOS;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Dynamic category pills with accurate counts of available items
  const categories = useMemo(() => {
    const bannersCount = images.filter((img) => img.category === "banners").length;
    const productsCount = images.filter((img) => img.category === "products").length;
    const combosCount = images.filter((img) => img.category === "combos").length;
    const traditionalCount = images.filter((img) => img.category === "traditional").length;
    const totalCount = images.length + videos.length;

    const list: Array<{ id: string; label: string }> = [
      { id: "all", label: `All Media (${totalCount})` },
    ];

    if (videos.length > 0) {
      list.push({ id: "videos", label: `🎥 Mill Videos (${videos.length})` });
    }
    if (bannersCount > 0) {
      list.push({ id: "banners", label: `✨ Banners & Promos (${bannersCount})` });
    }
    if (productsCount > 0) {
      list.push({ id: "products", label: `🧴 Wood Pressed Oils (${productsCount})` });
    }
    if (combosCount > 0) {
      list.push({ id: "combos", label: `🎁 Combo Offers (${combosCount})` });
    }
    if (traditionalCount > 0) {
      list.push({ id: "traditional", label: `🏺 Heritage & Traditional (${traditionalCount})` });
    }

    return list;
  }, [images, videos]);

  // Filter images based on category
  const filteredImages = useMemo(() => {
    if (activeCategory === "all" || activeCategory === "videos") {
      return images;
    }
    return images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  const showVideos = activeCategory === "all" || activeCategory === "videos";
  const showImages = activeCategory !== "videos";

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightboxImage = useCallback(() => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((prev) =>
        prev === null ? null : (prev + 1) % filteredImages.length
      );
    }
  }, [lightboxIndex, filteredImages.length]);

  const prevLightboxImage = useCallback(() => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((prev) =>
        prev === null
          ? null
          : (prev - 1 + filteredImages.length) % filteredImages.length
      );
    }
  }, [lightboxIndex, filteredImages.length]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextLightboxImage, prevLightboxImage]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  const handleShare = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Watch this video from VS OilMill: ${title}`,
          url,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      void navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const currentLightboxItem =
    lightboxIndex !== null && lightboxIndex < filteredImages.length
      ? filteredImages[lightboxIndex]
      : null;

  return (
    <div className="space-y-12">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setLightboxIndex(null);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer",
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "bg-card text-stone-600 hover:bg-stone-100 hover:text-dark border border-border/60"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: VIDEOS & MILL STORIES */}
      {showVideos && videos.length > 0 && (
        <section aria-labelledby="mill-videos-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Film className="h-4 w-4" />
                <span>Featured Video Explanations & Mill Tours</span>
              </div>
              <h2
                id="mill-videos-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-dark"
              >
                Watch Our Mill in Action
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-md">
              Real video footage explaining our Mara Chekku wooden pressing, direct farmer procurement, and why 12,000+ families choose VS OilMill.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                {/* Video Player */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain bg-black"
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="pointer-events-none absolute top-3 left-3 z-10">
                    <span className="rounded-full bg-dark/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-cream border border-white/10 shadow-xs">
                      {video.badge}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                        {video.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-dark leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-4 text-xs">
                    <a
                      href={`https://wa.me/${UI.whatsappNumber}?text=${encodeURIComponent(
                        `Hi VS OilMill, I watched your video "${video.title}" and would like to learn more!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Ask on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleShare(video.title, video.videoUrl)}
                      className="inline-flex items-center gap-1.5 text-stone-500 hover:text-dark transition-colors font-medium cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: BANNERS & AVAILABLE PRODUCT SHOWCASE */}
      {showImages && (
        <section aria-labelledby="visual-showcase-heading" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>
                  {activeCategory === "banners"
                    ? "Banners & Promotions"
                    : activeCategory === "products"
                    ? "Available Wood-Pressed Mara Chekku Oils"
                    : activeCategory === "combos"
                    ? "Curated Value Combos"
                    : activeCategory === "traditional"
                    ? "Mill Tradition & Heritage"
                    : "Available Products, Combos & Mill Gallery"}
                </span>
              </div>
              <h2
                id="visual-showcase-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-dark"
              >
                {activeCategory === "banners"
                  ? "Banners & Promos"
                  : activeCategory === "products"
                  ? "Available Mara Chekku Products"
                  : activeCategory === "combos"
                  ? "Available Value Combo Packs"
                  : activeCategory === "traditional"
                  ? "Heritage & Traditional Products"
                  : "All Available Products & Media"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-md">
              Browse available products in stock. Click &quot;View Item&quot; to order with instant delivery, or preview in high resolution.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Image Container with Hover Overlay */}
                <div
                  className="relative aspect-square w-full cursor-pointer overflow-hidden bg-stone-100"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      {image.badge && (
                        <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-xs">
                          {image.badge}
                        </span>
                      )}
                      <span className="rounded-full bg-white/90 p-1.5 text-dark backdrop-blur-xs ml-auto shadow-xs">
                        <Maximize2 className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="text-white space-y-1">
                      <p className="text-xs font-semibold leading-snug line-clamp-2">
                        {image.title}
                      </p>
                      <p className="text-[11px] text-stone-200 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>Click to preview full size</span>
                      </p>
                    </div>
                  </div>

                  {/* Corner Badge if not hovered */}
                  {image.badge && (
                    <div className="absolute top-3 left-3 group-hover:opacity-0 transition-opacity">
                      <span className="rounded-full bg-cream/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20 shadow-xs">
                        {image.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 mb-1">
                      <span>{image.tag}</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-dark leading-snug line-clamp-2">
                      {image.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {image.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="font-medium text-stone-600 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>

                    {image.link ? (
                      <Link
                        href={image.link}
                        className="font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 hover:underline"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>View Item</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {currentLightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Modal Container */}
          <div
            className="relative flex flex-col max-w-4xl w-full max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950/80 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-stone-400">
                  {lightboxIndex! + 1} of {filteredImages.length}
                </span>
                {currentLightboxItem.badge && (
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary-light border border-primary/30">
                    {currentLightboxItem.badge}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
                aria-label="Close image preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[460px] bg-black flex items-center justify-center p-4">
              <Image
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                fill
                unoptimized
                className="object-contain"
                priority
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={prevLightboxImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-xs border border-white/10 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextLightboxImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-xs border border-white/10 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Caption & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-stone-950/90 border-t border-stone-800 text-white">
              <div className="space-y-1 max-w-xl">
                <h4 className="font-display text-base sm:text-lg font-bold text-white">
                  {currentLightboxItem.title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300">
                  {currentLightboxItem.description}
                </p>
              </div>

              {currentLightboxItem.link ? (
                <Link
                  href={currentLightboxItem.link}
                  onClick={closeLightbox}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-dark transition-colors shrink-0 shadow-md"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>View in Store / Order</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-600/10 p-6 sm:p-10 text-center space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4" />
          <span>100% Mara Chekku Traditional Quality</span>
        </span>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-dark max-w-xl mx-auto">
          Taste the Rich Difference of Traditional Cold-Pressed Oils
        </h3>

        <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
          From unrefined wooden-pressed groundnut, sesame, and coconut oils to authentic Uthukuli Desi Cow Ghee — freshly prepared and delivered to your doorstep.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={ROUTES.SHOP}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
          >
            Shop All Products
          </Link>
          <Link
            href={ROUTES.FAQS}
            className="rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold text-dark hover:bg-stone-50 transition-colors shadow-2xs"
          >
            Check FAQs with Video Answers
          </Link>
        </div>
      </div>
    </div>
  );
}
