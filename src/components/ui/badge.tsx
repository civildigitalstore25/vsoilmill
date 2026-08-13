import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-accent/20 px-2.5 py-0.5 text-xs font-medium text-dark",
        className,
      )}
      {...props}
    />
  );
}
