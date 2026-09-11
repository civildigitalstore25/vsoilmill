import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { auth } from "@/lib/auth/auth";
import { getPostLoginRoute } from "@/lib/auth/post-login";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect(getPostLoginRoute());
  }

  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );

  return <RegisterForm googleEnabled={googleEnabled} />;
}
