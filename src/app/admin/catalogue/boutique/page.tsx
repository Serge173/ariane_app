import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { BoutiquePageSettingsForm } from "@/components/admin/catalogue/BoutiquePageSettingsForm";
import { getBoutiquePageSettings } from "@/lib/boutique-settings";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default async function AdminBoutiquePageSettingsPage() {
  const session = await getServerSession(authOptions);
  const canEdit = canManageTeam(session?.user?.role);

  const [settings, products] = await Promise.all([
    getBoutiquePageSettings(),
    prisma.product
      .findMany({
        where: { productType: "LUXE", isActive: true },
        include: { brandRef: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      })
      .catch(() => []),
  ]);

  return (
    <div>
      <AdminPageHeader
        section="Offre"
        title="Page boutique"
        description="Contenu éditorial de la section mise en avant sur la boutique publique"
      />

      <CatalogueSubNav active="boutique" />

      <BoutiquePageSettingsForm
        initial={settings}
        canEdit={canEdit}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brandRef?.name || p.brand,
          isFeatured: p.isFeatured,
        }))}
      />
    </div>
  );
}
