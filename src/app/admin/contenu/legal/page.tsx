import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { ContentSubNav } from "@/components/admin/content/ContentSubNav";
import { LegalSettingsForm } from "@/components/admin/content/PublicPagesForms";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { cn } from "@/lib/utils";

const legalTabs = [
  { id: "cgv", label: "CGV", href: "/admin/contenu/legal?tab=cgv" },
  { id: "confidentialite", label: "Confidentialité", href: "/admin/contenu/legal?tab=confidentialite" },
  { id: "mentionsLegales", label: "Mentions légales", href: "/admin/contenu/legal?tab=mentionsLegales" },
] as const;

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminLegalContentPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const settings = await getPublicPagesSettings();
  const params = await searchParams;
  const tab = legalTabs.some((t) => t.id === params.tab) ? (params.tab as (typeof legalTabs)[number]["id"]) : "cgv";

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Pages légales</h1>
        <p className="text-brand-600">CGV, confidentialité et mentions légales</p>
      </div>
      <ContentSubNav active="legal" />
      <nav className="flex flex-wrap gap-2 mb-6">
        {legalTabs.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "px-3 py-1.5 text-xs border rounded-sm",
              tab === item.id ? "border-brand-950 bg-brand-950 text-white" : "border-brand-200 text-brand-600"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <LegalSettingsForm initial={settings.legal} canEdit={canManageTeam(session?.user?.role)} page={tab} />
    </div>
  );
}
