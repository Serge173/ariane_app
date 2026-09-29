"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import type { HomepageSettings, HeroSlideSettings, JourneyStepSettings, TestimonialSettings } from "@/lib/homepage-settings";
import {
  ContentEditorBlock,
  ContentEditorFields,
  ContentEditorForm,
  ContentEditorNote,
  ContentEditorSection,
} from "@/components/admin/content/ContentEditorLayout";
import { Field } from "@/components/admin/content/FormFields";
import { HeroSlidesEditor } from "@/components/admin/content/HeroSlidesEditor";

export function HomepageSettingsForm({
  initial,
  canEdit,
}: {
  initial: HomepageSettings;
  canEdit: boolean;
}) {
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const uploadHomeImage = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload/home-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Upload impossible");
        return null;
      }
      return data.url as string;
    } catch {
      showError("Erreur réseau");
      return null;
    }
  };

  const uploadSlideImage = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadHomeImage(file);
      if (!url) return;
      setForm((f) => {
        const slides = [...f.hero.slides];
        slides[index] = { ...slides[index], image: url };
        return { ...f, hero: { ...f.hero, slides } };
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  const saveHeroSlides = async (slides: HeroSlideSettings[]): Promise<boolean> => {
    setLoading(true);
    try {
      const payload = { ...form, hero: { ...form.hero, slides } };
      const res = await fetch("/api/admin/homepage-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Enregistrement impossible");
        return false;
      }
      setForm(data);
      showSuccess("Slide enregistré");
      return true;
    } catch {
      showError("Erreur réseau");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Enregistrement impossible");
        return;
      }
      setForm(data);
      showSuccess("Page d'accueil mise à jour");
    } catch {
      showError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const setHeroSlides = (slides: HeroSlideSettings[]) => {
    setForm((f) => ({ ...f, hero: { ...f.hero, slides } }));
  };

  const updateStep = (index: number, patch: Partial<JourneyStepSettings>) => {
    setForm((f) => {
      const steps = [...f.journey.steps];
      steps[index] = { ...steps[index], ...patch };
      return { ...f, journey: { ...f.journey, steps } };
    });
  };

  const updateTestimonial = (index: number, patch: Partial<TestimonialSettings>) => {
    setForm((f) => {
      const items = [...f.testimonials.items];
      items[index] = { ...items[index], ...patch };
      return { ...f, testimonials: { ...f.testimonials, items } };
    });
  };

  return (
    <>
      {FeedbackModal}
      <form onSubmit={handleSubmit}>
        <ContentEditorForm>
          <ContentEditorSection
            index={1}
            title="Hero — diaporama"
            description="Bandeau principal en haut de la page d'accueil : boutons et slides."
          >
            <ContentEditorFields>
              <Field
                label="Bouton principal — texte"
                value={form.hero.primaryCta.label}
                onChange={(label) =>
                  setForm((f) => ({
                    ...f,
                    hero: { ...f.hero, primaryCta: { ...f.hero.primaryCta, label } },
                  }))
                }
                disabled={!canEdit}
              />
              <Field
                label="Bouton principal — lien"
                value={form.hero.primaryCta.href}
                onChange={(href) =>
                  setForm((f) => ({
                    ...f,
                    hero: { ...f.hero, primaryCta: { ...f.hero.primaryCta, href } },
                  }))
                }
                disabled={!canEdit}
                hint="Recommandé : /reservation?intent=rdv pour une demande de rendez-vous conseil en image."
              />
              <Field
                label="Urgence / rareté (hero)"
                value={form.hero.scarcityLabel}
                onChange={(scarcityLabel) => setForm((f) => ({ ...f, hero: { ...f.hero, scarcityLabel } }))}
                disabled={!canEdit}
              />
            </ContentEditorFields>
            <HeroSlidesEditor
              slides={form.hero.slides}
              canEdit={canEdit}
              onChange={setHeroSlides}
              uploadingIndex={uploadingIndex}
              onUpload={uploadSlideImage}
              onUploadImage={uploadHomeImage}
              onSaveSlides={saveHeroSlides}
            />
          </ContentEditorSection>

          <ContentEditorSection
            index={2}
            title="Parcours client"
            description="Étapes expliquant comment se déroule l'accompagnement."
          >
            <ContentEditorFields>
              <Field label="Surtitre" value={form.journey.overline} onChange={(v) => setForm((f) => ({ ...f, journey: { ...f.journey, overline: v } }))} disabled={!canEdit} />
              <Field label="Titre" value={form.journey.title} onChange={(v) => setForm((f) => ({ ...f, journey: { ...f.journey, title: v } }))} disabled={!canEdit} />
              <Field label="Introduction" value={form.journey.intro} onChange={(v) => setForm((f) => ({ ...f, journey: { ...f.journey, intro: v } }))} disabled={!canEdit} multiline />
            </ContentEditorFields>
            {form.journey.steps.map((step, index) => (
              <ContentEditorBlock key={step.number} index={index + 1} title={`Étape ${step.number}`}>
                <Field label="Titre" value={step.title} onChange={(v) => updateStep(index, { title: v })} disabled={!canEdit} />
                <Field label="Description" value={step.description} onChange={(v) => updateStep(index, { description: v })} disabled={!canEdit} multiline />
              </ContentEditorBlock>
            ))}
          </ContentEditorSection>

          <ContentEditorSection index={3} title="Section forfaits (intro)" description="Texte d'introduction au-dessus des cartes forfaits.">
            <ContentEditorFields>
              <Field label="Surtitre" value={form.offersSection.overline} onChange={(v) => setForm((f) => ({ ...f, offersSection: { ...f.offersSection, overline: v } }))} disabled={!canEdit} />
              <Field label="Titre" value={form.offersSection.title} onChange={(v) => setForm((f) => ({ ...f, offersSection: { ...f.offersSection, title: v } }))} disabled={!canEdit} />
              <Field label="Texte" value={form.offersSection.intro} onChange={(v) => setForm((f) => ({ ...f, offersSection: { ...f.offersSection, intro: v } }))} disabled={!canEdit} multiline />
              <ContentEditorNote>Les cartes forfaits viennent du catalogue Accompagnements (Admin → Offre).</ContentEditorNote>
            </ContentEditorFields>
          </ContentEditorSection>

          <ContentEditorSection index={4} title="Aperçu boutique" tone="muted" description="Section retirée de l'accueil public.">
            <ContentEditorNote>
              Cette section n&apos;est plus affichée sur la page d&apos;accueil. La boutique est accessible via le menu Shopping. Gérez les produits dans Admin → Catalogue boutique.
            </ContentEditorNote>
          </ContentEditorSection>

          <ContentEditorSection
            index={5}
            title="Témoignages Avant / Après"
            description="Quatre cadres avec images et textes avant/après."
          >
            <ContentEditorFields>
              <Field label="Surtitre" value={form.testimonials.overline} onChange={(v) => setForm((f) => ({ ...f, testimonials: { ...f.testimonials, overline: v } }))} disabled={!canEdit} />
              <Field label="Titre" value={form.testimonials.title} onChange={(v) => setForm((f) => ({ ...f, testimonials: { ...f.testimonials, title: v } }))} disabled={!canEdit} />
            </ContentEditorFields>
            {form.testimonials.items.map((t, index) => (
              <ContentEditorBlock key={index} index={index + 1} title={`Témoignage ${index + 1}`}>
                <Field label="Nom" value={t.name} onChange={(v) => updateTestimonial(index, { name: v })} disabled={!canEdit} />
                <Field label="Rôle" value={t.role} onChange={(v) => updateTestimonial(index, { role: v })} disabled={!canEdit} />
                <Field label="Avant l'accompagnement" value={t.before ?? ""} onChange={(v) => updateTestimonial(index, { before: v })} disabled={!canEdit} multiline />
                <Field label="Après" value={t.after ?? ""} onChange={(v) => updateTestimonial(index, { after: v })} disabled={!canEdit} multiline />
                <Field label="Image avant — URL" value={t.beforeImage ?? ""} onChange={(v) => updateTestimonial(index, { beforeImage: v })} disabled={!canEdit} />
                <Field label="Image après — URL" value={t.afterImage ?? ""} onChange={(v) => updateTestimonial(index, { afterImage: v })} disabled={!canEdit} />
                <Field label="Citation (format simple, optionnel)" value={t.content} onChange={(v) => updateTestimonial(index, { content: v })} disabled={!canEdit} multiline />
              </ContentEditorBlock>
            ))}
          </ContentEditorSection>

          <ContentEditorSection index={6} title="Bloc contact final" description="Appel à l'action en bas de la page d'accueil.">
            <ContentEditorFields>
              <Field label="Surtitre" value={form.cta.overline} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, overline: v } }))} disabled={!canEdit} />
              <Field label="Titre" value={form.cta.title} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, title: v } }))} disabled={!canEdit} />
              <Field label="Texte" value={form.cta.intro} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, intro: v } }))} disabled={!canEdit} multiline />
              <Field label="Lien — texte" value={form.cta.linkLabel} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, linkLabel: v } }))} disabled={!canEdit} />
              <Field
                label="Lien — URL"
                value={form.cta.linkHref}
                onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, linkHref: v } }))}
                disabled={!canEdit}
                hint="Pour une prise de RDV conseil en image, utilisez /reservation?intent=rdv."
              />
            </ContentEditorFields>
          </ContentEditorSection>

          {canEdit && (
            <div className="content-editor-save-bar">
              <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Enregistrer la page d&apos;accueil
              </button>
            </div>
          )}
        </ContentEditorForm>
      </form>
    </>
  );
}
