import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { AUTH_COPY } from "@/constants/auth";
import { auth } from "@/lib/auth/auth";
import { getPostLoginRoute } from "@/lib/auth/post-login";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(getPostLoginRoute());
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted">{AUTH_COPY.loading}</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
