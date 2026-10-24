import type { CertificateDocument } from "@/types/certificate";

/**
 * Certificate and Quality Standards Data for VS OilMill.
 *
 * 100% AUTHENTIC CREDENTIAL DATA ONLY:
 * All certificates listed below are genuine, verified documents backed by original files in `public/certificate/`:
 * 1. FSSAI State Manufacturing License (Form C): License No. 12424019000258
 * 2. FSSAI Retail Store Registration (Madurai Outlet): Registration No. 22425573000106
 * 3. GST Registration Certificate (Form GST REG-06): GSTIN 33FALPS0381C1ZS
 * 4. Udyam MSME Registration Certificate: UDYAM-TN-21-0008238
 * 5. Legal Metrology Certificate – Weighing Equipment Verification: CV No. SVG/482/009905
 * 6. Accredited Laboratory Analytical Test Report: Micro Tech Diagnostic Centre (ISO/IEC 17025 Certified)
 */

export const CERTIFICATE_CATEGORIES = [
  {
    id: "all",
    label: "All Certificates",
    description: "Complete overview of verified statutory licenses, legal registrations, and laboratory testing reports.",
  },
  {
    id: "business_license",
    label: "Licenses & Registrations",
    description: "Official FSSAI food safety licenses, GST tax registration, MSME recognition, and Legal Metrology equipment stamping.",
  },
  {
    id: "testing_report",
    label: "Laboratory Test Reports",
    description: "ISO/IEC 17025 accredited analytical test reports with verified fatty acid, moisture, and purity values.",
  },
] as const;

export const CERTIFICATES_DATA: CertificateDocument[] = [
  // 1. FSSAI Manufacturing State License (Form C)
  {
    id: "fssai-license",
    title: "FSSAI Food Safety Manufacturing License (Form C)",
    shortTitle: "FSSAI Manufacturing License",
    category: "business_license",
    categoryLabel: "Statutory License",
    status: "verified",
    applicability: "mandatory",
    applicabilityLabel: "Verified Statutory License",
    applicabilityDescription:
      "Mandatory statutory license granted under Section 31(1) of the Food Safety and Standards Act, 2006 for edible oil manufacturing operations.",
    description:
      "Official Form C State License granted by the Government of Tamil Nadu authorizing VS OIL MILL for mechanical extraction and manufacturing of Coconut Oil, Groundnut Oil, and Gingelly (Sesame) Oil.",
    longDescription:
      "Form C State License granted by the Food Safety and Drug Administration Department (Food Safety Wing), Government of Tamil Nadu under the Food Safety and Standards Act, 2006. Formally authorizes V S OIL MILL (Proprietor: S. Sarathkumar) for mechanical extraction, manufacturing, and packaging of pure edible vegetable oils (Groundnut Oil [02.1.2], Til/Sesame Oil [02.1.2], and Coconut Oil [02.1.2]) with an approved production capacity of 1 MT/day at 2/34 B, Main Road, S.V.Mangalam, Singampunari block, Sivaganga District, Tamil Nadu (PIN: 630501).",
    documentUrl: "/certificate/fssai-manufacturing-license.pdf",
    previewImage: "/certificate/previews/fssai-license-preview.png",
    fileType: "pdf",
    fileSize: "193 KB",
    certificateNumber: "12424019000258",
    issuedBy: "Food Safety and Drug Administration Department (Food Safety Wing), Govt. of Tamil Nadu / FSSAI",
    issueDate: "01-08-2024",
    expiryDate: "31-07-2025 (Annual State Renewal)",
    productName: "Groundnut Oil, Til (Sesame) Oil & Coconut Oil",
    verificationAuthority: "Designated Officer, Food Safety Wing, Sivaganga District",
    notes:
      "Verified original document. Includes Form C and Product Annexure authorizing manufacturing capacity of 1 MT/day.",
    replacementInstructions:
      "Original verified document linked to public/certificate/fssai-manufacturing-license.pdf. When renewed annually, update the PDF file and the expiryDate field.",
  },

  // 2. FSSAI Retail Store Registration (Madurai Outlet)
  {
    id: "fssai-retail-store",
    title: "FSSAI Food Safety Retail Registration (Madurai Mill Store)",
    shortTitle: "FSSAI Retail Store Registration",
    category: "business_license",
    categoryLabel: "Statutory Retail Registration",
    status: "verified",
    applicability: "mandatory",
    applicabilityLabel: "Verified Store Registration",
    applicabilityDescription:
      "Statutory food business operator registration under the Food Safety and Standards Act, 2006 for retail mill distribution and customer pickup.",
    description:
      "Official FSSAI Registration Certificate authorizing retail sales, customer pickup, and direct packaging from our physical mill store in Thasildar Nagar, Madurai.",
    longDescription:
      "Official Registration Certificate and FBO ID Card granted under the Food Safety and Standards Act, 2006 by the Food Safety Wing, Government of Tamil Nadu. Covers retail sale, customer tin pickup, and direct packaging from VS OIL STORE premises at Shop No. 228, Vivekananda 1st Street, Yagappa Nagar Main Road, Thasildar Nagar, Madurai, Tamil Nadu - 625020.",
    documentUrl: "/certificate/fssai-retail-store-registration.pdf",
    previewImage: "/certificate/previews/fssai-store-preview.png",
    fileType: "pdf",
    fileSize: "104 KB",
    certificateNumber: "22425573000106",
    issuedBy: "Food Safety Wing, Government of Tamil Nadu (Madurai Corporation Ward-31)",
    issueDate: "04-02-2025",
    expiryDate: "03-02-2028",
    productName: "Retail Store Distribution & Consumer Packaging",
    verificationAuthority: "Designated Officer, Madurai Corporation",
    notes:
      "Verified original document. Valid across all retail and customer pickup transactions at our Madurai store through February 2028.",
    replacementInstructions:
      "Original verified document linked to public/certificate/fssai-retail-store-registration.pdf. Valid until 03-02-2028.",
  },

  // 3. GST Registration Certificate (Form GST REG-06)
  {
    id: "gst-certificate",
    title: "GST Registration Certificate (Form GST REG-06)",
    shortTitle: "GSTIN Certificate",
    category: "business_license",
    categoryLabel: "Taxation & Legal Entity",
    status: "verified",
    applicability: "statutory",
    applicabilityLabel: "Verified Tax Entity",
    applicabilityDescription:
      "Official registration certificate issued under Rule 10(1) of the Central Goods and Services Tax Rules, 2017 for commercial business taxation.",
    description:
      "Government of India GST registration certificate confirming VS OIL MILL as a verified tax-compliant proprietorship business entity.",
    longDescription:
      "Form GST REG-06 issued by the Goods and Services Tax Network (GSTN), Government of India. Verifies legal trade name VS OIL MILL (Proprietor: Sugumaran Sarathkumar), principal place of business at 2 / 34 B, Main Road, S.V.Mangalam, Sivaganga, Tamil Nadu - 630501, and jurisdictional authority TIRUPATHUR. Enables transparent tax invoicing with 5% GST across all states in India.",
    documentUrl: "/certificate/vs-oil-mill-gst-certificate.pdf",
    previewImage: "/certificate/previews/gst-certificate-preview.png",
    fileType: "pdf",
    fileSize: "106 KB",
    certificateNumber: "33FALPS0381C1ZS",
    issuedBy: "Government of India - Goods and Services Tax Network (GSTN)",
    issueDate: "27/01/2022",
    expiryDate: "Regular (Active Legal Entity)",
    productName: "All VS OilMill Invoicing & Operations",
    verificationAuthority: "Superintendent, Jurisdictional Office TIRUPATHUR, Centre",
    notes:
      "Verified original document. Digitally signed by Goods and Services Tax Network with verified proprietor details.",
    replacementInstructions:
      "Original verified document linked to public/certificate/vs-oil-mill-gst-certificate.pdf.",
  },

  // 4. Udyam Registration Certificate (MSME)
  {
    id: "udyam-msme-certificate",
    title: "Udyam MSME Registration Certificate",
    shortTitle: "Udyam MSME Certificate",
    category: "business_license",
    categoryLabel: "Enterprise Registration",
    status: "verified",
    applicability: "statutory",
    applicabilityLabel: "Verified MSME Manufacturing Unit",
    applicabilityDescription:
      "Official recognition as a Micro Manufacturing Enterprise under the Ministry of Micro, Small and Medium Enterprises, Government of India.",
    description:
      "Udyam Registration Certificate confirming VS OIL MILL as an indigenous agro-processing and vegetable oil manufacturing micro enterprise.",
    longDescription:
      "Government of India Udyam Registration Certificate issued by the Ministry of MSME. Classifies VS OIL MILL under National Industry Classification NIC-1040 (Manufacture of vegetable and animal oils and fats - 10409) and NIC-1061 (Vegetable milling - 10615). Formally registered with the District Industries Centre, Sivaganga and MSME-DFO Chennai since 09/12/2021.",
    documentUrl: "/certificate/vs-oil-mill-udyam-certificate.pdf",
    previewImage: "/certificate/previews/udyam-certificate-preview.png",
    fileType: "pdf",
    fileSize: "344 KB",
    certificateNumber: "UDYAM-TN-21-0008238",
    issuedBy: "Ministry of Micro, Small and Medium Enterprises, Govt. of India",
    issueDate: "09/12/2021",
    expiryDate: "Permanent Recognition",
    productName: "Agro-Processing & Cold Pressing Enterprise",
    verificationAuthority: "District Industries Centre SIVAGANGA / MSME-DFO CHENNAI",
    notes:
      "Verified original document. Confirms official manufacturing classification under National Industry Classification code 10409.",
    replacementInstructions:
      "Original verified document linked to public/certificate/vs-oil-mill-udyam-certificate.pdf.",
  },

  // 5. Legal Metrology Certificate – Weighing Equipment Verification
  {
    id: "legal-metrology-certificate",
    title: "Legal Metrology Certificate – Weighing Equipment Verification",
    shortTitle: "Legal Metrology Certificate",
    category: "business_license",
    categoryLabel: "Equipment Verification",
    status: "verified",
    applicability: "statutory",
    applicabilityLabel: "Equipment Verification (Rules, 2011)",
    applicabilityDescription:
      "Statutory verification and official stamping certificate for commercial weighing equipment issued under Tamil Nadu Legal Metrology (Enforcement) Rules, 2011 and Legal Metrology Act, 2009.",
    description:
      "Certificate of Verification issued by the Inspector of Legal Metrology, Government of Tamil Nadu for the electronic weighing instrument used for oil packaging and trade.",
    longDescription:
      "Official Certificate of Verification (Schedule VIII) issued by the Office of the Inspector of Legal Metrology, Government of Tamil Nadu (Sivagangai) under the Legal Metrology Act, 2009. Formally certifies the inspection, calibration, and official stamping of the Electronic Class III weighing instrument (Make: Weigh Man, Model: AJN, Machine No: 6855, Max Capacity: 50 kg, e/d: 5g). Ensures accurate weight measurements for consumer oil packaging and trade fairness.",
    documentUrl: "/certificate/legal-metrology-certificate.jpg",
    previewImage: "/certificate/previews/legal-metrology-preview.jpg",
    fileType: "jpg",
    fileSize: "3.2 MB",
    certificateNumber: "SVG/482/009905 (App: 737090)",
    issuedBy: "Government of Tamil Nadu, Office of the Inspector of Legal Metrology, Sivagangai",
    issueDate: "19-08-2023",
    expiryDate: "Verification Cycle (Annual Restamping)",
    productName: "Electronic Weighing Instrument (Class III, 50 kg Capacity)",
    verificationAuthority: "Thiru K. Mariappan, Stamping Inspector / Inspector of Legal Metrology (Punch: TN482, Plier: 482)",
    notes:
      "Equipment Verification Document: This certificate verifies the accuracy and official stamping of weighing instruments used by the business. It is an equipment measurement accuracy document, not an edible oil quality or food safety certificate. As indicated on the document, weighing equipment is subject to periodic annual verification and restamping.",
    replacementInstructions:
      "Original verified certificate image linked to public/certificate/legal-metrology-certificate.jpg. When the weighing equipment is restamped in subsequent verification cycles, upload the updated certificate image and update the issueDate and expiryDate fields.",
  },

  // 6. Edible Oil Laboratory Test Report (Micro Tech Diagnostic Centre)
  {
    id: "lab-test-report",
    title: "Accredited Laboratory Analytical Test Report",
    shortTitle: "Micro Tech Lab Test Report",
    category: "testing_report",
    categoryLabel: "Accredited Lab Report",
    status: "verified",
    applicability: "mandatory",
    applicabilityLabel: "Verified Laboratory Testing",
    applicabilityDescription:
      "Independent analytical testing conducted by Micro Tech Diagnostic Centre, an ISO / IEC 17025:2017 Certified Testing Laboratory (Cert No: 241115100101).",
    description:
      "Comprehensive analytical report evaluating nutritional values, fatty acid profiles, FFA levels, and moisture for Sesame Oil, Coconut Oil, Groundnut Oil, and Pure Ghee.",
    longDescription:
      "Analytical test report issued on 08.02.2025 by Micro Tech Diagnostic Centre (ISO/IEC 17025:2017 certified, Coimbatore) for M/s. VS OIL MILL & STORES (Sample Ref: MTL-7822/0101/24-25). Demonstrates superlative cold-pressed purity across all 4 products: Sesame Oil Free Fatty Acids at 0.19% (FSSAI max 1.5%), Coconut Oil FFA at 0.25%, Groundnut Oil FFA at 0.39%, and Pure Cow Ghee FFA at 0.34%, with zero trans fats and 0mg cholesterol across all vegetable oils.",
    documentUrl: "/certificate/vs-oil-mill-lab-testing-report.pdf",
    previewImage: "/certificate/previews/lab-report-preview.png",
    fileType: "pdf",
    fileSize: "3.2 MB",
    certificateNumber: "MTL-7822/0101/24-25",
    issuedBy: "Micro Tech Diagnostic Centre (ISO / IEC 17025:2017 Certified Laboratory)",
    issueDate: "08-02-2025",
    expiryDate: "Current Quality Benchmark",
    productName: "Sesame Oil, Groundnut Oil, Coconut Oil & Cow Ghee",
    verificationAuthority: "Dr. S. Rajkumar (PhD, Lab Head) & Mr. K. Sakthivel (MSc, Chemist)",
    testParameters: [
      {
        parameter: "Free Fatty Acids (Sesame Oil)",
        standardRequirement: "Max 1.5% for Virgin / Cold Pressed (FSSAI)",
        placeholderValue: "0.19% (Superlative Purity)",
        unit: "% w/w",
      },
      {
        parameter: "Free Fatty Acids (Coconut Oil)",
        standardRequirement: "Max 1.5% for Virgin / Cold Pressed (FSSAI)",
        placeholderValue: "0.25% (Superlative Purity)",
        unit: "% w/w",
      },
      {
        parameter: "Free Fatty Acids (Groundnut Oil)",
        standardRequirement: "Max 1.5% for Virgin / Cold Pressed (FSSAI)",
        placeholderValue: "0.39% (Superlative Purity)",
        unit: "% w/w",
      },
      {
        parameter: "Free Fatty Acids (Pure Cow Ghee)",
        standardRequirement: "Max 3.0% (FSSAI Limit)",
        placeholderValue: "0.34% (Exceptional Quality)",
        unit: "% w/w",
      },
      {
        parameter: "Fat Content (Pure Oils)",
        standardRequirement: "Min 99.5%",
        placeholderValue: "99.97% – 99.98%",
        unit: "gm / 100gm",
      },
      {
        parameter: "Trans Fat (All Oils)",
        standardRequirement: "Max 2% (FSSAI Limit)",
        placeholderValue: "0.0 gm (Zero Trans Fat)",
        unit: "gm / 100gm",
      },
      {
        parameter: "Cholesterol (Vegetable Oils)",
        standardRequirement: "0 mg for plant oils",
        placeholderValue: "0.0 mg (Cholesterol Free)",
        unit: "mg / 100gm",
      },
      {
        parameter: "Moisture Content",
        standardRequirement: "Max 0.25% w/w",
        placeholderValue: "0.07% (Groundnut) / 0.08% (Coconut)",
        unit: "% w/w",
      },
    ],
    notes:
      "Verified original laboratory report. The full signed report containing comprehensive nutritional analysis for each oil is available for verified online viewing.",
    replacementInstructions:
      "Original verified document linked to public/certificate/vs-oil-mill-lab-testing-report.pdf. When subsequent periodic batch reports are completed, upload to this path.",
  },
];
