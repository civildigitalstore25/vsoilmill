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
  Play,
  Youtube,
  ExternalLink,
  Calendar,
  Package,
  Tag,
  Truck,
  ShieldCheck,
  Phone,
  Layers,
  Store,
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
import { detectMediaKind, youtubeVideoId } from "@/lib/utils/media";
import { toast } from "sonner";

interface GalleryClientProps {
  initialImages?: GalleryImage[];
  initialVideos?: GalleryVideo[];
}

export function GalleryClient({ initialImages, initialVideos }: GalleryClientProps = {}) {
  const images = initialImages && initialImages.length > 0 ? initialImages : GALLERY_IMAGES;
  const videos = initialVideos && initialVideos.length > 0 ? initialVideos : GALLERY_VIDEOS;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [videoFilter, setVideoFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<GalleryVideo | null>(null);

  // Dynamic category pills with accurate counts of available items
  const categories = useMemo(() => {
    const packingCount = videos.filter(
      (v) => v.subCategory === "packing" || v.subCategory === "packaging"
    ).length;
    const sellingVideosCount = videos.filter((v) => v.subCategory === "selling").length;
    const whitelabelCount = videos.filter((v) => v.subCategory === "whitelabel").length;
    const extractionCount = videos.filter((v) => v.subCategory === "extraction").length;
    const productsCount = images.filter((img) => img.category === "products").length;
    const combosCount = images.filter((img) => img.category === "combos").length;
    const bannersCount = images.filter((img) => img.category === "banners").length;
    const traditionalCount = images.filter((img) => img.category === "traditional").length;
    const totalSellingCount = sellingVideosCount + productsCount + combosCount;
    const totalCount = images.length + videos.length;

    const list: Array<{ id: string; label: string; count: number }> = [
      { id: "all", label: `All Media (${totalCount})`, count: totalCount },
      { id: "packing", label: `📦 Packing & Dispatch (${packingCount})`, count: packingCount },
      { id: "selling", label: `🛍️ Selling & Offers (${totalSellingCount})`, count: totalSellingCount },
      { id: "whitelabel", label: `🏷️ White Label & Your Brand (${whitelabelCount})`, count: whitelabelCount },
      { id: "extraction", label: `⚙️ Oil Extraction (${extractionCount})`, count: extractionCount },
      { id: "videos", label: `🎥 All Videos (${videos.length})`, count: videos.length },
    ];

    if (productsCount > 0) {
      list.push({ id: "products", label: `🧴 Wood Pressed Oils (${productsCount})`, count: productsCount });
    }
    if (combosCount > 0) {
      list.push({ id: "combos", label: `🎁 Combo Offers (${combosCount})`, count: combosCount });
    }
    if (bannersCount > 0) {
      list.push({ id: "banners", label: `✨ Banners & Promos (${bannersCount})`, count: bannersCount });
    }
    if (traditionalCount > 0) {
      list.push({ id: "traditional", label: `🏺 Heritage & Traditional (${traditionalCount})`, count: traditionalCount });
    }

    return list;
  }, [images, videos]);

  // Video Sub-Category filter tabs
  const videoSubCategories = useMemo(() => {
    const packingCount = videos.filter(
      (v) => v.subCategory === "packing" || v.subCategory === "packaging"
    ).length;
    const sellingCount = videos.filter((v) => v.subCategory === "selling").length;
    const whitelabelCount = videos.filter((v) => v.subCategory === "whitelabel").length;
    const extractionCount = videos.filter((v) => v.subCategory === "extraction").length;
    const storyCount = videos.filter((v) => v.subCategory === "story").length;

    return [
      { id: "all", label: `All Videos (${videos.length})` },
      ...(packingCount > 0
        ? [{ id: "packing", label: `📦 Packing & Dispatch (${packingCount})` }]
        : []),
      ...(sellingCount > 0
        ? [{ id: "selling", label: `🛍️ Live Selling & Offers (${sellingCount})` }]
        : []),
      ...(whitelabelCount > 0
        ? [{ id: "whitelabel", label: `🏷️ White Label / Your Brand (${whitelabelCount})` }]
        : []),
      ...(extractionCount > 0
        ? [{ id: "extraction", label: `⚙️ Oil Machine & Extraction (${extractionCount})` }]
        : []),
      ...(storyCount > 0
        ? [{ id: "story", label: `🎓 Mill Stories & Visits (${storyCount})` }]
        : []),
    ];
  }, [videos]);

  // Filtered videos based on active category and video sub-filter
  const filteredVideos = useMemo(() => {
    if (activeCategory === "packing") {
      return videos.filter(
        (v) => v.subCategory === "packing" || v.subCategory === "packaging"
      );
    }
    if (activeCategory === "selling") {
      return videos.filter((v) => v.subCategory === "selling");
    }
    if (activeCategory === "whitelabel") {
      return videos.filter((v) => v.subCategory === "whitelabel");
    }
    if (activeCategory === "extraction") {
      return videos.filter((v) => v.subCategory === "extraction");
    }
    if (activeCategory === "all" || activeCategory === "videos") {
      if (videoFilter === "all") return videos;
      if (videoFilter === "packing") {
        return videos.filter(
          (v) => v.subCategory === "packing" || v.subCategory === "packaging"
        );
      }
      if (videoFilter === "whitelabel") {
        return videos.filter((v) => v.subCategory === "whitelabel");
      }
      return videos.filter((v) => v.subCategory === videoFilter);
    }
    return [];
  }, [videos, activeCategory, videoFilter]);

  // Filter images based on active category
  const filteredImages = useMemo(() => {
    if (activeCategory === "all") {
      return images;
    }
    if (activeCategory === "selling") {
      return images.filter(
        (img) => img.category === "products" || img.category === "combos"
      );
    }
    if (
      activeCategory === "packing" ||
      activeCategory === "whitelabel" ||
      activeCategory === "extraction" ||
      activeCategory === "videos"
    ) {
      return [];
    }
    return images.filter((img) => img.category === activeCategory);
  }, [images, activeCategory]);

  const showVideos =
    activeCategory === "all" ||
    activeCategory === "videos" ||
    activeCategory === "packing" ||
    activeCategory === "selling" ||
    activeCategory === "whitelabel" ||
    activeCategory === "extraction";

  const showImages =
    activeCategory === "all" ||
    activeCategory === "selling" ||
    (activeCategory !== "videos" &&
      activeCategory !== "packing" &&
      activeCategory !== "whitelabel" &&
      activeCategory !== "extraction");

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

  // Handle keyboard navigation for Lightbox and Video Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
        setActiveVideoModal(null);
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") nextLightboxImage();
        if (e.key === "ArrowLeft") prevLightboxImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextLightboxImage, prevLightboxImage]);

  // Prevent body scroll when lightbox or video modal is open
  useEffect(() => {
    if (lightboxIndex !== null || activeVideoModal !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex, activeVideoModal]);

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
      {/* Category Filter Pills — Distinct, Neat Menus */}
      <div className="space-y-2 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const isHighlightTab = cat.id === "packing" || cat.id === "selling" || cat.id === "whitelabel";
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setLightboxIndex(null);
                  setActiveVideoModal(null);
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer",
                  isActive
                    ? "bg-primary text-white shadow-md ring-2 ring-primary/25 scale-[1.02]"
                    : cat.id === "whitelabel"
                    ? "bg-indigo-500/10 text-indigo-900 hover:bg-indigo-500/20 border border-indigo-400/40"
                    : isHighlightTab
                    ? "bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 border border-amber-400/40"
                    : "bg-card text-stone-600 hover:bg-stone-100 hover:text-dark border border-border/60"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: VIDEOS & MILL FOOTAGE */}
      {showVideos && filteredVideos.length > 0 && (
        <section aria-labelledby="mill-videos-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                {activeCategory === "packing" ? (
                  <>
                    <Package className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700">Customer Orders Packaging & Courier Dispatch Logs</span>
                  </>
                ) : activeCategory === "selling" ? (
                  <>
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-800">Direct Mill Rate Announcements & Special Booking Offers</span>
                  </>
                ) : activeCategory === "whitelabel" ? (
                  <>
                    <Tag className="h-4 w-4 text-indigo-600" />
                    <span className="text-indigo-700">White Label & Private Brand Supply — Unlabeled Oils for Your Brand</span>
                  </>
                ) : activeCategory === "extraction" ? (
                  <>
                    <Film className="h-4 w-4" />
                    <span>Traditional Vaagai Wood Chekku Running & Cold Extraction</span>
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4" />
                    <span>Featured Mill Videos, Machine Extraction, Packing & Selling</span>
                  </>
                )}
              </div>
              <h2
                id="mill-videos-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-dark"
              >
                {activeCategory === "packing"
                  ? "Customer Orders Packing & Dispatch Logs"
                  : activeCategory === "selling"
                  ? "Live Mill Selling & Daily Offers"
                  : activeCategory === "whitelabel"
                  ? "White Label Oil Supply — Sell Under Your Own Brand"
                  : activeCategory === "extraction"
                  ? "Oil Machine & Extraction Live Footage"
                  : "Watch Our Mill in Action"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted max-w-md">
              {activeCategory === "packing"
                ? "See how we safely wrap pure oils with 5-layer bubble cushioning, tamper seals, and dispatch parcels daily across Tamil Nadu & India."
                : activeCategory === "selling"
                ? "Direct mill prices: ₹220/L groundnut oil, ₹350/L coconut oil, ₹700/L cow ghee weekend deal, and festive combo savings."
                : activeCategory === "whitelabel"
                ? "VS OilMill supplies 100% pure Mara Chekku groundnut, sesame, and coconut oils in unlabeled bottles and cans. Paste your custom label, set your prices, and start your business with zero factory investment."
                : activeCategory === "extraction"
                ? "Watch sulphur-free copra, premium peanuts, and sesame seeds cold pressed slowly in authentic Vaagai wood without heat."
                : "Real video footage showing live cold pressing, safe customer order packaging dispatches, live mill selling offers, and visits."}
            </p>
          </div>

          {/* Dedicated White Label B2B Feature Highlights & Direct Inquiry */}
          {activeCategory === "whitelabel" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-indigo-50/50 border border-indigo-200/70 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700 mt-0.5">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark">1. Unlabeled Pure Oils</p>
                    <p className="text-[11px] text-muted leading-tight">
                      Authentic Mara Chekku oils supplied in clean, neutral 1L bottles, 5L cans & 15Kg tins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 text-purple-700 mt-0.5">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark">2. Your Brand Label</p>
                    <p className="text-[11px] text-muted leading-tight">
                      Design & apply your own custom label, logo, and brand name onto the containers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 mt-0.5">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark">3. High Profit Margins</p>
                    <p className="text-[11px] text-muted leading-tight">
                      Purchase at factory wholesale mill prices and set your own profitable retail prices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 mt-0.5">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark">4. Doorstep Reseller Delivery</p>
                    <p className="text-[11px] text-muted leading-tight">
                      Direct courier & freight delivery right to your shop or warehouse across India.
                    </p>
                  </div>
                </div>
              </div>

              {/* White Label CTA Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-stone-900 to-indigo-900 p-4 sm:p-6 text-white shadow-md border border-indigo-800/60">
                <div className="space-y-1 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-400/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Zero Factory Setup Investment Required</span>
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    Start Your Own Cold-Pressed Oil Brand Today
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Connect directly with founder Sarathkumar for White Label wholesale pricing, minimum order quantities (MOQ), and packaging customization.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <a
                    href={`https://wa.me/${UI.whatsappNumber}?text=${encodeURIComponent(
                      "Hi VS OilMill, I am interested in White Label (unlabeled) Mara Chekku oil supply to paste my own brand label and sell. Please share wholesale prices and minimum order quantity."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${UI.phoneDisplay.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors border border-white/20"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Packing Trust Highlights */}
          {activeCategory === "packing" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">5-Layer Bubble Wrap</p>
                  <p className="text-[11px] text-muted">Cushioned bottle protection</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">5-Ply Cartons</p>
                  <p className="text-[11px] text-muted">Sturdy corrugated boxes</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">Doorstep Express</p>
                  <p className="text-[11px] text-muted">Safe delivery across India</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">Tamper-Proof Seals</p>
                  <p className="text-[11px] text-muted">100% leak-tested security</p>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Selling Advantage Highlights */}
          {activeCategory === "selling" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">Direct Mill Rates</p>
                  <p className="text-[11px] text-muted">Zero middleman markup</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">Combo Deals</p>
                  <p className="text-[11px] text-muted">Up to 25% savings</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">Free Shipping</p>
                  <p className="text-[11px] text-muted">On eligible orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark">Instant Booking</p>
                  <p className="text-[11px] text-muted">Direct WhatsApp booking</p>
                </div>
              </div>
            </div>
          )}

          {/* Video Sub-Category Filters (Only when viewing "all" or "videos") */}
          {(activeCategory === "all" || activeCategory === "videos") && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-stone-500 mr-1">Filter Videos:</span>
              {videoSubCategories.map((subCat) => {
                const isSubActive = videoFilter === subCat.id;
                return (
                  <button
                    key={subCat.id}
                    onClick={() => setVideoFilter(subCat.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                      isSubActive
                        ? "bg-stone-900 text-white shadow-xs ring-2 ring-stone-900/20"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-border/40"
                    )}
                  >
                    {subCat.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Video Grid - Prominent Video Size with Compact Cards */}
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <GalleryVideoCard
                key={video.id}
                video={video}
                onShare={handleShare}
                onOpenModal={(v) => setActiveVideoModal(v)}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: BANNERS & AVAILABLE PRODUCT SHOWCASE */}
      {showImages && filteredImages.length > 0 && (
        <section aria-labelledby="visual-showcase-heading" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>
                  {activeCategory === "selling"
                    ? "Available Wood-Pressed Oils & Special Combo Packs Ready to Order"
                    : activeCategory === "banners"
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
                {activeCategory === "selling"
                  ? "Wood-Pressed Oils & Combos Ready to Order"
                  : activeCategory === "banners"
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

                {/* Details Footer - Reduced & Streamlined */}
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5 space-y-2 bg-card">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
                      {image.tag}
                    </span>
                    <h3
                      className="font-display text-xs sm:text-sm font-bold text-dark leading-snug line-clamp-1"
                      title={image.title}
                    >
                      {image.title}
                    </h3>
                    <p className="text-[11px] text-muted leading-tight line-clamp-1">
                      {image.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="font-medium text-stone-600 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </button>

                    {image.link ? (
                      <Link
                        href={image.link}
                        className="font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 hover:underline"
                      >
                        <ShoppingBag className="h-3 w-3" />
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

      {/* THEATER / VIDEO MODAL */}
      {activeVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative flex flex-col max-w-4xl w-full max-h-[92vh] bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-stone-800 bg-stone-950 text-white">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary-light border border-primary/30">
                  {activeVideoModal.badge}
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">
                  {activeVideoModal.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Video View */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[480px] bg-black flex items-center justify-center">
              {activeVideoModal.type === "youtube" || detectMediaKind(activeVideoModal.videoUrl) === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${
                    activeVideoModal.youtubeId || youtubeVideoId(activeVideoModal.videoUrl)
                  }?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideoModal.title}
                  className="h-full w-full aspect-video border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] w-full object-contain bg-black"
                >
                  <source
                    src={
                      activeVideoModal.videoUrl.includes("imagekit.io") && !activeVideoModal.videoUrl.includes("tr=")
                        ? `${activeVideoModal.videoUrl}${activeVideoModal.videoUrl.includes("?") ? "&" : "?"}tr=orig-true`
                        : activeVideoModal.videoUrl
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Bottom Caption & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-stone-950 border-t border-stone-800 text-white">
              <div className="space-y-0.5 max-w-xl">
                <h4 className="font-display text-sm sm:text-base font-bold text-white">
                  {activeVideoModal.title}
                </h4>
                <p className="text-xs text-stone-300">
                  {activeVideoModal.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://wa.me/${UI.whatsappNumber}?text=${encodeURIComponent(
                    `Hi VS OilMill, I watched your video "${activeVideoModal.title}" and would like to order or enquire!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
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

function GalleryVideoCard({
  video,
  onShare,
  onOpenModal,
}: {
  video: GalleryVideo;
  onShare: (title: string, url: string) => void;
  onOpenModal: (video: GalleryVideo) => void;
}) {
  const isYouTube = video.type === "youtube" || detectMediaKind(video.videoUrl) === "youtube";
  const ytId = video.youtubeId || (isYouTube ? youtubeVideoId(video.videoUrl) : null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Normalize imagekit URLs with tr=orig-true to prevent transformation limit errors
  const cleanVideoUrl = useMemo(() => {
    let url = video.videoUrl;
    if (url.includes("imagekit.io") && !url.includes("tr=")) {
      url += (url.includes("?") ? "&" : "?") + "tr=orig-true";
    }
    return url;
  }, [video.videoUrl]);

  const posterUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5">
      {/* Video Player - Enhanced Size (aspect-[4/3] provides commanding video presence) */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] w-full overflow-hidden bg-stone-950 flex items-center justify-center">
        {isYouTube && ytId ? (
          isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative h-full w-full cursor-pointer overflow-hidden group/thumb"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsPlaying(true);
                }
              }}
              aria-label={`Play video: ${video.title}`}
            >
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={video.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-stone-900" />
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 transition-opacity group-hover/thumb:opacity-90" />

              {/* YouTube Play Icon Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:bg-red-700">
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-white ml-0.5" />
                </div>
              </div>

              {/* YouTube Indicator Top-Right */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-dark/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white border border-white/10 shadow-xs">
                <Youtube className="h-3 w-3 text-red-500" />
                <span>YouTube Short</span>
              </div>
            </div>
          )
        ) : (
          <div className="relative h-full w-full flex items-center justify-center bg-stone-950">
            <video
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain bg-black"
            >
              <source src={`${cleanVideoUrl}#t=0.001`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Top-Left Badge */}
        {(!isYouTube || !isPlaying) && (
          <div className="pointer-events-none absolute top-2.5 left-2.5 z-10">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold border shadow-xs backdrop-blur-md",
                video.subCategory === "selling"
                  ? "bg-amber-600/90 text-white border-amber-400/40"
                  : video.subCategory === "whitelabel"
                  ? "bg-indigo-700/90 text-white border-indigo-400/40"
                  : video.subCategory === "packing"
                  ? "bg-emerald-700/90 text-white border-emerald-400/40"
                  : "bg-dark/85 text-cream border-white/10"
              )}
            >
              {video.badge}
            </span>
          </div>
        )}

        {/* Top-Right Expand Button */}
        {(!isYouTube || !isPlaying) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(video);
            }}
            className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-dark/80 hover:bg-dark backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white border border-white/15 transition-all shadow-xs cursor-pointer hover:scale-105"
            title="Watch in full theater size"
            aria-label="Expand video"
          >
            <Maximize2 className="h-2.5 w-2.5" />
            <span className="hidden sm:inline">Expand</span>
          </button>
        )}
      </div>

      {/* Reduced & Compact Text Content */}
      <div className="flex flex-col justify-between p-3 sm:p-3.5 space-y-2 bg-card">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600 uppercase tracking-wide">
              {video.tag}
            </span>
            {video.date && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200/50">
                <Calendar className="h-2.5 w-2.5 text-amber-600" />
                <span>{video.date}</span>
              </span>
            )}
          </div>

          <h3
            className="font-display text-xs sm:text-sm font-bold text-dark leading-snug line-clamp-1 hover:text-primary transition-colors cursor-pointer"
            onClick={() => onOpenModal(video)}
            title={video.title}
          >
            {video.title}
          </h3>
          <p className="text-[11px] text-muted leading-tight line-clamp-1">
            {video.description}
          </p>
        </div>

        {/* Streamlined Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2 text-[11px]">
          <a
            href={`https://wa.me/${UI.whatsappNumber}?text=${encodeURIComponent(
              video.subCategory === "selling"
                ? `Hi VS OilMill, I watched your selling offer video "${video.title}" and would like to order or book!`
                : video.subCategory === "whitelabel"
                ? `Hi VS OilMill, I watched your white label video "${video.title}" and would like to order unlabeled oils to sell under my own brand!`
                : video.subCategory === "packing"
                ? `Hi VS OilMill, I saw your customer packing video "${video.title}" and would like to order with doorstep delivery!`
                : `Hi VS OilMill, I watched your video "${video.title}" and would like to learn more!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>
              {video.subCategory === "selling"
                ? "Book on WhatsApp"
                : video.subCategory === "whitelabel"
                ? "Inquire White Label"
                : video.subCategory === "packing"
                ? "Inquire on WhatsApp"
                : "WhatsApp"}
            </span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenModal(video)}
              className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors font-medium cursor-pointer"
              title="Watch in full theater view"
            >
              <Maximize2 className="h-3 w-3" />
              <span>Full View</span>
            </button>

            {isYouTube && (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold transition-colors"
                title="Watch directly on YouTube"
              >
                <Youtube className="h-3 w-3" />
                <span className="hidden sm:inline">YouTube</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
              </a>
            )}

            <button
              type="button"
              onClick={() => onShare(video.title, video.videoUrl)}
              className="inline-flex items-center gap-1 text-stone-500 hover:text-dark transition-colors font-medium cursor-pointer"
              title="Share video"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
