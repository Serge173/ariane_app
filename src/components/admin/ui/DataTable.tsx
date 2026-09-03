"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  mono?: boolean;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  href?: (row: T) => string;
  empty?: ReactNode;
}

export function DataTable<T>({ columns, rows, rowKey, href, empty }: DataTableProps<T>) {
  const router = useRouter();

  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = rowKey(row);
            const rowHref = href?.(row);
            return (
              <tr
                key={key}
                className={cn("admin-table-row", rowHref && "admin-table-row--link")}
                onClick={rowHref ? () => router.push(rowHref) : undefined}
                onKeyDown={
                  rowHref
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(rowHref);
                        }
                      }
                    : undefined
                }
                tabIndex={rowHref ? 0 : undefined}
                role={rowHref ? "link" : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn(col.mono && "font-mono text-xs", col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
