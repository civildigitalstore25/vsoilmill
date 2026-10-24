import React from "react";
import { Sparkles, Sprout, Wind, Droplet, FlaskConical } from "lucide-react";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Native Seed Sourcing",
    icon: Sprout,
    description:
      "We source naturally grown groundnuts from Saurashtra & Tamil Nadu, heritage black sesame seeds, and sulfur-free dried coconut copra. Each batch is inspected for moisture and mold before pressing.",
  },
  {
    step: "02",
    title: "Slow Mara Chekku Crushing",
    icon: Wind,
    description:
      "Traditional Vaagai wood mortar and pestle rotate at a gentle 14–16 RPM. Extraction temperature stays strictly below 45°C, preserving heat-sensitive tocopherols, vitamin E, and natural polyphenols.",
  },
  {
    step: "03",
    title: "Natural Gravitational Settling",
    icon: Droplet,
    description:
      "Extracted oil rests in food-grade stainless steel settling tanks for 3 to 4 days. Natural plant micro-particles settle by gravity without high-pressure synthetic filtration or chemical bleaching.",
  },
  {
    step: "04",
    title: "Accredited Laboratory Testing",
    icon: FlaskConical,
    description:
      "Batches are periodically tested for FFA, Peroxide Value, Acid Value, and screened to confirm the complete absence of Argemone and mineral oil adulteration.",
  },
];

export function CertificateTestingProcess() {
  return (
    <section className="rounded-3xl border border-border bg-stone-900 text-stone-100 p-8 sm:p-10 lg:p-12 shadow-md">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Cold Pressing Quality Protocol</span>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-cream sm:text-3xl md:text-4xl">
          The Mara Chekku Standard of Purity
        </h2>

        <p className="mt-3 text-xs leading-relaxed text-stone-300 sm:text-base">
          Unlike industrial refined oils processed with chemical hexane solvents and bleached at 200°C+,
          our traditional Tamil Nadu Mara Chekku extraction relies entirely on mechanical cold pressing.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.step}
              className="relative flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-800/60 p-5 transition-transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-stone-700">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-base font-semibold text-cream">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-stone-400">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800/80 text-[11px] font-medium text-accent">
                ✓ 100% Unrefined & Chemical Free
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
