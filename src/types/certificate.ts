export type CertificateStatus =
  | "placeholder"
  | "pending"
  | "verified"
  | "not_applicable";

export type CertificateCategory =
  | "business_license"
  | "testing_report"
  | "quality_certification"
  | "product_specification";

export type CertificateApplicability =
  | "mandatory"
  | "statutory"
  | "conditional"
  | "voluntary";

export interface TestParameter {
  parameter: string;
  standardRequirement?: string;
  placeholderValue?: string;
  unit?: string;
}

export interface CertificatePdfPagesProps {
  url: string;
  title: string;
}

export interface CertificateDocument {
  id: string;
  title: string;
  shortTitle?: string;
  category: CertificateCategory;
  categoryLabel: string;
  status: CertificateStatus;
  applicability: CertificateApplicability;
  applicabilityLabel: string;
  applicabilityDescription: string;
  description: string;
  longDescription: string;
  documentUrl: string | null;
  previewImage: string | null;
  fileType?: "pdf" | "jpg" | "png" | "webp" | null;
  fileSize?: string | null;
  certificateNumber: string | null;
  issuedBy: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  productName?: string | null;
  testParameters?: TestParameter[];
  notes?: string;
  verificationAuthority?: string | null;
  replacementInstructions: string;
}
