import { redirect } from "next/navigation";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { USER_ROLES } from "@/constants/auth";
import { auth } from "@/lib/auth/auth";
import { ROUTES } from "@/constants/routes";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== USER_ROLES.ADMIN) {
    redirect(ROUTES.LOGIN);
  }

  return <AdminShell>{children}</AdminShell>;
}
