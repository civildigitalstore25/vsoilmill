"use client";

const SELECT_CLASS =
  "h-9 w-full min-w-[9.5rem] rounded-md border border-border bg-card px-2.5 text-sm text-dark";

export function AdminOrderFieldSelect({
  label,
  value,
  options,
  onChange,
  showLabel = true,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  showLabel?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      {showLabel ? (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
      ) : null}
      <select
        className={SELECT_CLASS}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
