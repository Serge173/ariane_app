"use client";

import { useMemo, useState } from "react";
import { slugify } from "@/lib/utils";
import {
  buildCategoryTree,
  getCategoryDescendantIds,
} from "@/lib/categories";
import { Plus, Pencil, Trash2, Loader2, FolderTree, ShoppingBag } from "lucide-react";

type CatalogScope = "LUXE" | "SERVICE";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  scope: CatalogScope;
  parent?: { id: string; name: string } | null;
  _count: { products: number };
}

type CategoryWithChildren = Category & { children: CategoryWithChildren[] };

const SCOPE_LABELS: Record<CatalogScope, string> = {
  LUXE: "Boutique luxe",
  SERVICE: "Accompagnements",
};

export function CategoryManager({ initial }: { initial: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [activeScope, setActiveScope] = useState<CatalogScope>("LUXE");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    sortOrder: "0",
    isActive: true,
    scope: "LUXE" as CatalogScope,
  });
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const scopedCategories = useMemo(
    () => categories.filter((c) => c.scope === activeScope),
    [categories, activeScope]
  );

  const tree = useMemo(
    () => buildCategoryTree(scopedCategories) as CategoryWithChildren[],
    [scopedCategories]
  );

  const parentOptions = useMemo(() => {
    if (!editing) {
      return scopedCategories.filter((c) => !c.parentId);
    }
    const blocked = getCategoryDescendantIds(editing, scopedCategories);
    return scopedCategories.filter((c) => !c.parentId && !blocked.has(c.id));
  }, [scopedCategories, editing]);

  const reset = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      parentId: "",
      sortOrder: "0",
      isActive: true,
      scope: activeScope,
    });
    setEditing(null);
    setShowNew(false);
  };

  const refresh = async () => {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
  };

  const save = async () => {
    setLoading(true);
    const url = editing ? `/api/admin/categories/${editing}` : "/api/admin/categories";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        parentId: form.parentId || null,
        scope: form.parentId ? undefined : form.scope,
      }),
    });

    setLoading(false);
    if (res.ok) {
      reset();
      refresh();
    } else {
      const d = await res.json();
      alert(d.error || "Erreur");
    }
  };

  const startCreate = (parentId = "") => {
    reset();
    setShowNew(true);
    setForm({
      name: "",
      slug: "",
      description: "",
      parentId,
      sortOrder: "0",
      isActive: true,
      scope: activeScope,
    });
  };

  const startEdit = (c: Category) => {
    setEditing(c.id);
    setShowNew(true);
    setActiveScope(c.scope);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      parentId: c.parentId ?? "",
      sortOrder: String(c.sortOrder),
      isActive: c.isActive,
      scope: c.scope,
    });
  };

  const remove = async (c: Category) => {
    const childCount = categories.filter((x) => x.parentId === c.id).length;
    const msg =
      childCount > 0
        ? `« ${c.name} » a ${childCount} sous-catégorie(s). Supprimer quand même ?`
        : `Supprimer « ${c.name} » ? (${c._count.products} produit(s))`;
    if (!confirm(msg)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.message) alert(data.message);
    refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="heading-section mb-1">Catégories</h1>
          <p className="text-brand-600 text-sm">
            Organisez séparément la boutique luxe et les accompagnements
          </p>
        </div>
        <button
          type="button"
          onClick={() => startCreate()}
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Catégorie principale
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => { setActiveScope("LUXE"); reset(); }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
            activeScope === "LUXE"
              ? "bg-brand-950 text-white border-brand-950"
              : "border-brand-200 text-brand-600 hover:border-brand-950"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Boutique luxe
        </button>
        <button
          type="button"
          onClick={() => { setActiveScope("SERVICE"); reset(); }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
            activeScope === "SERVICE"
              ? "bg-brand-950 text-white border-brand-950"
              : "border-brand-200 text-brand-600 hover:border-brand-950"
          }`}
        >
          Accompagnements
        </button>
      </div>

      <p className="text-xs text-brand-500 mb-4">
        Affichage : <strong>{SCOPE_LABELS[activeScope]}</strong>
        {activeScope === "LUXE"
          ? " → visible sur /boutique"
          : " → visible sur /offres"}
      </p>

      {showNew && (
        <div className="bg-white border border-brand-100 p-6 mb-6 space-y-4">
          <h2 className="font-display text-lg">
            {editing
              ? "Modifier la catégorie"
              : form.parentId
              ? "Nouvelle sous-catégorie"
              : "Nouvelle catégorie principale"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Nom *</label>
              <input
                className="input-field"
                placeholder={activeScope === "LUXE" ? "Ex. Sacs, Sacs cabas..." : "Ex. Particuliers, Ateliers..."}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: editing ? f.slug : slugify(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="label-field">Slug URL</label>
              <input
                className="input-field"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            {!form.parentId && !editing && (
              <div className="sm:col-span-2">
                <label className="label-field">Catalogue *</label>
                <select
                  className="input-field"
                  value={form.scope}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scope: e.target.value as CatalogScope }))
                  }
                >
                  <option value="LUXE">Boutique luxe (/boutique)</option>
                  <option value="SERVICE">Accompagnements (/offres)</option>
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="label-field">Catégorie parente</label>
              <select
                className="input-field"
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
              >
                <option value="">— Catégorie principale (aucun parent) —</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {form.parentId && (
                <p className="text-xs text-brand-500 mt-1">
                  Sous-catégorie de : {categories.find((c) => c.id === form.parentId)?.name}
                  {" · "}
                  {SCOPE_LABELS[activeScope]}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Description</label>
              <input
                className="input-field"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="label-field">Ordre d&apos;affichage</label>
              <input
                type="number"
                className="input-field"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm self-end pb-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active
            </label>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={save} disabled={loading || !form.name} className="btn-primary text-xs inline-flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
            <button type="button" onClick={reset} className="btn-secondary text-xs">
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tree.map((root) => (
          <section key={root.id} className="bg-white border border-brand-100 overflow-hidden">
            <CategoryCard
              category={root}
              depth={0}
              onEdit={startEdit}
              onRemove={remove}
              onAddChild={(parentId) => startCreate(parentId)}
            />
            {root.children.length > 0 && (
              <div className="border-t border-brand-50">
                {root.children.map((child) => (
                  <CategoryCard
                    key={child.id}
                    category={child}
                    depth={1}
                    onEdit={startEdit}
                    onRemove={remove}
                    onAddChild={(parentId) => startCreate(parentId)}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
        {tree.length === 0 && (
          <p className="text-center text-brand-400 py-12 bg-white border border-brand-100">
            Aucune catégorie {SCOPE_LABELS[activeScope].toLowerCase()} — créez une catégorie principale.
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  depth,
  onEdit,
  onRemove,
  onAddChild,
}: {
  category: CategoryWithChildren;
  depth: number;
  onEdit: (c: Category) => void;
  onRemove: (c: Category) => void;
  onAddChild: (parentId: string) => void;
}) {
  const isRoot = depth === 0;

  return (
    <article
      className={`flex items-center justify-between gap-2 px-3 py-2 min-h-[44px] border-b border-brand-50 last:border-b-0 ${
        !category.isActive ? "opacity-60" : ""
      } ${depth > 0 ? "pl-8 bg-brand-50/30" : ""}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isRoot ? (
          <FolderTree className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.5} />
        ) : (
          <span className="w-4 flex-shrink-0 text-brand-300 text-xs text-center">↳</span>
        )}
        <span
          className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
            category.isActive ? "bg-green-500" : "bg-brand-300"
          }`}
          title={category.isActive ? "Active" : "Inactive"}
        />
        <div className="min-w-0 flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-medium truncate leading-tight">{category.name}</h3>
          <span className="text-[10px] text-brand-400 truncate">/{category.slug}</span>
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-brand-100 text-brand-600">
            {category.scope === "LUXE" ? "Boutique" : "Offres"}
          </span>
          <span className="text-[10px] text-brand-500 flex-shrink-0">
            {category._count.products} prod.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        {isRoot && (
          <button
            type="button"
            onClick={() => onAddChild(category.id)}
            className="p-1 hover:bg-brand-50 rounded text-brand-600"
            title="Ajouter une sous-catégorie"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
        <button type="button" onClick={() => onEdit(category)} className="p-1 hover:bg-brand-50 rounded">
          <Pencil className="w-3.5 h-3.5 text-brand-500" />
        </button>
        <button type="button" onClick={() => onRemove(category)} className="p-1 hover:bg-red-50 rounded">
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
    </article>
  );
}
