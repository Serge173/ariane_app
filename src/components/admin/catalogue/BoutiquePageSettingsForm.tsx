"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
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
    spotlightTitle: initial.spotlightTitle,
    spotlightButtonLabel: initial.spotlightButtonLabel,
    productSlot1: initial.spotlightProductIds[0] ?? "",
    productSlot2: initial.spotlightProductIds[1] ?? "",
  });
  const [loading, setLoading] = useState(false);

  const selectedIds = [form.productSlot1, form.productSlot2].filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/boutique-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotlightTitle: form.spotlightTitle,
          spotlightButtonLabel: form.spotlightButtonLabel,
          spotlightProductIds: selectedIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Enregistrement impossible");
        return;
      }
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
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <section className="bg-white border border-brand-100 p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl mb-1">Section « Les plus convoités »</h2>
            <p className="text-sm text-brand-600 leading-relaxed">
              Le titre de section et le libellé du bouton se configurent ici. L&apos;image, la
              marque, le nom et la description de chaque produit viennent de sa{" "}
              <Link href="/admin/catalogue/produits?type=LUXE" className="underline">
                fiche produit
              </Link>
              .
            </p>
          </div>

          <div>
            <label className="label-field" htmlFor="spotlightTitle">
              Titre de la section
            </label>
            <input
              id="spotlightTitle"
              type="text"
              value={form.spotlightTitle}
              onChange={(e) => setForm((f) => ({ ...f, spotlightTitle: e.target.value }))}
              disabled={!canEdit}
              className="input-field"
              placeholder="Les plus convoités"
            />
          </div>

          <div>
            <label className="label-field" htmlFor="spotlightButtonLabel">
              Texte du bouton
            </label>
            <input
              id="spotlightButtonLabel"
              type="text"
              value={form.spotlightButtonLabel}
              onChange={(e) => setForm((f) => ({ ...f, spotlightButtonLabel: e.target.value }))}
              disabled={!canEdit}
              className="input-field"
              placeholder="Découvrir"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="productSlot1">
                Produit 1
              </label>
              <select
                id="productSlot1"
                value={form.productSlot1}
                onChange={(e) => setForm((f) => ({ ...f, productSlot1: e.target.value }))}
                disabled={!canEdit}
                className="input-field"
              >
                <option value="">Automatique (produit exclusif)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === form.productSlot2}>
                    {p.name}
                    {p.brand ? ` — ${p.brand}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field" htmlFor="productSlot2">
                Produit 2
              </label>
              <select
                id="productSlot2"
                value={form.productSlot2}
                onChange={(e) => setForm((f) => ({ ...f, productSlot2: e.target.value }))}
                disabled={!canEdit}
                className="input-field"
              >
                <option value="">Aucun</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === form.productSlot1}>
                    {p.name}
                    {p.brand ? ` — ${p.brand}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-brand-500 leading-relaxed">
            Laissez « Automatique » pour afficher les produits marqués « Exclusif » dans le
            catalogue. Sinon, choisissez jusqu&apos;à 2 articles précis.
          </p>
        </section>

        {canEdit && (
          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer
          </button>
        )}
      </form>
    </>
  );
}
