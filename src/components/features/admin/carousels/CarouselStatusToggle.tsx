"use client";

import { cn } from "@/lib/utils/cn";

interface CarouselStatusToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  showLabel?: boolean;
  className?: string;
}

export function CarouselStatusToggle({
  checked,
  onChange,
  disabled = false,
  id = "carousel-status-toggle",
  showLabel = true,
  className,
}: CarouselStatusToggleProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>

      {showLabel && (
        <span
          className={cn(
            "text-xs font-medium transition-colors",
            checked ? "text-primary" : "text-muted",
          )}
        >
          {checked ? "Active" : "Inactive"}
        </span>
      )}
    </div>
  );
}
