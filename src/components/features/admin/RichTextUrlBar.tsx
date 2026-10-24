"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  submitLabel: string;
}

export function RichTextUrlBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  submitLabel,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-cream/30 px-3 py-2">
      <input
        type="url"
        className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary/40"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
      >
        {submitLabel}
      </button>
    </div>
  );
}
