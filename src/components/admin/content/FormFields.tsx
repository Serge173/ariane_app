"use client";

export function Field({
  label,
  value,
  onChange,
  disabled,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={4}
          className="input-field resize-y min-h-[4.5rem]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="input-field"
        />
      )}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-brand-100 p-6 space-y-5">
      <h2 className="font-display text-xl">{title}</h2>
      {children}
    </section>
  );
}

export function SaveButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
      {loading ? "Enregistrement..." : label}
    </button>
  );
}
