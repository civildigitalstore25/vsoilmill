import React from "react";
import { ShieldAlert, CheckCircle, Scale, FileCheck } from "lucide-react";

export function CertificateTrustNotice() {
  return (
    <section className="rounded-2xl border border-emerald-300/80 bg-gradient-to-r from-emerald-50/80 via-emerald-100/30 to-stone-50 p-6 shadow-xs sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-200/80 text-emerald-900 shadow-2xs">
          <CheckCircle className="h-6 w-6 text-emerald-800" />
        </div>

        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-200/60 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Scale className="h-3.5 w-3.5" />
            <span>100% Verified Credentials Notice</span>
          </div>

          <h2 className="mt-2 font-display text-lg font-bold text-dark sm:text-xl">
            Authenticity & Consumer Safety Commitment
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-dark/80 sm:text-sm">
            At <strong>VS OilMill</strong>, consumer trust is our most valued ingredient.
            Every certificate, statutory license, enterprise registration, and laboratory report displayed
            on this page is an authentic, confirmed document issued by the Government of Tamil Nadu,
            the Government of India, or an ISO/IEC 17025 accredited laboratory:
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2.5 rounded-xl bg-white/85 p-3 text-xs text-dark/80 shadow-2xs">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <strong className="block font-semibold text-dark">Official Government Licenses</strong>
                <span>FSSAI State Manufacturing License, FSSAI Madurai Store Registration, GSTIN, and MSME credentials.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-white/85 p-3 text-xs text-dark/80 shadow-2xs">
              <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <strong className="block font-semibold text-dark">Accredited Laboratory Reports</strong>
                <span>ISO/IEC 17025 certified analytical testing covering Sesame, Coconut, Groundnut oils, and pure Cow Ghee.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-white/85 p-3 text-xs text-dark/80 shadow-2xs">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <strong className="block font-semibold text-dark">Zero Mock Data Guarantee</strong>
                <span>No mock templates or unverified placeholders. All records are available for secure, verified on-screen viewing.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
