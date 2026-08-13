import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { UI } from "@/constants/ui";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-center text-primary-foreground md:px-16">
        <h2 className="font-display text-3xl md:text-4xl">
          Your First Order Gets {UI.promoPercent}% Off
        </h2>
        <p className="mt-3 text-primary-foreground/85">
          Use code {UI.promoCode} at checkout · Free shipping above ₹999
        </p>
        <Button size="lg" variant="accent" className="mt-6" asChild>
          <Link href={ROUTES.SHOP}>Shop Now & Save</Link>
        </Button>
      </div>
    </section>
  );
}
