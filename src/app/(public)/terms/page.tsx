import { PolicyPage, policyMetadata } from "@/components/shared/PolicyPage";
import { TERMS_POLICY } from "@/constants/policies/terms";

export const metadata = policyMetadata(
  TERMS_POLICY.title,
  TERMS_POLICY.intro,
  "/terms",
);

export default function TermsPage() {
  return <PolicyPage {...TERMS_POLICY} path="/terms" />;
}
