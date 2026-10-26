"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  Play,
  Film,
  ExternalLink,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { FAQS, FAQ_CATEGORIES } from "@/constants/faqs";
import { ROUTES } from "@/constants/routes";
import { UI } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";

export function FaqsClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Default open the video questions
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "special-and-taste": true,
    "low-price-and-quality": true,
    "why-choose-vsoilmill": true,
  });
  // Active video index for multi-video questions
  const [activeVideoIndex, setActiveVideoIndex] = useState<Record<string, number>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search questions, oil mill process, delivery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-dark placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
        </div>

        {/* Quick Link to Gallery */}
        <Link
          href={ROUTES.GALLERY}
          className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-primary hover:text-primary-dark transition-colors bg-primary/10 hover:bg-primary/15 px-3.5 py-2 rounded-xl"
        >
          <Film className="h-4 w-4" />
          <span>Explore Visual Mill Gallery</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-dark"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      {filteredFaqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
          <HelpCircle className="mx-auto h-10 w-10 text-muted/60" />
          <p className="mt-3 text-base font-semibold text-dark">No questions found</p>
          <p className="mt-1 text-sm text-muted">
            Try adjusting your search keywords or select &quot;All Questions&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 inline-flex items-center text-xs font-medium text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            const hasVideos = faq.videos && faq.videos.length > 0;
            const currentVidIdx = activeVideoIndex[faq.id] ?? 0;
            const currentVideo = hasVideos ? faq.videos![currentVidIdx] : null;

            return (
              <div
                key={faq.id}
                className={cn(
                  "rounded-2xl border transition-all overflow-hidden bg-card",
                  hasVideos
                    ? "border-primary/30 shadow-xs hover:border-primary/50"
                    : "border-border hover:border-stone-300"
                )}
              >
                {/* Header / Question Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-stone-50/50"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1.5 pr-2">
                    {/* Badge */}
                    {faq.badge ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                        {hasVideos && <Film className="h-3 w-3 text-primary" />}
                        {faq.badge}
                      </span>
                    ) : null}

                    <h2 className="font-display text-lg sm:text-xl font-bold text-dark leading-snug">
                      {faq.q}
                    </h2>
                  </div>

                  <div
                    className={cn(
                      "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-dark transition-transform duration-200",
                      isOpen && "rotate-180 bg-primary/10 text-primary"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-0 border-t border-border/40 mt-1">
                    {/* Text Answer */}
                    <div className="mt-4 text-sm sm:text-base leading-relaxed text-dark/80 bg-stone-50/60 rounded-xl p-4 border border-stone-100">
                      <p>{faq.a}</p>
                    </div>

                    {/* Video Player Section */}
                    {hasVideos && faq.videos && (
                      <div className="mt-6 rounded-2xl border border-primary/20 bg-stone-900/5 p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                              <Play className="h-3 w-3 fill-white translate-x-0.5" />
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-dark">
                              Video Explanation & Mill Footage
                            </span>
                          </div>

                          {/* Multi-video switcher if 2+ videos */}
                          {faq.videos.length > 1 && (
                            <div className="flex items-center gap-1.5 bg-stone-200/80 p-1 rounded-xl self-start sm:self-auto">
                              {faq.videos.map((vid, idx) => (
                                <button
                                  key={vid.url}
                                  type="button"
                                  onClick={() =>
                                    setActiveVideoIndex((prev) => ({
                                      ...prev,
                                      [faq.id]: idx,
                                    }))
                                  }
                                  className={cn(
                                    "px-3 py-1 text-xs font-semibold rounded-lg transition-all",
                                    currentVidIdx === idx
                                      ? "bg-white text-primary shadow-xs"
                                      : "text-stone-600 hover:text-dark"
                                  )}
                                >
                                  {vid.part ?? `Part ${idx + 1}`}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Current Video Display */}
                        {currentVideo && (
                          <div className="space-y-3">
                            <div className="overflow-hidden rounded-xl bg-black shadow-md border border-stone-800">
                              <video
                                key={currentVideo.url}
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full max-h-[460px] object-contain mx-auto aspect-video sm:aspect-16/9 bg-black"
                              >
                                <source src={currentVideo.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted pt-1">
                              <p className="font-semibold text-dark/90">
                                {currentVideo.title}
                              </p>
                              {currentVideo.description && (
                                <p className="text-muted text-[11px] sm:text-xs">
                                  {currentVideo.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Assistance & Gallery Banner */}
      <div className="grid gap-4 sm:grid-cols-2 pt-6">
        {/* Gallery Card */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-cream via-white to-amber-50/40 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Film className="h-4 w-4" />
              <span>Visual Mill Gallery</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-dark">
              Explore Our Mill Videos & Product Showcase
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              Watch real Mara Chekku oil extraction reels, farmer seed lots, and high-resolution photo galleries.
            </p>
          </div>
          <Link
            href={ROUTES.GALLERY}
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline self-start"
          >
            <span>Visit Gallery Page</span>
            <span>→</span>
          </Link>
        </div>

        {/* WhatsApp Assistance */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-cream via-white to-emerald-50/40 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <MessageCircle className="h-4 w-4" />
              <span>Direct Mill Help</span>
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-dark">
              Have a Custom Question or Bulk Order?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              Connect directly with mill founder Sarathkumar on WhatsApp for questions, custom packing, or restaurant supply.
            </p>
          </div>
          <a
            href={`https://wa.me/${UI.whatsappNumber}?text=${encodeURIComponent(
              "Hi VS OilMill team, I have a question about your cold pressed oils."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors self-start shadow-xs"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
