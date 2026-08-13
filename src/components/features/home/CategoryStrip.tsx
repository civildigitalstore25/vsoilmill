import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import type { Category } from "@/types/product";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">
        Shop by Category
      </p>
      <h2 className="mt-2 font-display text-3xl text-dark md:text-4xl">
        Everything Pure, Nothing Else
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={ROUTES.CATEGORY(category.slug)}
            className="rounded-lg border border-border bg-card p-5 transition hover:border-primary hover:shadow-sm"
          >
            {category.badge ? <Badge>{category.badge}</Badge> : null}
            <h3 className="mt-3 font-display text-xl text-dark">
              {category.name}
            </h3>
            <p className="mt-1 text-sm text-muted">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
