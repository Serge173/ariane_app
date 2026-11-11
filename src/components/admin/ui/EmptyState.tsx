import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "panel";
}

export function EmptyState({
  title,
  description,
  action,
  children,
  icon: Icon,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div className={variant === "panel" ? "admin-empty admin-empty--panel" : "admin-empty"}>
      {Icon ? (
        <div className="admin-empty-icon-wrap" aria-hidden>
          <Icon className="w-10 h-10 text-admin-accent/70" strokeWidth={1.25} />
        </div>
      ) : null}
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
