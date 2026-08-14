import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-dark md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminAddButton({
  label,
  onClick,
  href,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <>
      <Plus className="h-4 w-4" />
      {label}
    </>
  );

  if (href) {
    return (
      <Button asChild>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return <Button onClick={onClick}>{content}</Button>;
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card shadow-[0_1px_0_rgba(26,26,22,0.04),0_8px_24px_rgba(26,26,22,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  tone?: "primary" | "accent" | "dark" | "muted";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    dark: "bg-dark/5 text-dark",
    muted: "bg-cream-dark text-muted",
  } as const;

  return (
    <AdminCard className="p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {label}
          </p>
          <p className="mt-3 font-display text-3xl text-dark">{value}</p>
          {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          {icon}
        </div>
      </div>
    </AdminCard>
  );
}

export function AdminStatusPill({
  active,
  label,
}: {
  active: boolean;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-primary/10 text-primary"
          : "bg-cream-dark text-muted",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-primary" : "bg-muted",
        )}
      />
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}
