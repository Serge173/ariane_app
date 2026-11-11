import prisma from "@/lib/prisma";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default async function AdminClientsPage() {
  let clients: Awaited<ReturnType<typeof getClients>> = [];
  try {
    clients = await getClients();
  } catch {}

  return (
    <div>
      <AdminPageHeader
        section="Commerce"
        title="Clients"
        description={`${clients.length} client${clients.length !== 1 ? "s" : ""} enregistré${clients.length !== 1 ? "s" : ""}`}
      />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Commandes</th>
              <th>Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="admin-table-row">
                <td>
                  <ProfileAvatar
                    src={client.avatar}
                    firstName={client.firstName}
                    lastName={client.lastName}
                    size="md"
                  />
                </td>
                <td className="font-medium">
                  {client.firstName} {client.lastName}
                </td>
                <td>{client.email}</td>
                <td>{client.phone || "—"}</td>
                <td>
                  <span className="admin-status admin-status--attention px-2 py-0.5 rounded-md text-xs">
                    {client._count.orders}
                  </span>
                </td>
                <td>{new Date(client.createdAt).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && (
          <p className="text-center admin-page-desc py-12">Aucun client</p>
        )}
      </div>
    </div>
  );
}

async function getClients() {
  return prisma.user.findMany({
    where: { role: "CLIENT" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
}
