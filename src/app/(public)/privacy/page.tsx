import { PolicyPage, policyMetadata } from "@/components/shared/PolicyPage";
import { PRIVACY_POLICY } from "@/constants/policies/privacy";

export const metadata = policyMetadata(
  PRIVACY_POLICY.title,
  PRIVACY_POLICY.intro,
  "/privacy",
);

export default function PrivacyPage() {
  return <PolicyPage {...PRIVACY_POLICY} path="/privacy" />;
}
