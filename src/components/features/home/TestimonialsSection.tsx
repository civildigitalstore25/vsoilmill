import {
  FadeIn,
  Stagger,
  StaggerItem,
} from "@/components/shared/motion";
import { PageContainer } from "@/components/layout/PageContainer";

const STORIES = [
  {
    initials: "PK",
    name: "Priya Krishnamurthy",
    place: "Chennai, Tamil Nadu",
    body: "I switched to VS Oil Mill's sesame oil 6 months ago and I can genuinely taste the difference. Fragrant, pure, and my family loves it.",
    product: "Wooden Pressed Sesame Oil — 5L Can",
  },
  {
    initials: "RA",
    name: "Rajesh Annamalai",
    place: "Coimbatore, Tamil Nadu",
    body: "The Uthukuli ghee is divine. Beautiful grainy texture that tells you it's real bilona ghee. My parents loved it!",
    product: "Pure Uthukuli Cow Ghee — 500ml",
  },
  {
    initials: "MS",
    name: "Meena Sundaram",
    place: "Madurai, Tamil Nadu",
    body: "Ordered groundnut oil bulk tin for our restaurant. Outstanding quality and super-fast delivery.",
    product: "Wooden Pressed Groundnut Oil — 15Kg Tin",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <PageContainer>
      <FadeIn>
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Customer Stories
        </p>
        <h2 className="mt-2 font-display text-3xl text-dark md:text-4xl">
          Trusted by 12,000+ Indian Families
        </h2>
      </FadeIn>
      <Stagger className="mt-10 grid gap-6 md:grid-cols-3" delay={0.1}>
        {STORIES.map((story) => (
          <StaggerItem key={story.name}>
            <blockquote className="h-full rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {story.initials}
                </span>
                <div>
                  <p className="font-medium text-dark">{story.name}</p>
                  <p className="text-xs text-muted">{story.place}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-dark/80">
                “{story.body}”
              </p>
              <p className="mt-4 text-xs font-medium text-primary">
                {story.product}
              </p>
            </blockquote>
          </StaggerItem>
        ))}
      </Stagger>
      </PageContainer>
    </section>
  );
}
