import { PolicyPage, policyMetadata } from "@/components/shared/PolicyPage";
import { REFUND_POLICY } from "@/constants/policies/refund";

export const metadata = policyMetadata(
  REFUND_POLICY.title,
  REFUND_POLICY.intro,
  "/refund",
);

export default function RefundPage() {
  return <PolicyPage {...REFUND_POLICY} path="/refund" />;
}
