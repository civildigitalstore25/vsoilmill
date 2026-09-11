import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";
import { AUTH_COPY } from "@/constants/auth";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted">{AUTH_COPY.loading}</div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
