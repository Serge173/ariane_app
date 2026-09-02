import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageTeam } from "@/lib/user-roles";
import { CatalogueSubNav } from "@/components/admin/catalogue/CatalogueSubNav";
import { BoutiquePageSettingsForm } from "@/components/admin/catalogue/BoutiquePageSettingsForm";
import { getBoutiquePageSettings } from "@/lib/boutique-settings";

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
      <div className="mb-8">
        <h1 className="heading-section mb-2">Page boutique</h1>
        <p className="text-brand-600">
          Contenu éditorial de la section mise en avant sur la boutique publique
        </p>
      </div>

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
