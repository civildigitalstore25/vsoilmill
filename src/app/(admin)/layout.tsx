import { redirect } from "next/navigation";
import { AdminShell } from "@/components/features/admin/AdminShell";
import { auth } from "@/lib/auth/auth";
import { ROUTES } from "@/constants/routes";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect(ROUTES.LOGIN);
  }

  return <AdminShell>{children}</AdminShell>;
}
