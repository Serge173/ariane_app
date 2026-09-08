"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import type { HomepageSettings, HeroSlideSettings, JourneyStepSettings, TestimonialSettings } from "@/lib/homepage-settings";

function Field({
  label,
  value,
  onChange,
  disabled,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {hint && <p className="text-xs text-brand-500 mb-1.5">{hint}</p>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className="input-field resize-y min-h-[4.5rem]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="input-field"
        />
      )}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-brand-100 p-6 space-y-5">
      <div>
        <h2 className="font-display text-xl">{title}</h2>
        {description && <p className="text-sm text-brand-500 mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

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

  const uploadSlideImage = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload/home-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Upload impossible");
        return;
      }
      setForm((f) => {
        const slides = [...f.hero.slides];
        slides[index] = { ...slides[index], image: data.url };
        return { ...f, hero: { ...f.hero, slides } };
      });
    } catch {
      showError("Erreur réseau");
    } finally {
      setUploadingIndex(null);
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

  const updateSlide = (index: number, patch: Partial<HeroSlideSettings>) => {
    setForm((f) => {
      const slides = [...f.hero.slides];
      slides[index] = { ...slides[index], ...patch };
      return { ...f, hero: { ...f.hero, slides } };
    });
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
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-12">
        <Section title="Hero — diaporama">
          <Field
            label="Bouton principal — texte"
            value={form.hero.primaryCta.label}
            onChange={(label) => setForm((f) => ({ ...f, hero: { ...f.hero, primaryCta: { ...f.hero.primaryCta, label } } }))}
            disabled={!canEdit}
          />
          <Field
            label="Bouton principal — lien"
            value={form.hero.primaryCta.href}
            onChange={(href) => setForm((f) => ({ ...f, hero: { ...f.hero, primaryCta: { ...f.hero.primaryCta, href } } }))}
            disabled={!canEdit}
            hint="Recommandé : /reservation?intent=rdv pour une demande de rendez-vous conseil en image."
          />
          <Field
            label="Urgence / rareté (hero)"
            value={form.hero.scarcityLabel}
            onChange={(scarcityLabel) => setForm((f) => ({ ...f, hero: { ...f.hero, scarcityLabel } }))}
            disabled={!canEdit}
          />
          {form.hero.slides.map((slide, index) => (
            <div key={slide.id} className="border border-brand-100 p-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-brand-500">Slide {index + 1}</p>
              <Field label="Surtitre" value={slide.overline} onChange={(v) => updateSlide(index, { overline: v })} disabled={!canEdit} />
              <Field label="Titre" value={slide.title} onChange={(v) => updateSlide(index, { title: v })} disabled={!canEdit} />
              <Field label="Texte alternatif image" value={slide.imageAlt} onChange={(v) => updateSlide(index, { imageAlt: v })} disabled={!canEdit} />
              <Field label="URL de l'image" value={slide.image} onChange={(v) => updateSlide(index, { image: v })} disabled={!canEdit} />
              {canEdit && (
                <label className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-brand-700 cursor-pointer">
                  {uploadingIndex === index ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Téléverser une image
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadSlideImage(index, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </Section>

        <Section title="Parcours client">
          <Field label="Surtitre" value={form.journey.overline} onChange={(v) => setForm((f) => ({ ...f, journey: { ...f.journey, overline: v } }))} disabled={!canEdit} />
          <Field label="Titre" value={form.journey.title} onChange={(v) => setForm((f) => ({ ...f, journey: { ...f.journey, title: v } }))} disabled={!canEdit} />
          <Field label="Introduction" value={form.journey.intro} onChange={(v) => setForm((f) => ({ ...f, journey: { ...f.journey, intro: v } }))} disabled={!canEdit} multiline />
          {form.journey.steps.map((step, index) => (
            <div key={step.number} className="border border-brand-100 p-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-brand-500">Étape {step.number}</p>
              <Field label="Titre" value={step.title} onChange={(v) => updateStep(index, { title: v })} disabled={!canEdit} />
              <Field label="Description" value={step.description} onChange={(v) => updateStep(index, { description: v })} disabled={!canEdit} multiline />
            </div>
          ))}
        </Section>

        <Section title="Section forfaits (intro)">
          <Field label="Surtitre" value={form.offersSection.overline} onChange={(v) => setForm((f) => ({ ...f, offersSection: { ...f.offersSection, overline: v } }))} disabled={!canEdit} />
          <Field label="Titre" value={form.offersSection.title} onChange={(v) => setForm((f) => ({ ...f, offersSection: { ...f.offersSection, title: v } }))} disabled={!canEdit} />
          <Field label="Texte" value={form.offersSection.intro} onChange={(v) => setForm((f) => ({ ...f, offersSection: { ...f.offersSection, intro: v } }))} disabled={!canEdit} multiline />
          <p className="text-sm text-brand-500">Les cartes forfaits viennent du catalogue Accompagnements.</p>
        </Section>

        <Section title="Aperçu boutique (désactivé)">
          <p className="text-sm text-brand-600 leading-relaxed">
            Cette section n&apos;est plus affichée sur la page d&apos;accueil. La boutique est accessible via le menu Shopping (Luxe / Premium). Gérez les produits dans Admin → Catalogue boutique.
          </p>
        </Section>

        <Section
          title="Témoignages Avant / Après"
          description="4 cadres compacts avec images avant et après. Les champs « Avant » et « Après » remplacent la citation simple."
        >
          <Field label="Surtitre" value={form.testimonials.overline} onChange={(v) => setForm((f) => ({ ...f, testimonials: { ...f.testimonials, overline: v } }))} disabled={!canEdit} />
          <Field label="Titre" value={form.testimonials.title} onChange={(v) => setForm((f) => ({ ...f, testimonials: { ...f.testimonials, title: v } }))} disabled={!canEdit} />
          {form.testimonials.items.map((t, index) => (
            <div key={index} className="border border-brand-100 p-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-brand-500">Témoignage {index + 1}</p>
              <Field label="Nom" value={t.name} onChange={(v) => updateTestimonial(index, { name: v })} disabled={!canEdit} />
              <Field label="Rôle" value={t.role} onChange={(v) => updateTestimonial(index, { role: v })} disabled={!canEdit} />
              <Field label="Avant l'accompagnement" value={t.before ?? ""} onChange={(v) => updateTestimonial(index, { before: v })} disabled={!canEdit} multiline />
              <Field label="Après" value={t.after ?? ""} onChange={(v) => updateTestimonial(index, { after: v })} disabled={!canEdit} multiline />
              <Field label="Image avant — URL" value={t.beforeImage ?? ""} onChange={(v) => updateTestimonial(index, { beforeImage: v })} disabled={!canEdit} />
              <Field label="Image après — URL" value={t.afterImage ?? ""} onChange={(v) => updateTestimonial(index, { afterImage: v })} disabled={!canEdit} />
              <Field label="Citation (format simple, optionnel)" value={t.content} onChange={(v) => updateTestimonial(index, { content: v })} disabled={!canEdit} multiline />
            </div>
          ))}
        </Section>

        <Section title="Bloc contact final">
          <Field label="Surtitre" value={form.cta.overline} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, overline: v } }))} disabled={!canEdit} />
          <Field label="Titre" value={form.cta.title} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, title: v } }))} disabled={!canEdit} />
          <Field label="Texte" value={form.cta.intro} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, intro: v } }))} disabled={!canEdit} multiline />
          <Field label="Lien — texte" value={form.cta.linkLabel} onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, linkLabel: v } }))} disabled={!canEdit} />
          <Field
            label="Lien — URL"
            value={form.cta.linkHref}
            onChange={(v) => setForm((f) => ({ ...f, cta: { ...f.cta, linkHref: v } }))}
            disabled={!canEdit}
            hint="Pour une prise de RDV conseil en image, utilisez /reservation?intent=rdv (distinct du checkout boutique)."
          />
        </Section>

        {canEdit && (
          <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Enregistrer la page d&apos;accueil
          </button>
        )}
      </form>
    </>
  );
}
