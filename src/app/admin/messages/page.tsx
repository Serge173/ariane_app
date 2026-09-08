import Link from "next/link";
import prisma from "@/lib/prisma";

const typeLabels: Record<string, string> = {
  general: "Contact général",
  entreprise: "Demande entreprise",
  diagnostic: "Diagnostic sur-mesure",
  rdv: "Demande de RDV",
};

const typeStyles: Record<string, string> = {
  rdv: "bg-accent/15 text-brand-950",
  general: "bg-brand-100 text-brand-700",
  entreprise: "bg-brand-100 text-brand-700",
  diagnostic: "bg-brand-100 text-brand-700",
};

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  try {
    messages = await getMessages();
  } catch {}

  const contactMessages = messages.filter((m) => m.type !== "rdv");
  const unread = contactMessages.filter((m) => !m.isRead).length;
  const rdvCount = messages.filter((m) => m.type === "rdv").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Messages</h1>
        <p className="text-brand-600">
          {unread} message{unread !== 1 ? "s" : ""} non lu{unread !== 1 ? "s" : ""}
          {rdvCount > 0 && (
            <>
              {" "}
              · {rdvCount} demande{rdvCount !== 1 ? "s" : ""} de RDV dans{" "}
              <Link href="/admin/rendez-vous" className="underline underline-offset-2">
                Rendez-vous
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {contactMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white border p-6 ${!msg.isRead ? "border-brand-950 shadow-sm" : "border-brand-100"}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-medium">
                  {msg.firstName} {msg.lastName}
                </p>
                <p className="text-sm text-brand-600">
                  {msg.email}
                  {msg.phone && ` · ${msg.phone}`}
                </p>
                {msg.company && <p className="text-xs text-brand-400">{msg.company}</p>}
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 ${typeStyles[msg.type] ?? "bg-brand-100"}`}
                >
                  {typeLabels[msg.type] || msg.type}
                </span>
                <p className="text-xs text-brand-400 mt-1">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
            <p className="text-sm text-brand-700 leading-relaxed whitespace-pre-line">{msg.message}</p>
          </div>
        ))}
        {contactMessages.length === 0 && (
          <div className="bg-white border border-brand-100 text-center py-16">
            <p className="text-brand-400">Aucun message de contact</p>
            {rdvCount > 0 && (
              <p className="text-sm text-brand-500 mt-2">
                Les demandes de RDV sont dans{" "}
                <Link href="/admin/rendez-vous" className="underline underline-offset-2">
                  Rendez-vous
                </Link>
                .
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

async function getMessages() {
  return prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
}
