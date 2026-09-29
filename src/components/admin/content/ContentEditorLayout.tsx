"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContentEditorForm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("content-editor-form", className)}>{children}</div>
  );
}

export function ContentEditorSection({
  index,
  title,
  description,
  children,
  tone = "default",
}: {
  index?: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section
      className={cn(
        "content-editor-section",
        tone === "muted" && "content-editor-section--muted"
      )}
    >
      <header className="content-editor-section-head">
        {index != null && <p className="content-editor-section-num">Section {index}</p>}
        <h2 className="content-editor-section-title">{title}</h2>
        {description && <p className="content-editor-section-desc">{description}</p>}
      </header>
      <div className="content-editor-section-body">{children}</div>
    </section>
  );
}

export function ContentEditorBlock({
  index,
  title,
  children,
  onRemove,
  removeLabel = "Supprimer",
}: {
  index?: number;
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <div className="content-editor-block">
      <div className="content-editor-block-head">
        <p className="content-editor-block-label">
          {index != null ? `Élément ${index} — ` : ""}
          {title}
        </p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="content-editor-block-remove"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden />
            {removeLabel}
          </button>
        )}
      </div>
      <div className="content-editor-block-body">{children}</div>
    </div>
  );
}

export function ContentEditorNote({ children }: { children: React.ReactNode }) {
  return <p className="content-editor-note">{children}</p>;
}

export function ContentEditorFields({ children }: { children: React.ReactNode }) {
  return <div className="content-editor-fields">{children}</div>;
}
