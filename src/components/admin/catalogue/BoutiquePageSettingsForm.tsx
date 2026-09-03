"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import { Field, Section } from "@/components/admin/content/FormFields";
import type { BoutiquePageSettings } from "@/lib/boutique-settings";

export interface SpotlightProductOption {
  id: string;
  name: string;
  brand: string | null;
  isFeatured: boolean;
}

interface BoutiquePageSettingsFormProps {
  initial: BoutiquePageSettings;
  products: SpotlightProductOption[];
  canEdit: boolean;
}

export function BoutiquePageSettingsForm({
  initial,
  products,
  canEdit,
}: BoutiquePageSettingsFormProps) {
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState({
    ...initial,
    productSlot1: initial.spotlightProductIds[0] ?? "",
    productSlot2: initial.spotlightProductIds[1] ?? "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setLoading(true);
    try {
      const { productSlot1, productSlot2, ...settings } = form;
      const res = await fetch("/api/admin/boutique-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          spotlightProductIds: [productSlot1, productSlot2].filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Enregistrement impossible");
        return;
      }
      setForm({
        ...data,
        productSlot1: data.spotlightProductIds[0] ?? "",
        productSlot2: data.spotlightProductIds[1] ?? "",
      });
      showSuccess("Page boutique mise à jour");
    } catch {
      showError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {FeedbackModal}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-12">
        <Section title="Bandeau promo">
          <Field label="Texte" value={form.promoText} onChange={(v) => setForm({ ...form, promoText: v })} disabled={!canEdit} />
        </Section>

        <Section title="Hero">
          <Field label="Titre — ligne 1" value={form.hero.titleLine1} onChange={(v) => setForm({ ...form, hero: { ...form.hero, titleLine1: v } })} disabled={!canEdit} />
          <Field label="Titre — ligne 2" value={form.hero.titleLine2} onChange={(v) => setForm({ ...form, hero: { ...form.hero, titleLine2: v } })} disabled={!canEdit} />
          <Field label="Introduction" value={form.hero.intro} onChange={(v) => setForm({ ...form, hero: { ...form.hero, intro: v } })} disabled={!canEdit} multiline />
          <Field label="Bouton — texte" value={form.hero.ctaLabel} onChange={(v) => setForm({ ...form, hero: { ...form.hero, ctaLabel: v } })} disabled={!canEdit} />
          <Field label="Image — URL" value={form.hero.image} onChange={(v) => setForm({ ...form, hero: { ...form.hero, image: v } })} disabled={!canEdit} />
          <Field label="Image — texte alternatif" value={form.hero.imageAlt} onChange={(v) => setForm({ ...form, hero: { ...form.hero, imageAlt: v } })} disabled={!canEdit} />
        </Section>

        <Section title="Collections">
          <Field label="Titre" value={form.collections.title} onChange={(v) => setForm({ ...form, collections: { ...form.collections, title: v } })} disabled={!canEdit} />
          <Field label="Introduction" value={form.collections.intro} onChange={(v) => setForm({ ...form, collections: { ...form.collections, intro: v } })} disabled={!canEdit} multiline />
          <Field label="Libellé tuile" value={form.collections.tileLabel} onChange={(v) => setForm({ ...form, collections: { ...form.collections, tileLabel: v } })} disabled={!canEdit} />
        </Section>

        <Section title="Catalogue">
          <Field label="Titre" value={form.catalogue.title} onChange={(v) => setForm({ ...form, catalogue: { ...form.catalogue, title: v } })} disabled={!canEdit} />
          <Field label="Sous-titre" value={form.catalogue.subtitle} onChange={(v) => setForm({ ...form, catalogue: { ...form.catalogue, subtitle: v } })} disabled={!canEdit} multiline />
        </Section>

        <Section title="Notre histoire">
          <Field label="Titre" value={form.story.title} onChange={(v) => setForm({ ...form, story: { ...form.story, title: v } })} disabled={!canEdit} />
          <Field label="Texte" value={form.story.body} onChange={(v) => setForm({ ...form, story: { ...form.story, body: v } })} disabled={!canEdit} multiline />
        </Section>

        <Section title="Section « Les plus convoités »">
          <p className="text-sm text-brand-600 leading-relaxed">
            Les produits viennent de leurs{" "}
            <Link href="/admin/catalogue/produits?type=LUXE" className="underline">fiches produit</Link>.
          </p>
          <Field label="Titre" value={form.spotlightTitle} onChange={(v) => setForm({ ...form, spotlightTitle: v })} disabled={!canEdit} />
          <Field label="Bouton — texte" value={form.spotlightButtonLabel} onChange={(v) => setForm({ ...form, spotlightButtonLabel: v })} disabled={!canEdit} />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Produit 1</label>
              <select
                value={form.productSlot1}
                onChange={(e) => setForm({ ...form, productSlot1: e.target.value })}
                disabled={!canEdit}
                className="input-field"
              >
                <option value="">Automatique (exclusif)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === form.productSlot2}>
                    {p.name}{p.brand ? ` — ${p.brand}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Produit 2</label>
              <select
                value={form.productSlot2}
                onChange={(e) => setForm({ ...form, productSlot2: e.target.value })}
                disabled={!canEdit}
                className="input-field"
              >
                <option value="">Aucun</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === form.productSlot1}>
                    {p.name}{p.brand ? ` — ${p.brand}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {canEdit && (
          <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer la page boutique
          </button>
        )}
      </form>
    </>
  );
}
