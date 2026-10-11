"use client";

import { useCallback, useRef, useState } from "react";
import { Eye, Pencil, Save, Trash2, Printer, X } from "lucide-react";
import type { DiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";
import { normalizeDiscoveryAnswers, type DiscoveryAnswers } from "@/lib/discovery-parcours-questions";
import { useRouter } from "next/navigation";

export type RdvRequestRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  metadata: unknown;
  isRead: boolean;
  createdAt: string;
};

type ModalMode = "view" | "edit" | null;

function parseMetadata(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return {
      objective: "",
      mode: "",
      date: "",
      time: "",
      discoveryAnswers: {} as DiscoveryAnswers,
    };
  }
  const o = raw as Record<string, unknown>;
  return {
    objective: typeof o.objective === "string" ? o.objective : "",
    mode: typeof o.mode === "string" ? o.mode : "",
    date: typeof o.date === "string" ? o.date : "",
    time: typeof o.time === "string" ? o.time : "",
    discoveryAnswers: o.discoveryAnswers,
  };
}

function modeSelectValue(modeLabel: string): string {
  if (modeLabel.includes("Digital")) return "DIGITAL";
  if (modeLabel.includes("Hybride")) return "HYBRID";
  return "IN_PERSON";
}

export function RdvRequestsAdminList({
  initialRequests,
  formSettings,
}: {
  initialRequests: RdvRequestRow[];
  formSettings: DiscoveryParcoursSettings;
}) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RdvRequestRow | null>(null);
  const [draftMeta, setDraftMeta] = useState({
    date: "",
    time: "",
    mode: "IN_PERSON",
    objective: "",
  });
  const [draftAnswers, setDraftAnswers] = useState<DiscoveryAnswers>(() =>
    normalizeDiscoveryAnswers({}, formSettings)
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const openFiche = (req: RdvRequestRow, mode: "view" | "edit") => {
    const meta = parseMetadata(req.metadata);
    setActiveId(req.id);
    setModalMode(mode);
    setDraft({ ...req });
    setDraftMeta({
      date: meta.date,
      time: meta.time,
      mode: modeSelectValue(meta.mode),
      objective: meta.objective,
    });
    setDraftAnswers(normalizeDiscoveryAnswers(meta.discoveryAnswers, formSettings));
    setFeedback("");
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveId(null);
    setDraft(null);
  };

  const save = async () => {
    if (!draft) return;
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch(`/api/admin/rdv-requests/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          email: draft.email,
          phone: draft.phone ?? "",
          date: draftMeta.date,
          time: draftMeta.time,
          mode: draftMeta.mode,
          objective: draftMeta.objective,
          discoveryAnswers: draftAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enregistrement impossible");

      setRequests((list) =>
        list.map((r) =>
          r.id === draft.id
            ? {
                ...r,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                message: data.message,
                metadata: data.metadata,
                isRead: data.isRead,
              }
            : r
        )
      );
      setFeedback("Fiche enregistrée.");
      setModalMode("view");
      router.refresh();
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const markTreated = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rdv-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setRequests((list) =>
        list.map((r) => (r.id === id ? { ...r, isRead: true, message: data.message ?? r.message } : r))
      );
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement cette demande de RDV ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rdv-requests/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Suppression impossible");
      }
      setRequests((list) => list.filter((r) => r.id !== id));
      if (activeId === id) closeModal();
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const printFiche = useCallback(() => {
    window.print();
  }, []);

  const setAnswerLine = (questionId: string, index: number, value: string) => {
    setDraftAnswers((prev) => {
      const lines = [...(prev[questionId] ?? [])];
      lines[index] = value;
      return { ...prev, [questionId]: lines };
    });
  };

  if (requests.length === 0) {
    return (
      <div className="admin-panel text-center py-12 text-brand-500 text-sm">
        Aucune demande de RDV pour le moment.
      </div>
    );
  }

  const editing = modalMode === "edit";

  return (
    <>
      <div className="admin-table-wrap admin-panel overflow-x-auto">
        <table className="admin-table w-full min-w-[880px]">
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Contact</th>
              <th>Créneau souhaité</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const meta = parseMetadata(req.metadata);
              return (
                <tr key={req.id} className="admin-table-row">
                  <td className="text-sm text-brand-600 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="text-sm font-medium">
                    {req.lastName} {req.firstName}
                  </td>
                  <td className="text-sm text-brand-600">
                    <div>{req.email}</div>
                    {req.phone ? <div className="text-xs">{req.phone}</div> : null}
                  </td>
                  <td className="text-sm text-brand-600">
                    {meta.date ? (
                      <>
                        {meta.date} · {meta.time?.replace(":", "h") ?? "—"}
                        {meta.mode ? (
                          <div className="text-xs text-brand-400">{meta.mode}</div>
                        ) : null}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 border ${
                        req.isRead
                          ? "border-brand-200 text-brand-500"
                          : "border-accent/40 bg-accent/10 text-brand-800"
                      }`}
                    >
                      {req.isRead ? "Traité" : "À traiter"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap justify-end gap-1">
                      <ActionBtn
                        label="Fiche"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => openFiche(req, "view")}
                      />
                      <ActionBtn
                        label="Modifier"
                        icon={<Pencil className="w-3.5 h-3.5" />}
                        onClick={() => openFiche(req, "edit")}
                      />
                      <ActionBtn
                        label="Enregistrer"
                        icon={<Save className="w-3.5 h-3.5" />}
                        onClick={() => void markTreated(req.id)}
                        title="Marquer comme traité"
                        disabled={loading || req.isRead}
                      />
                      <ActionBtn
                        label="Imprimer"
                        icon={<Printer className="w-3.5 h-3.5" />}
                        onClick={() => {
                          openFiche(req, "view");
                          setTimeout(() => printFiche(), 150);
                        }}
                      />
                      <ActionBtn
                        label="Supprimer"
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        danger
                        onClick={() => void remove(req.id)}
                        disabled={loading}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalMode && draft && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-brand-950/45">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-brand-100 bg-white px-4 py-3 print:hidden">
              <p className="font-display text-lg">
                Fiche RDV — {draft.lastName} {draft.firstName}
              </p>
              <button type="button" onClick={closeModal} className="p-2 hover:bg-brand-50" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={printRef} className="p-4 sm:p-6 space-y-5 rdv-fiche-print">
              <p className="text-xs text-brand-500 print:text-black">
                Reçue le {new Date(draft.createdAt).toLocaleString("fr-FR")}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Nom"
                  value={draft.lastName}
                  onChange={(v) => setDraft({ ...draft, lastName: v })}
                  readOnly={!editing}
                />
                <Field
                  label="Prénoms"
                  value={draft.firstName}
                  onChange={(v) => setDraft({ ...draft, firstName: v })}
                  readOnly={!editing}
                />
                <Field
                  label="Email"
                  value={draft.email}
                  onChange={(v) => setDraft({ ...draft, email: v })}
                  readOnly={!editing}
                />
                <Field
                  label="Téléphone"
                  value={draft.phone ?? ""}
                  onChange={(v) => setDraft({ ...draft, phone: v })}
                  readOnly={!editing}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Field
                  label="Date souhaitée"
                  type="date"
                  value={draftMeta.date}
                  onChange={(v) => setDraftMeta({ ...draftMeta, date: v })}
                  readOnly={!editing}
                />
                <Field
                  label="Heure"
                  value={draftMeta.time}
                  onChange={(v) => setDraftMeta({ ...draftMeta, time: v })}
                  readOnly={!editing}
                  placeholder="09:00"
                />
                <div>
                  <label className="label-field">Mode</label>
                  {editing ? (
                    <select
                      className="input-field"
                      value={draftMeta.mode}
                      onChange={(e) => setDraftMeta({ ...draftMeta, mode: e.target.value })}
                    >
                      <option value="IN_PERSON">Présentiel (Abidjan)</option>
                      <option value="DIGITAL">100% Digital</option>
                      <option value="HYBRID">Hybride</option>
                    </select>
                  ) : (
                    <p className="text-sm py-3 border-b border-brand-100">
                      {draftMeta.mode === "DIGITAL"
                        ? "100% Digital"
                        : draftMeta.mode === "HYBRID"
                          ? "Hybride"
                          : "Présentiel (Abidjan)"}
                    </p>
                  )}
                </div>
              </div>

              {draftMeta.objective || editing ? (
                <Field
                  label="Objectif (optionnel)"
                  value={draftMeta.objective}
                  onChange={(v) => setDraftMeta({ ...draftMeta, objective: v })}
                  readOnly={!editing}
                  multiline
                />
              ) : null}

              <div>
                <p className="label-field mb-3">Questionnaire parcours de découverte</p>
                <div className="space-y-4">
                  {formSettings.questions.map((q) => {
                    const lines = draftAnswers[q.id] ?? [];
                    const filled = lines.some((l) => l.trim());
                    if (!filled && !editing) return null;
                    return (
                      <div key={q.id} className="border border-brand-100 p-3 bg-brand-50/40">
                        <p className="text-sm font-medium mb-2">{q.label}</p>
                        {editing ? (
                          <div className="space-y-2">
                            {lines.map((line, i) => (
                              <input
                                key={i}
                                className="input-field text-sm"
                                value={line}
                                onChange={(e) => setAnswerLine(q.id, i, e.target.value)}
                              />
                            ))}
                          </div>
                        ) : (
                          <ul className="text-sm text-brand-700 space-y-1 list-disc pl-5">
                            {lines.filter((l) => l.trim()).map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-brand-100 bg-white p-4 print:hidden">
              {editing ? (
                <>
                  <button
                    type="button"
                    className="btn-primary inline-flex items-center gap-2"
                    onClick={() => void save()}
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" /> Enregistrer
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setModalMode("view")}>
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-secondary inline-flex items-center gap-2"
                    onClick={() => setModalMode("edit")}
                  >
                    <Pencil className="w-4 h-4" /> Modifier
                  </button>
                  <button
                    type="button"
                    className="btn-secondary inline-flex items-center gap-2"
                    onClick={printFiche}
                  >
                    <Printer className="w-4 h-4" /> Imprimer
                  </button>
                  <button
                    type="button"
                    className="btn-secondary inline-flex items-center gap-2 text-red-700 border-red-200"
                    onClick={() => void remove(draft.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </>
              )}
              {feedback ? <p className="text-sm text-brand-600 w-full">{feedback}</p> : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActionBtn({
  label,
  icon,
  onClick,
  danger,
  disabled,
  title,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title ?? label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wide border transition-colors ${
        danger
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-brand-200 text-brand-700 hover:border-brand-950 hover:bg-brand-50"
      } disabled:opacity-40`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  multiline,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {readOnly ? (
        <p className="text-sm py-2 border-b border-brand-100 min-h-[2.5rem]">{value || "—"}</p>
      ) : multiline ? (
        <textarea
          className="input-field min-h-[72px] text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="input-field text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
