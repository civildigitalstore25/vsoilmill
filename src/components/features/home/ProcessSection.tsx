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
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Our Process
        </p>
        <h2 className="mt-2 max-w-xl font-display text-3xl text-dark md:text-4xl">
          From Seed to Bottle — The Traditional Way
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step} className="rounded-lg bg-card p-5">
              <p className="font-display text-3xl text-accent">{item.step}</p>
              <h3 className="mt-3 font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
