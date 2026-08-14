import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { getPostLoginRoute } from "@/lib/auth/post-login";

export default async function LoginCompletePage() {
  const session = await auth();
  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  redirect(getPostLoginRoute());
}
