import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/features/auth/ResetPasswordForm";
import { AUTH_COPY } from "@/constants/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted">{AUTH_COPY.loading}</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
