import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate, APPOINTMENT_STATUS_LABELS } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { RdvRequestsAdminList } from "@/components/admin/rendez-vous/RdvRequestsAdminList";
import { getDiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";

export default async function AdminRendezVousPage() {
  let appointments: Awaited<ReturnType<typeof getAppointments>> = [];
  let rdvRequests: Awaited<ReturnType<typeof getRdvRequests>> = [];
  let formSettings = await getDiscoveryParcoursSettings();

  try {
    [appointments, rdvRequests, formSettings] = await Promise.all([
      getAppointments(),
      getRdvRequests(),
      getDiscoveryParcoursSettings(),
    ]);
  } catch {}

  const upcoming = appointments.filter((a) => ["SCHEDULED", "CONFIRMED"].includes(a.status));
  const others = appointments.filter((a) => !["SCHEDULED", "CONFIRMED"].includes(a.status));
  const pendingCount = rdvRequests.filter((r) => !r.isRead).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Rendez-vous</h1>
        <p className="text-brand-600">
          {pendingCount} demande{pendingCount !== 1 ? "s" : ""} de RDV en attente · {upcoming.length}{" "}
          rendez-vous confirmé{upcoming.length !== 1 ? "s" : ""} à venir
        </p>
      </div>

      {rdvRequests.length > 0 && (
        <section className="mb-10">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-lg mb-1">Demandes de RDV (parcours de découverte)</h2>
              <p className="text-sm text-brand-500">
                Liste des fiches — voir, modifier, enregistrer, imprimer ou supprimer.
              </p>
            </div>
            <Link
              href="/admin/contenu/parcours-decouverte"
              className="text-xs uppercase tracking-widest text-brand-600 hover:text-brand-950 border border-brand-200 px-3 py-2"
            >
              Modifier le formulaire
            </Link>
          </div>
          <RdvRequestsAdminList
            initialRequests={rdvRequests.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
            formSettings={formSettings}
          />
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-lg mb-4">Rendez-vous confirmés — à venir</h2>
          <p className="text-sm text-brand-500 mb-4">Créneaux liés à un accompagnement acheté ou planifié manuellement.</p>
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <AppointmentRow key={apt.id} apt={apt} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="font-display text-lg mb-4">Historique des rendez-vous</h2>
          <div className="space-y-3">
            {others.map((apt) => (
              <AppointmentRow key={apt.id} apt={apt} />
            ))}
          </div>
        </section>
      )}

      {appointments.length === 0 && rdvRequests.length === 0 && (
        <div className="bg-white border border-brand-100 text-center py-16">
          <p className="text-brand-400">Aucune demande ni rendez-vous</p>
        </div>
      )}
    </div>
  );
}

function AppointmentRow({ apt }: { apt: Awaited<ReturnType<typeof getAppointments>>[0] }) {
  const client = apt.user;
  const guestName = apt.order?.guestFirstName
    ? `${apt.order.guestFirstName} ${apt.order.guestLastName}`
    : apt.order?.guestEmail;

  return (
    <div className="bg-white border border-brand-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {client ? (
          <ProfileAvatar src={client.avatar} firstName={client.firstName} lastName={client.lastName} size="md" />
        ) : (
          <ProfileAvatar name={guestName || "?"} size="md" />
        )}
        <div>
          <p className="font-medium">{client ? `${client.firstName} ${client.lastName}` : guestName}</p>
          <p className="text-sm text-brand-600">
            {formatDate(apt.date)} — {apt.startTime.replace(":", "h")} à {apt.endTime.replace(":", "h")}
          </p>
          <p className="text-xs text-brand-400">
            {apt.order?.items[0]?.product?.name} · {apt.mode}
          </p>
        </div>
      </div>
      <span className="self-start text-[10px] uppercase tracking-wider px-3 py-1 bg-brand-100">
        {APPOINTMENT_STATUS_LABELS[apt.status]}
      </span>
    </div>
  );
}

async function getRdvRequests() {
  return prisma.contactRequest.findMany({
    where: { type: "rdv" },
    orderBy: { createdAt: "desc" },
  });
}

async function getAppointments() {
  return prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: { user: true, order: { include: { items: { include: { product: true } } } } },
  });
}
