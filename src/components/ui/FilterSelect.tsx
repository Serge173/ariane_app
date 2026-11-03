"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FilterSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "onChange" | "children"
> & {
  value: string;
  allValue?: string;
  allLabel: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
};

/**
 * Filtre « tout » : pas de doublon dans la liste quand l’option globale est déjà active.
 */
export function FilterSelect({
  value,
  allValue = "all",
  allLabel,
  onValueChange,
  className,
  children,
  ...rest
}: FilterSelectProps) {
  const isAll = value === allValue;
  const selectValue = isAll ? "" : value;

  return (
    <select
      {...rest}
      className={cn(className)}
      value={selectValue}
      onChange={(e) => {
        const next = e.target.value;
        onValueChange(next === "" ? allValue : next);
      }}
    >
      {isAll ? (
        <option value="" disabled hidden>
          {allLabel}
        </option>
      ) : (
        <option value={allValue}>{allLabel}</option>
      )}
      {children}
    </select>
  );
}
