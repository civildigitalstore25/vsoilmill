import {
  FadeIn,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";

const FEATURES = [
  {
    title: "Cold-Pressed at Low Temperature",
    body: "Oil is extracted below 45°C — preserving heat-sensitive vitamins and antioxidants.",
  },
  {
    title: "No Hexane or Chemical Solvents",
    body: "Unlike refined oils, we never use chemical extraction. Pure mechanical pressing only.",
  },
  {
    title: "Unrefined & Unfiltered",
    body: "We don't bleach, deodorize, or filter out the natural goodness. Raw and pure.",
  },
  {
    title: "Direct from Our Mill to You",
    body: "No middlemen. Freshly pressed and shipped directly for maximum freshness.",
  },
] as const;

export function WhyUsSection() {
  return (
    <section className="bg-dark py-16 text-cream">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            Why VS Oil Mill
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl md:text-4xl">
            Not All Oils Are Created Equal
          </h2>
          <p className="mt-4 max-w-2xl text-cream/70">
            Most commercial oils are extracted using chemical solvents and refined
            at high temperatures — stripping away nutritional value. Our Mara
            Chekku method preserves every natural nutrient and aroma.
          </p>
        </FadeIn>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-2" delay={0.1}>
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="rounded-lg border border-cream/10 p-5 transition-colors hover:border-accent/40">
                <h3 className="font-display text-xl text-accent">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-cream/70">{feature.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
