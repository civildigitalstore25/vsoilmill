import { LAYOUT } from "@/constants/layout";
import { cn } from "@/lib/utils/cn";
import type { PageContainerProps } from "@/types/layout";

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn(LAYOUT.container, className)}>{children}</div>;
}
