"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

export function BrandManager({ initial }: { initial: Brand[] }) {
  const [brands, setBrands] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
    sortOrder: "0",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { showSuccess, showError, showConfirm, FeedbackModal } = useFeedbackModal();

  const reset = () => {
    setForm({ name: "", slug: "", description: "", logo: "", sortOrder: "0", isActive: true });
    setEditing(null);
    setShowNew(false);
  };

  const refresh = async () => {
    const res = await fetch("/api/admin/brands");
    setBrands(await res.json());
  };

  const save = async () => {
    setLoading(true);
    const url = editing ? `/api/admin/brands/${editing}` : "/api/admin/brands";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      showSuccess(
        editing ? "La marque a été mise à jour." : "La marque a été créée.",
        "Marque enregistrée"
      );
      reset();
      refresh();
    } else {
      const d = await res.json();
      showError(d.error || "Erreur");
    }
  };

  const startEdit = (b: Brand) => {
    setEditing(b.id);
    setShowNew(true);
    setForm({
      name: b.name,
      slug: b.slug,
      description: b.description ?? "",
      logo: b.logo ?? "",
      sortOrder: String(b.sortOrder),
      isActive: b.isActive,
    });
  };

  const remove = (b: Brand) => {
    showConfirm(
      `Supprimer la marque « ${b.name} » ? (${b._count.products} produit(s))`,
      async () => {
        const res = await fetch(`/api/admin/brands/${b.id}`, { method: "DELETE" });
        if (res.ok) {
          showSuccess("La marque a été supprimée.", "Supprimée");
          refresh();
        } else {
          const d = await res.json();
          showError(d.error || "Erreur");
        }
      },
      "Supprimer la marque"
    );
  };

  return (
    <>
      {FeedbackModal}
      <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="heading-section mb-1">Marques</h1>
          <p className="text-brand-600 text-sm">Gérez les maisons et labels de votre boutique</p>
        </div>
        <button
          type="button"
          onClick={() => {
            reset();
            setShowNew(true);
          }}
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Nouvelle marque
        </button>
      </div>

      {showNew && (
        <div className="bg-white border border-brand-100 p-6 mb-6 space-y-4">
          <h2 className="font-display text-lg">
            {editing ? "Modifier la marque" : "Nouvelle marque"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              className="input-field"
              placeholder="Nom *"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: editing ? f.slug : slugify(e.target.value),
                }))
              }
            />
            <input
              className="input-field"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <input
              className="input-field sm:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <input
              className="input-field sm:col-span-2"
              placeholder="URL logo (optionnel)"
              value={form.logo}
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Ordre"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active
            </label>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={save} disabled={loading} className="btn-primary text-xs inline-flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
            <button type="button" onClick={reset} className="btn-secondary text-xs">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map((b) => (
          <article
            key={b.id}
            className={`p-5 border bg-white ${b.isActive ? "border-brand-100" : "border-brand-200 opacity-60"}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display text-lg">{b.name}</h3>
              <div className="flex gap-1">
                <button type="button" onClick={() => startEdit(b)} className="p-1 hover:bg-brand-50">
                  <Pencil className="w-4 h-4 text-brand-500" />
                </button>
                <button type="button" onClick={() => remove(b)} className="p-1 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <p className="text-xs text-brand-400 mb-2">/{b.slug}</p>
            <p className="text-sm font-medium">{b._count.products} produit(s)</p>
          </article>
        ))}
      </div>
      {brands.length === 0 && (
        <p className="text-center text-brand-400 py-12">Aucune marque — créez la première.</p>
      )}
    </div>
    </>
  );
}
