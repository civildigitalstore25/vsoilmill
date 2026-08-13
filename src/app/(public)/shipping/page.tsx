import { PolicyPage, policyMetadata } from "@/components/shared/PolicyPage";
import { SHIPPING_POLICY } from "@/constants/policies/shipping";

export const metadata = policyMetadata(
  SHIPPING_POLICY.title,
  SHIPPING_POLICY.intro,
  "/shipping",
);

export default function ShippingPage() {
  return <PolicyPage {...SHIPPING_POLICY} path="/shipping" />;
}
