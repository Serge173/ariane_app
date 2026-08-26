import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canManageTeam, TEAM_ROLES } from "@/lib/user-roles";
import {
  getPlatformSettings,
  getDatabaseLabel,
  isCinetPayConfigured,
  maskSecret,
} from "@/lib/platform-settings";
import { AdminSettingsPanel } from "@/components/admin/settings/AdminSettingsPanel";

export default async function AdminParametresPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isAdmin(session.user.role)) {
    redirect("/admin/connexion");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!currentUser) redirect("/admin/connexion");

  const manageTeam = canManageTeam(session.user.role);
  const teamMembers = manageTeam
    ? await prisma.user.findMany({
        where: { role: { in: TEAM_ROLES } },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
        orderBy: [{ role: "asc" }, { lastName: "asc" }],
      })
    : [];

  const platform = await getPlatformSettings();

  const serializedUser = {
    ...currentUser,
    createdAt: currentUser.createdAt.toISOString(),
  };

  const serializedTeam = teamMembers.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Paramètres</h1>
        <p className="text-brand-600">
          Gérez votre compte, l&apos;équipe et la configuration de la plateforme
        </p>
      </div>

      <AdminSettingsPanel
        currentUser={serializedUser}
        teamMembers={serializedTeam}
        canManageTeam={manageTeam}
        platformSettings={{
          appUrl: platform.appUrl,
          whatsappNumber: platform.whatsappNumber,
          cinetpaySiteId: platform.cinetpaySiteId,
          cinetpayNotifyUrl: platform.cinetpayNotifyUrl,
          contactEmail: platform.contactEmail,
          cinetpayApiKey: platform.cinetpayApiKey ? maskSecret(platform.cinetpayApiKey) : "",
          cinetpayConfigured: isCinetPayConfigured(platform),
          database: getDatabaseLabel(),
        }}
      />
    </div>
  );
}
