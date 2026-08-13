import type { Metadata } from "next";
import { FAQS } from "@/constants/faqs";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQs",
  description:
    "Frequently asked questions about VS OilMill wooden-pressed oils, ghee, shipping, and payments.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">FAQs</h1>
      <div className="mt-10 space-y-6">
        {FAQS.map((faq) => (
          <div key={faq.q} className="rounded-lg border border-border bg-card p-5">
            <h2 className="font-display text-xl text-dark">{faq.q}</h2>
            <p className="mt-2 text-muted">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
