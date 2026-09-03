import { cn } from "@/lib/utils";
import type { AdminStatusTone } from "@/lib/admin-status";

interface StatusDotProps {
  label: string;
  tone?: AdminStatusTone;
  className?: string;
}

export function StatusDot({ label, tone = "neutral", className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "admin-status",
        tone === "attention" && "admin-status--attention",
        tone === "ink" && "admin-status--ink",
        tone === "muted" && "admin-status--muted",
        className
      )}
    >
      <span className="admin-status-dot" aria-hidden />
      {label}
    </span>
  );
}
