import {
  FadeIn,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { PageContainer } from "@/components/layout/PageContainer";

const STEPS = [
  {
    step: "01",
    title: "Handpicked Seeds",
    body: "We source premium sesame, groundnut, and coconut from trusted Tamil Nadu farmers.",
  },
  {
    step: "02",
    title: "Wooden Mill Extraction",
    body: "Seeds are cold-pressed in our traditional Mara Chekku mill at low temperature.",
  },
  {
    step: "03",
    title: "Sun Drying & Settling",
    body: "Fresh oil is naturally sun-dried and settled to separate pure oil from sediment.",
  },
  {
    step: "04",
    title: "Pure Unfiltered Bottling",
    body: "Bottled unfiltered to retain natural goodness, aroma, and nutrition.",
  },
] as const;

export function ProcessSection() {
  return (
    <section className="bg-primary/5 py-16">
      <PageContainer>
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Our Process
          </p>
          <h2 className="mt-2 max-w-xl font-display text-3xl text-dark md:text-4xl">
            From Seed to Bottle — The Traditional Way
          </h2>
        </FadeIn>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4" delay={0.1}>
          {STEPS.map((item) => (
            <StaggerItem key={item.step}>
              <div className="rounded-lg bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <p className="font-display text-3xl text-accent">{item.step}</p>
                <h3 className="mt-3 font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </PageContainer>
    </section>
  );
}
