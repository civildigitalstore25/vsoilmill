import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/features/profile/ProfileClient";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "My Profile",
  description: "Manage your VS OilMill account and order history.",
  path: "/profile",
});

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.PROFILE}`);
  }

  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading…</div>}>
      <ProfileClient />
    </Suspense>
  );
}
