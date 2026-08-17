import { Leaf, FlaskConical, ShieldCheck, Truck } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { PageContainer } from "@/components/layout/PageContainer";

const FEATURES = [
  {
    icon: Leaf,
    title: "100% Mara Chekku",
    description: "Traditional wooden extraction method",
  },
  {
    icon: FlaskConical,
    title: "Zero Chemicals",
    description: "No preservatives or additives ever",
  },
  {
    icon: ShieldCheck,
    title: "FSSAI Certified",
    description: "Lab tested for purity & safety",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Express shipping in 24–48 hours",
  },
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-card">
      <PageContainer>
      <Stagger className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <StaggerItem key={title}>
            <div className="flex gap-3">
              <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-dark">{title}</p>
                <p className="text-sm text-muted">{description}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      </PageContainer>
    </section>
  );
}
