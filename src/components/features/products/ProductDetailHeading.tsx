import { Badge } from "@/components/ui/badge";
import type { ProductDetailHeadingProps } from "@/types/product";

export function ProductDetailHeading({
  name,
  shortDescription,
  discount,
}: ProductDetailHeadingProps) {
  return (
    <div>
      {discount > 0 ? (
        <Badge className="mb-3 bg-primary text-primary-foreground">-{discount}% OFF</Badge>
      ) : null}
      <h1 className="font-display text-2xl leading-tight text-dark lg:text-4xl">{name}</h1>
      {shortDescription ? <p className="mt-2 text-muted">{shortDescription}</p> : null}
    </div>
  );
}
