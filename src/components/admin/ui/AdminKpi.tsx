import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminKpiProps {
  label: string;
  value: string | number;
  href?: string;
  highlight?: boolean;
  icon: LucideIcon;
}

export function AdminKpi({ label, value, href, highlight, icon: Icon }: AdminKpiProps) {
  const inner = (
    <>
      <div className="admin-kpi-head">
        <p className="admin-kpi-label">{label}</p>
        <span className="admin-kpi-icon-wrap" aria-hidden>
          <Icon className="w-5 h-5 text-admin-accent" strokeWidth={1.5} />
        </span>
      </div>
      <p className={cn("admin-kpi-value", highlight && "admin-kpi-value--highlight")}>
        {value}
        {highlight ? <span className="admin-kpi-dot" aria-hidden /> : null}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="admin-kpi admin-kpi--link">
        {inner}
      </Link>
    );
  }

  return <div className="admin-kpi">{inner}</div>;
}

interface DashboardPanelProps {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardPanel({
  title,
  href,
  linkLabel = "Voir tout",
  children,
  className,
}: DashboardPanelProps) {
  return (
    <section className={cn("admin-panel", className)}>
      <div className="admin-panel-head">
        <h2 className="admin-panel-title">{title}</h2>
        {href ? (
          <Link href={href} className="admin-panel-link">
            {linkLabel}
            <span aria-hidden> →</span>
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function DashboardRow({
  href,
  primary,
  secondary,
  meta,
  status,
}: {
  href: string;
  primary: string;
  secondary?: string;
  meta?: string;
  status?: React.ReactNode;
}) {
  return (
    <Link href={href} className="admin-dash-row">
      <div className="min-w-0">
        <p className="admin-dash-row-primary truncate">{primary}</p>
        {secondary ? <p className="admin-dash-row-secondary truncate">{secondary}</p> : null}
      </div>
      <div className="text-right shrink-0 ml-4">
        {meta ? <p className="admin-dash-row-meta">{meta}</p> : null}
        {status}
      </div>
    </Link>
  );
}
