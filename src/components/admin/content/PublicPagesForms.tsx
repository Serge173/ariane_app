"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import type {
  PublicPagesSettings,
  AboutPageSettings,
  OffersPageSettings,
  FaqPageSettings,
  ContactPageSettings,
  BlogPageSettings,
  LegalPagesSettings,
  OrientationPageSettings,
} from "@/lib/public-pages-settings";
import { updatePublicPagesSettings } from "@/lib/public-pages-settings";
import { parseJsonResponse } from "@/lib/fetch-json";

async function savePatch(
  patch: Parameters<typeof updatePublicPagesSettings>[0],
  onSaved: (data: PublicPagesSettings) => void
) {
  const res = await fetch("/api/admin/public-pages-settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await parseJsonResponse<PublicPagesSettings & { error?: string }>(res);
  if (!res.ok) throw new Error(data?.error || `Enregistrement impossible (${res.status})`);
  if (!data) throw new Error("Réponse serveur invalide");
  onSaved(data);
}

function usePageForm<T extends keyof PublicPagesSettings>(
  sliceKey: T,
  initial: PublicPagesSettings[T],
  canEdit: boolean,
  successMsg: string
) {
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const submit = async (patch: Parameters<typeof updatePublicPagesSettings>[0]) => {
    if (!canEdit) return;
    setLoading(true);
    try {
      await savePatch(patch, (data) => {
        setForm(data[sliceKey] as PublicPagesSettings[T]);
        showSuccess(successMsg);
      });
    } catch (e) {
      showError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, submit, FeedbackModal };
}

export function AboutSettingsForm({ initial, canEdit }: { initial: AboutPageSettings; canEdit: boolean }) {
  const { form, setForm, loading, submit, FeedbackModal } = usePageForm("about", initial, canEdit, "Page À propos mise à jour");

  return (
    <>
      {FeedbackModal}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit({ about: form });
        }}
        className="contents"
      >
        <ContentEditorForm>
        <Section index={1} title="En-tête" description="Titre et texte d'introduction de la page À propos.">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.overline} onChange={(v) => setForm({ ...form, overline: v })} disabled={!canEdit} />
          <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} disabled={!canEdit} />
          {form.paragraphs.map((p, i) => (
            <Field key={i} label={`Paragraphe ${i + 1}`} value={p} onChange={(v) => {
              const paragraphs = [...form.paragraphs];
              paragraphs[i] = v;
              setForm({ ...form, paragraphs });
            }} disabled={!canEdit} multiline />
          ))}
          <Field label="URL image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} disabled={!canEdit} />
          <Field label="Texte alternatif image" value={form.imageAlt} onChange={(v) => setForm({ ...form, imageAlt: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        <Section index={2} title="Mission / Vision / Valeurs" description="Blocs de valeurs affichés sur la page.">
          {form.values.map((item, i) => (
            <ContentEditorBlock key={i} index={i + 1} title={item.title || `Valeur ${i + 1}`}>
              <Field label="Titre" value={item.title} onChange={(v) => {
                const values = [...form.values];
                values[i] = { ...values[i], title: v };
                setForm({ ...form, values });
              }} disabled={!canEdit} />
              <Field label="Texte" value={item.text} onChange={(v) => {
                const values = [...form.values];
                values[i] = { ...values[i], text: v };
                setForm({ ...form, values });
              }} disabled={!canEdit} multiline />
            </ContentEditorBlock>
          ))}
        </Section>
        <Section index={3} title="Appel à l'action">
          <ContentEditorFields>
          <Field label="Bouton — texte" value={form.ctaLabel} onChange={(v) => setForm({ ...form, ctaLabel: v })} disabled={!canEdit} />
          <Field label="Bouton — lien" value={form.ctaHref} onChange={(v) => setForm({ ...form, ctaHref: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}

export function OffersSettingsForm({ initial, canEdit }: { initial: OffersPageSettings; canEdit: boolean }) {
  const { form, setForm, loading, submit, FeedbackModal } = usePageForm("offers", initial, canEdit, "Page prestations mise à jour");

  return (
    <>
      {FeedbackModal}
      <form onSubmit={(e) => { e.preventDefault(); submit({ offers: form }); }} className="contents">
        <ContentEditorForm>
        <Section index={1} title="En-tête" description="Introduction de la page prestations.">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.overline} onChange={(v) => setForm({ ...form, overline: v })} disabled={!canEdit} />
          <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} disabled={!canEdit} />
          <Field label="Introduction" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} disabled={!canEdit} multiline />
          <Field label="Lien aide — texte" value={form.helpLinkLabel} onChange={(v) => setForm({ ...form, helpLinkLabel: v })} disabled={!canEdit} />
          <Field label="Lien aide — URL" value={form.helpLinkHref} onChange={(v) => setForm({ ...form, helpLinkHref: v })} disabled={!canEdit} />
          <ContentEditorNote>Les cartes forfaits viennent du catalogue Accompagnements.</ContentEditorNote>
          </ContentEditorFields>
        </Section>
        <Section index={2} title="Bloc entreprises">
          <ContentEditorFields>
          <Field label="Titre" value={form.enterpriseTitle} onChange={(v) => setForm({ ...form, enterpriseTitle: v })} disabled={!canEdit} />
          <Field label="Texte" value={form.enterpriseIntro} onChange={(v) => setForm({ ...form, enterpriseIntro: v })} disabled={!canEdit} multiline />
          <Field label="Bouton — texte" value={form.enterpriseCtaLabel} onChange={(v) => setForm({ ...form, enterpriseCtaLabel: v })} disabled={!canEdit} />
          <Field label="Bouton — URL" value={form.enterpriseCtaHref} onChange={(v) => setForm({ ...form, enterpriseCtaHref: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}

export function FaqSettingsForm({ initial, canEdit }: { initial: FaqPageSettings; canEdit: boolean }) {
  const { form, setForm, loading, submit, FeedbackModal } = usePageForm("faq", initial, canEdit, "FAQ mise à jour");

  return (
    <>
      {FeedbackModal}
      <form onSubmit={(e) => { e.preventDefault(); submit({ faq: form }); }} className="contents">
        <ContentEditorForm>
        <Section index={1} title="En-tête">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.overline} onChange={(v) => setForm({ ...form, overline: v })} disabled={!canEdit} />
          <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        <Section index={2} title="Questions / réponses" description="Modifiez, ajoutez ou supprimez chaque entrée de la FAQ.">
          {form.items.map((item, i) => (
            <ContentEditorBlock
              key={i}
              index={i + 1}
              title={item.q.slice(0, 48) || `Question ${i + 1}`}
              onRemove={canEdit ? () => setForm({ ...form, items: form.items.filter((_, j) => j !== i) }) : undefined}
            >
              <Field label="Question" value={item.q} onChange={(v) => {
                const items = [...form.items];
                items[i] = { ...items[i], q: v };
                setForm({ ...form, items });
              }} disabled={!canEdit} />
              <Field label="Réponse" value={item.a} onChange={(v) => {
                const items = [...form.items];
                items[i] = { ...items[i], a: v };
                setForm({ ...form, items });
              }} disabled={!canEdit} multiline />
            </ContentEditorBlock>
          ))}
          {canEdit && (
            <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { q: "Nouvelle question", a: "" }] })} className="content-editor-add-btn">
              <Plus className="w-4 h-4" /> Ajouter une question
            </button>
          )}
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}

export function ContactSettingsForm({ initial, canEdit }: { initial: ContactPageSettings; canEdit: boolean }) {
  const { form, setForm, loading, submit, FeedbackModal } = usePageForm("contact", initial, canEdit, "Page contact mise à jour");

  const updateType = (key: keyof ContactPageSettings["types"], field: "title" | "subtitle", value: string) => {
    setForm({ ...form, types: { ...form.types, [key]: { ...form.types[key], [field]: value } } });
  };

  return (
    <>
      {FeedbackModal}
      <form onSubmit={(e) => { e.preventDefault(); submit({ contact: form }); }} className="contents">
        <ContentEditorForm>
        {(["general", "entreprise", "diagnostic"] as const).map((key, idx) => (
          <Section key={key} index={idx + 1} title={`Formulaire — ${key}`}>
            <ContentEditorFields>
            <Field label="Titre" value={form.types[key].title} onChange={(v) => updateType(key, "title", v)} disabled={!canEdit} />
            <Field label="Sous-titre" value={form.types[key].subtitle} onChange={(v) => updateType(key, "subtitle", v)} disabled={!canEdit} />
            </ContentEditorFields>
          </Section>
        ))}
        <Section index={4} title="Message de confirmation">
          <ContentEditorFields>
          <Field label="Titre succès" value={form.successTitle} onChange={(v) => setForm({ ...form, successTitle: v })} disabled={!canEdit} />
          <Field label="Message succès" value={form.successMessage} onChange={(v) => setForm({ ...form, successMessage: v })} disabled={!canEdit} multiline />
          <Field label="Titre bloc coordonnées" value={form.coordinatesTitle} onChange={(v) => setForm({ ...form, coordinatesTitle: v })} disabled={!canEdit} />
          <ContentEditorNote>Adresse, téléphone et email viennent de Navigation & footer.</ContentEditorNote>
          </ContentEditorFields>
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}

export function BlogSettingsForm({ initial, canEdit }: { initial: BlogPageSettings; canEdit: boolean }) {
  const { form, setForm, loading, submit, FeedbackModal } = usePageForm("blog", initial, canEdit, "Page blog mise à jour");

  return (
    <>
      {FeedbackModal}
      <form onSubmit={(e) => { e.preventDefault(); submit({ blog: form }); }} className="contents">
        <ContentEditorForm>
        <Section index={1} title="Liste des articles">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.overline} onChange={(v) => setForm({ ...form, overline: v })} disabled={!canEdit} />
          <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} disabled={!canEdit} />
          <Field label="Introduction" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} disabled={!canEdit} multiline />
          <Field label="Message liste vide" value={form.emptyMessage} onChange={(v) => setForm({ ...form, emptyMessage: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        <Section index={2} title="Pied d'article">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.articleFooterOverline} onChange={(v) => setForm({ ...form, articleFooterOverline: v })} disabled={!canEdit} />
          <Field label="Texte" value={form.articleFooterText} onChange={(v) => setForm({ ...form, articleFooterText: v })} disabled={!canEdit} multiline />
          <Field label="Bouton — texte" value={form.articleFooterCtaLabel} onChange={(v) => setForm({ ...form, articleFooterCtaLabel: v })} disabled={!canEdit} />
          <Field label="Bouton — URL" value={form.articleFooterCtaHref} onChange={(v) => setForm({ ...form, articleFooterCtaHref: v })} disabled={!canEdit} />
          <Field label="Titre articles similaires" value={form.relatedTitle} onChange={(v) => setForm({ ...form, relatedTitle: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}

function LegalPageForm({
  pageKey,
  pageLabel,
  initial,
  canEdit,
}: {
  pageKey: keyof LegalPagesSettings;
  pageLabel: string;
  initial: LegalPagesSettings[keyof LegalPagesSettings];
  canEdit: boolean;
}) {
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    try {
      await savePatch({ legal: { [pageKey]: form } }, (data) => {
        setForm(data.legal[pageKey]);
        showSuccess(`${pageLabel} mise à jour`);
      });
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {FeedbackModal}
      <form onSubmit={handleSubmit} className="contents">
        <ContentEditorForm>
        <Section index={1} title={pageLabel} description="Contenu légal affiché sur le site public.">
          <ContentEditorFields>
          <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} disabled={!canEdit} />
          <Field label="Introduction" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} disabled={!canEdit} multiline />
          </ContentEditorFields>
          {form.sections.map((section, i) => (
            <ContentEditorBlock key={i} index={i + 1} title={section.title || `Paragraphe ${i + 1}`}>
              <Field label="Titre de bloc" value={section.title} onChange={(v) => {
                const sections = [...form.sections];
                sections[i] = { ...sections[i], title: v };
                setForm({ ...form, sections });
              }} disabled={!canEdit} />
              <Field label="Contenu" value={section.body} onChange={(v) => {
                const sections = [...form.sections];
                sections[i] = { ...sections[i], body: v };
                setForm({ ...form, sections });
              }} disabled={!canEdit} multiline />
            </ContentEditorBlock>
          ))}
          <ContentEditorFields>
          <Field label="Note de bas de page" value={form.disclaimer} onChange={(v) => setForm({ ...form, disclaimer: v })} disabled={!canEdit} multiline />
          </ContentEditorFields>
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}

export function LegalSettingsForm({ initial, canEdit, page }: { initial: LegalPagesSettings; canEdit: boolean; page: keyof LegalPagesSettings }) {
  const labels = { cgv: "CGV", confidentialite: "Confidentialité", mentionsLegales: "Mentions légales" };
  return <LegalPageForm pageKey={page} pageLabel={labels[page]} initial={initial[page]} canEdit={canEdit} />;
}

export function OrientationSettingsForm({ initial, canEdit }: { initial: OrientationPageSettings; canEdit: boolean }) {
  const { form, setForm, loading, submit, FeedbackModal } = usePageForm("orientation", initial, canEdit, "Questionnaire orientation mis à jour");
  const recKeys = Object.keys(form.recommendations);

  return (
    <>
      {FeedbackModal}
      <form onSubmit={(e) => { e.preventDefault(); submit({ orientation: form }); }} className="contents">
        <ContentEditorForm>
        <Section index={1} title="Introduction">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.overline} onChange={(v) => setForm({ ...form, overline: v })} disabled={!canEdit} />
          <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} disabled={!canEdit} />
          <Field label="Texte d'aide progression" value={form.progressHint} onChange={(v) => setForm({ ...form, progressHint: v })} disabled={!canEdit} multiline />
          </ContentEditorFields>
        </Section>
        <Section index={2} title="Écran résultat">
          <ContentEditorFields>
          <Field label="Surtitre" value={form.resultOverline} onChange={(v) => setForm({ ...form, resultOverline: v })} disabled={!canEdit} />
          <Field label="CTA sur-mesure" value={form.ctaDiagnostic} onChange={(v) => setForm({ ...form, ctaDiagnostic: v })} disabled={!canEdit} />
          <Field label="Préfixe bouton choix" value={form.ctaChoosePrefix} onChange={(v) => setForm({ ...form, ctaChoosePrefix: v })} disabled={!canEdit} />
          <Field label="CTA toutes prestations" value={form.ctaAllOffers} onChange={(v) => setForm({ ...form, ctaAllOffers: v })} disabled={!canEdit} />
          </ContentEditorFields>
        </Section>
        <Section index={3} title="Questions du questionnaire">
          {form.questions.map((q, qi) => (
            <ContentEditorBlock key={q.id} index={qi + 1} title={q.question.slice(0, 40) || `Question ${qi + 1}`}>
              <Field label="Intitulé" value={q.question} onChange={(v) => {
                const questions = [...form.questions];
                questions[qi] = { ...questions[qi], question: v };
                setForm({ ...form, questions });
              }} disabled={!canEdit} />
              {q.options.map((opt, oi) => (
                <Field key={opt.value} label={`Option ${oi + 1}`} value={opt.label} onChange={(v) => {
                  const questions = [...form.questions];
                  const options = [...questions[qi].options];
                  options[oi] = { ...options[oi], label: v };
                  questions[qi] = { ...questions[qi], options };
                  setForm({ ...form, questions });
                }} disabled={!canEdit} />
              ))}
            </ContentEditorBlock>
          ))}
          <ContentEditorNote>La logique de scoring reste fixe (valeurs techniques non modifiables).</ContentEditorNote>
        </Section>
        <Section index={4} title="Recommandations">
          {recKeys.map((key, i) => {
            const rec = form.recommendations[key];
            return (
              <ContentEditorBlock key={key} index={i + 1} title={key}>
                <Field label="Nom" value={rec.name} onChange={(v) => setForm({
                  ...form,
                  recommendations: { ...form.recommendations, [key]: { ...rec, name: v } },
                })} disabled={!canEdit} />
                <Field label="Description" value={rec.description} onChange={(v) => setForm({
                  ...form,
                  recommendations: { ...form.recommendations, [key]: { ...rec, description: v } },
                })} disabled={!canEdit} multiline />
                <Field label="Prix affiché" value={rec.price} onChange={(v) => setForm({
                  ...form,
                  recommendations: { ...form.recommendations, [key]: { ...rec, price: v } },
                })} disabled={!canEdit} />
              </ContentEditorBlock>
            );
          })}
        </Section>
        {canEdit && <SaveButton loading={loading} label="Enregistrer" />}
        </ContentEditorForm>
      </form>
    </>
  );
}
