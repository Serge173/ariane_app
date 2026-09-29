"use client";

import {
  ContentEditorBlock,
  ContentEditorFields,
  ContentEditorForm,
  ContentEditorNote,
  ContentEditorSection,
} from "@/components/admin/content/ContentEditorLayout";

export { ContentEditorBlock, ContentEditorFields, ContentEditorForm, ContentEditorNote };

export function Field({
  label,
  value,
  onChange,
  disabled,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {hint && <p className="text-xs text-brand-500 mb-1.5">{hint}</p>}
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

export function Section({
  index,
  title,
  description,
  children,
  tone,
}: {
  index: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <ContentEditorSection index={index} title={title} description={description} tone={tone}>
      {children}
    </ContentEditorSection>
  );
}

export function SaveButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <div className="content-editor-save-bar">
      <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
        {loading ? "Enregistrement..." : label}
      </button>
    </div>
  );
}
