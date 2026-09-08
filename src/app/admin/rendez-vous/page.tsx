import prisma from "@/lib/prisma";
import { formatDate, APPOINTMENT_STATUS_LABELS } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default async function AdminRendezVousPage() {
  let appointments: Awaited<ReturnType<typeof getAppointments>> = [];
  let rdvRequests: Awaited<ReturnType<typeof getRdvRequests>> = [];
  try {
    [appointments, rdvRequests] = await Promise.all([getAppointments(), getRdvRequests()]);
  } catch {}

  const upcoming = appointments.filter((a) => ["SCHEDULED", "CONFIRMED"].includes(a.status));
  const others = appointments.filter((a) => !["SCHEDULED", "CONFIRMED"].includes(a.status));
  const pendingRdv = rdvRequests.filter((r) => !r.isRead);
  const readRdv = rdvRequests.filter((r) => r.isRead);

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Rendez-vous</h1>
        <p className="text-brand-600">
          {pendingRdv.length} demande{pendingRdv.length !== 1 ? "s" : ""} de RDV en attente · {upcoming.length}{" "}
          rendez-vous confirmé{upcoming.length !== 1 ? "s" : ""} à venir
        </p>
      </div>

      {(pendingRdv.length > 0 || readRdv.length > 0) && (
        <section className="mb-10">
          <h2 className="font-display text-lg mb-1">Demandes de RDV (formulaire site)</h2>
          <p className="text-sm text-brand-500 mb-4">
            Soumissions via le bouton « Prendre rdv ! » ou le formulaire /reservation?intent=rdv — sans achat boutique.
          </p>
          <div className="space-y-3">
            {pendingRdv.map((req) => (
              <RdvRequestRow key={req.id} req={req} pending />
            ))}
            {readRdv.map((req) => (
              <RdvRequestRow key={req.id} req={req} />
            ))}
          </div>
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

function RdvRequestRow({
  req,
  pending,
}: {
  req: Awaited<ReturnType<typeof getRdvRequests>>[0];
  pending?: boolean;
}) {
  return (
    <div
      className={`bg-white border p-5 ${pending ? "border-accent/40 shadow-sm" : "border-brand-100"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-medium">
            {req.firstName} {req.lastName}
          </p>
          <p className="text-sm text-brand-600">
            {req.email}
            {req.phone && ` · ${req.phone}`}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-accent/15">
            Demande de RDV
          </span>
          <p className="text-xs text-brand-400 mt-1">{new Date(req.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>
      <p className="text-sm text-brand-700 leading-relaxed whitespace-pre-line">{req.message}</p>
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
