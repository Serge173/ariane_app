import type { ReactNode } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export type AdminSectionLabel =
  | "Administration"
  | "Commerce"
  | "Offre"
  | "Contenu"
  | "Relation"
  | "Système";

const SECTION_OVERLINE: Record<AdminSectionLabel, string> = {
  Administration: "Administration",
  Commerce: "Commerce",
  Offre: "Offre & catalogue",
  Contenu: "Contenu du site",
  Relation: "Relation client",
  Système: "Système",
};

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  section?: AdminSectionLabel;
  action?: ReactNode;
  showAccentRule?: boolean;
  showViewSite?: boolean;
}

export function AdminPageHeader({
  title,
  description,
  section,
  action,
  showAccentRule = false,
  showViewSite = false,
}: AdminPageHeaderProps) {
  const overline = section ? SECTION_OVERLINE[section] : undefined;

  return (
    <PageHeader
      overline={overline}
      title={title}
      description={description}
      action={action}
      showAccentRule={showAccentRule}
      showViewSite={showViewSite}
    />
  );
}
