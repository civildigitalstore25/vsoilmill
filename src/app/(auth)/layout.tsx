import { AuthBrandPanel, AuthMobileBar } from "@/components/features/auth/AuthBrandPanel";
import { LAYOUT } from "@/constants/layout";
import { cn } from "@/lib/utils/cn";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden lg:grid lg:grid-cols-2">
      <AuthMobileBar />
      <AuthBrandPanel />
      <main className={cn(LAYOUT.container, "flex flex-1 items-center justify-center py-4 lg:overflow-hidden lg:py-6")}>
        {children}
      </main>
    </div>
  );
}
