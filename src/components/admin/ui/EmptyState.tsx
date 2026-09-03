import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
}

export function EmptyState({ title, description, action, children }: EmptyStateProps) {
  return (
    <div className="admin-empty">
      <p className="admin-empty-title">{title}</p>
      {description ? <p className="admin-empty-desc">{description}</p> : null}
      {children}
      {action ? (
        <Link href={action.href} className="admin-btn-primary mt-4 inline-flex">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
