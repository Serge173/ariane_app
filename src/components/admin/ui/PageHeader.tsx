import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  overline?: string;
  action?: ReactNode;
  showViewSite?: boolean;
  showAccentRule?: boolean;
}

export function PageHeader({
  title,
  description,
  overline,
  action,
  showViewSite,
  showAccentRule = false,
}: PageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div className="min-w-0 flex-1">
        {overline ? <p className="admin-page-overline">{overline}</p> : null}
        <h1 className="admin-page-title">{title}</h1>
        {description ? <p className="admin-page-desc">{description}</p> : null}
        {showAccentRule ? <span className="admin-page-accent-rule" aria-hidden /> : null}
      </div>
      {(showViewSite || action) && (
        <div
          className={cn(
            "shrink-0 flex flex-wrap items-center gap-3",
            !action && showViewSite && "hidden lg:flex"
          )}
        >
          {showViewSite ? (
            <Link href="/" target="_blank" className="admin-btn-outline admin-btn-view-site">
              Voir le site
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          ) : null}
          {action}
        </div>
      )}
    </div>
  );
}

export function PageHeaderLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="admin-btn-primary">
      {children}
    </Link>
  );
}
