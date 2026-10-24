"use client";

import React, { useState, useMemo } from "react";
import {
  Shield,
  FlaskConical,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import type { CertificateDocument } from "@/types/certificate";
import {
  CERTIFICATES_DATA,
  CERTIFICATE_CATEGORIES,
} from "@/data/certificates";
import { CertificateCard } from "./CertificateCard";
import { CertificateDetailModal } from "./CertificateDetailModal";
import { CertificateTrustNotice } from "./CertificateTrustNotice";
import { CertificateTestingProcess } from "./CertificateTestingProcess";
import { CertificateContactSection } from "./CertificateContactSection";
import { Button } from "@/components/ui/button";

export function CertificatesPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeDocument, setActiveDocument] = useState<CertificateDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectDocument = (doc: CertificateDocument) => {
    setActiveDocument(doc);
    setIsModalOpen(true);
  };

  // Filter documents based on active category and optional search query
  const filteredDocuments = useMemo(() => {
    return CERTIFICATES_DATA.filter((doc) => {
      const matchesCategory =
        selectedCategory === "all" || doc.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.productName &&
          doc.productName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Grouped documents for the structured "All" view
  const businessLicenses = useMemo(
    () => filteredDocuments.filter((d) => d.category === "business_license"),
    [filteredDocuments],
  );
  const testingReports = useMemo(
    () => filteredDocuments.filter((d) => d.category === "testing_report"),
    [filteredDocuments],
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <section className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Shield className="h-3.5 w-3.5" />
          <span>Quality Assurance & Statutory Compliance</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-dark sm:text-4xl md:text-5xl">
          Certificates & Quality Standards
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-lg sm:leading-relaxed">
          We are committed to maintaining food safety, product quality, and transparency
          throughout our edible oil production and supply process. Explore our applicable
          licenses, registrations, and verified quality documents.
        </p>

        {/* Quick Highlights Pill Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-dark/80">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3.5 py-1.5">
            🌿 Traditional Mara Chekku Method
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3.5 py-1.5">
            🚫 Zero Chemical Solvents
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3.5 py-1.5">
            🔬 Independent Laboratory Testing
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3.5 py-1.5">
            ⚖️ Credential Integrity
          </span>
        </div>
      </section>

      {/* 2. Official Credential Transparency Notice */}
      <CertificateTrustNotice />

      {/* 3. Category Filter & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CERTIFICATE_CATEGORIES.map((category) => {
              const count =
                category.id === "all"
                  ? CERTIFICATES_DATA.length
                  : CERTIFICATES_DATA.filter((d) => d.category === category.id).length;

              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border/80 bg-card text-dark hover:bg-cream-dark/50"
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-dark placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-dark"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Documents Display: Grouped or Filtered */}
      <div className="space-y-14">
        {filteredDocuments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Filter className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 font-display text-base font-semibold text-dark">
              No matching documents found
            </p>
            <p className="mt-1 text-xs text-muted">
              Try adjusting your search query or select &quot;All Documents&quot; tab.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : selectedCategory === "all" && searchQuery === "" ? (
          /* Structured Grouped View by Sections */
          <>
            {/* Section A: Important Licenses and Registrations */}
            <section id="licenses-registrations" className="space-y-4">
              <div className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-xl font-bold text-dark sm:text-2xl">
                    1. Important Licenses & Registrations
                  </h2>
                </div>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Statutory food safety licenses, tax registrations, and enterprise documentation under Indian law.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {businessLicenses.map((doc) => (
                  <CertificateCard
                    key={doc.id}
                    document={doc}
                    onSelect={handleSelectDocument}
                  />
                ))}
              </div>
            </section>

            {/* Section B: Food Safety and Quality Documentation */}
            <section id="testing-reports" className="space-y-4">
              <div className="border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FlaskConical className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-xl font-bold text-dark sm:text-2xl">
                    2. Food Safety & Laboratory Testing Documentation
                  </h2>
                </div>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Independent analytical testing, batch quality verification, and certificates of analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {testingReports.map((doc) => (
                  <CertificateCard
                    key={doc.id}
                    document={doc}
                    onSelect={handleSelectDocument}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          /* Filtered View (Single Grid) */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <CertificateCard
                key={doc.id}
                document={doc}
                onSelect={handleSelectDocument}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Cold Pressing Quality Methodology Walkthrough */}
      <CertificateTestingProcess />

      {/* 6. Contact Section for Certificate Verification and Business Enquiries */}
      <CertificateContactSection />

      {/* 7. Accessible Certificate Inspection Modal */}
      <CertificateDetailModal
        document={activeDocument}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
