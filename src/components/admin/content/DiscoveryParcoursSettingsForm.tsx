"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import {
  Field,
  Section,
  SaveButton,
  ContentEditorBlock,
  ContentEditorFields,
  ContentEditorForm,
  ContentEditorNote,
} from "@/components/admin/content/FormFields";
import type { DiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";
import { parseJsonResponse } from "@/lib/fetch-json";

export function DiscoveryParcoursSettingsForm({
  initial,
  canEdit,
}: {
  initial: DiscoveryParcoursSettings;
  canEdit: boolean;
}) {
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discovery-parcours", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await parseJsonResponse<DiscoveryParcoursSettings & { error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Enregistrement impossible");
      if (data) setForm(data);
      showSuccess("Formulaire parcours de découverte mis à jour — le site public est synchronisé.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (index: number, patch: Partial<DiscoveryParcoursSettings["questions"][0]>) => {
    const questions = [...form.questions];
    questions[index] = { ...questions[index], ...patch };
    setForm({ ...form, questions });
  };

  return (
    <>
      {FeedbackModal}
      <form onSubmit={submit} className="contents">
        <ContentEditorForm>
          <Section index={1} title="En-tête (comme sur le PDF)">
            <ContentEditorFields>
              <Field
                label="Titre principal"
                value={form.header.title}
                onChange={(v) => setForm({ ...form, header: { ...form.header, title: v } })}
                disabled={!canEdit}
              />
              <Field
                label="Sous-titre"
                value={form.header.subtitle}
                onChange={(v) => setForm({ ...form, header: { ...form.header, subtitle: v } })}
                disabled={!canEdit}
              />
              <Field
                label="Contact affiché"
                value={form.header.contact}
                onChange={(v) => setForm({ ...form, header: { ...form.header, contact: v } })}
                disabled={!canEdit}
              />
              <Field
                label="Texte d'introduction"
                value={form.intro}
                onChange={(v) => setForm({ ...form, intro: v })}
                disabled={!canEdit}
                multiline
              />
            </ContentEditorFields>
          </Section>

          <Section index={2} title="Coordonnées & objectif">
            <ContentEditorFields>
              <Field
                label="Bannière coordonnées"
                value={form.coordsBanner}
                onChange={(v) => setForm({ ...form, coordsBanner: v })}
                disabled={!canEdit}
              />
              <Field
                label="Libellé objectif (optionnel)"
                value={form.objectiveLabel}
                onChange={(v) => setForm({ ...form, objectiveLabel: v })}
                disabled={!canEdit}
              />
              <Field
                label="Placeholder objectif"
                value={form.objectivePlaceholder}
                onChange={(v) => setForm({ ...form, objectivePlaceholder: v })}
                disabled={!canEdit}
              />
            </ContentEditorFields>
          </Section>

          <Section index={3} title="Questions du questionnaire">
            <ContentEditorNote>
              Même contenu que le formulaire public (/reservation?intent=rdv). Ne changez pas l&apos;identifiant
              technique (id) d&apos;une question existante si vous souhaitez conserver l&apos;historique des réponses.
            </ContentEditorNote>
            {form.questions.map((q, i) => (
              <ContentEditorBlock key={q.id} index={i + 1} title={q.label.slice(0, 48) || `Question ${i + 1}`}>
                <Field
                  label="Identifiant technique"
                  value={q.id}
                  onChange={(v) => updateQuestion(i, { id: v.replace(/\s+/g, "_") })}
                  disabled={!canEdit}
                />
                <Field
                  label="Question"
                  value={q.label}
                  onChange={(v) => updateQuestion(i, { label: v })}
                  disabled={!canEdit}
                  multiline
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field
                    label="Lignes au départ"
                    value={String(q.defaultLines)}
                    onChange={(v) => {
                      const n = parseInt(v, 10);
                      if (!Number.isNaN(n)) updateQuestion(i, { defaultLines: Math.min(10, Math.max(1, n)) });
                    }}
                    disabled={!canEdit}
                  />
                  <label className="flex items-center gap-2 text-sm pt-6">
                    <input
                      type="checkbox"
                      checked={Boolean(q.large)}
                      onChange={(e) => updateQuestion(i, { large: e.target.checked })}
                      disabled={!canEdit}
                    />
                    Grande zone de texte
                  </label>
                </div>
                {canEdit && form.questions.length > 1 && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-red-700 mt-2"
                    onClick={() =>
                      setForm({ ...form, questions: form.questions.filter((_, idx) => idx !== i) })
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer cette question
                  </button>
                )}
              </ContentEditorBlock>
            ))}
            {canEdit && (
              <button
                type="button"
                className="btn-secondary inline-flex items-center gap-2 text-xs mt-4"
                onClick={() =>
                  setForm({
                    ...form,
                    questions: [
                      ...form.questions,
                      {
                        id: `question_${form.questions.length + 1}`,
                        label: "Nouvelle question",
                        defaultLines: 3,
                      },
                    ],
                  })
                }
              >
                <Plus className="w-4 h-4" /> Ajouter une question
              </button>
            )}
          </Section>

          {canEdit && <SaveButton loading={loading} label="Enregistrer et synchroniser le site" />}
        </ContentEditorForm>
      </form>
    </>
  );
}
