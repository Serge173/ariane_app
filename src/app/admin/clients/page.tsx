import prisma from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default async function AdminClientsPage() {
  let clients: Awaited<ReturnType<typeof getClients>> = [];
  try { clients = await getClients(); } catch {}

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Clients</h1>
        <p className="text-brand-600">{clients.length} client{clients.length !== 1 ? "s" : ""} enregistré{clients.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white border border-brand-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-left bg-brand-50">
              <th className="py-4 px-4 font-medium text-brand-500">Photo</th>
              <th className="py-4 px-4 font-medium text-brand-500">Nom</th>
              <th className="py-4 px-4 font-medium text-brand-500">Email</th>
              <th className="py-4 px-4 font-medium text-brand-500">Téléphone</th>
              <th className="py-4 px-4 font-medium text-brand-500">Commandes</th>
              <th className="py-4 px-4 font-medium text-brand-500">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                <td className="py-4 px-4">
                  <ProfileAvatar src={client.avatar} firstName={client.firstName} lastName={client.lastName} size="md" />
                </td>
                <td className="py-4 px-4 font-medium">{client.firstName} {client.lastName}</td>
                <td className="py-4 px-4 text-brand-600">{client.email}</td>
                <td className="py-4 px-4 text-brand-600">{client.phone || "—"}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-brand-100 text-xs">{client._count.orders}</span>
                </td>
                <td className="py-4 px-4 text-brand-400">
                  {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 && <p className="text-center text-brand-400 py-12">Aucun client</p>}
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
