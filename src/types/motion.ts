import type { ReactNode } from "react";

export type StaggerTrigger = "view" | "mount";

export interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  trigger?: StaggerTrigger;
}
