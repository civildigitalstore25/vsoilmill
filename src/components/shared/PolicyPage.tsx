import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function PolicyPage({
  title,
  intro,
  sections,
  path,
}: {
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
  path: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">{title}</h1>
      <p className="mt-4 text-muted">{intro}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-2xl text-dark">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-dark/80">{section.body}</p>
          </section>
        ))}
      </div>
      <span className="sr-only">{path}</span>
    </div>
  );
}

export function policyMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return buildPageMetadata({ title, description, path });
}
