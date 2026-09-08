"use client";

import { Plus, Trash2 } from "lucide-react";

export interface VariantFormRow {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  lowStockThreshold: string;
  trackInventory: boolean;
  isActive: boolean;
}

interface ProductVariantEditorProps {
  rows: VariantFormRow[];
  onChange: (rows: VariantFormRow[]) => void;
  basePrice: string;
}

const emptyRow = (basePrice: string): VariantFormRow => ({
  size: "",
  color: "",
  sku: "",
  price: basePrice,
  compareAtPrice: "",
  stock: "0",
  lowStockThreshold: "3",
  trackInventory: true,
  isActive: true,
});

export function ProductVariantEditor({ rows, onChange, basePrice }: ProductVariantEditorProps) {
  const updateRow = (index: number, patch: Partial<VariantFormRow>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => onChange([...rows, emptyRow(basePrice)]);
  const removeRow = (index: number) => onChange(rows.filter((_, i) => i !== index));

  return (
    <section className="space-y-4 border border-brand-100 p-6 bg-brand-50/50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg">Variantes (taille / couleur / stock)</h3>
          <p className="text-xs text-brand-500 mt-1">
            Obligatoire pour vendre plusieurs tailles ou couleurs. Le prix serveur sera celui de la variante.
          </p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary text-xs inline-flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-brand-400">Aucune variante — le prix produit s&apos;applique tel quel.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id ?? index} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white border border-brand-100">
              <div>
                <label className="label-field">Taille</label>
                <input className="input-field" value={row.size} onChange={(e) => updateRow(index, { size: e.target.value })} placeholder="M" />
              </div>
              <div>
                <label className="label-field">Couleur</label>
                <input className="input-field" value={row.color} onChange={(e) => updateRow(index, { color: e.target.value })} placeholder="Noir" />
              </div>
              <div>
                <label className="label-field">SKU</label>
                <input className="input-field font-mono text-sm" value={row.sku} onChange={(e) => updateRow(index, { sku: e.target.value })} placeholder="BLZ-M-NOIR" />
              </div>
              <div>
                <label className="label-field">Prix (FCFA)</label>
                <input type="number" className="input-field" value={row.price} onChange={(e) => updateRow(index, { price: e.target.value })} min={0} />
              </div>
              <div>
                <label className="label-field">Prix barré</label>
                <input type="number" className="input-field" value={row.compareAtPrice} onChange={(e) => updateRow(index, { compareAtPrice: e.target.value })} min={0} placeholder="Optionnel" />
              </div>
              <div>
                <label className="label-field">Stock</label>
                <input type="number" className="input-field" value={row.stock} onChange={(e) => updateRow(index, { stock: e.target.value })} min={0} />
              </div>
              <div>
                <label className="label-field">Seuil alerte</label>
                <input type="number" className="input-field" value={row.lowStockThreshold} onChange={(e) => updateRow(index, { lowStockThreshold: e.target.value })} min={0} />
              </div>
              <div className="flex flex-col justify-end gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={row.trackInventory} onChange={(e) => updateRow(index, { trackInventory: e.target.checked })} />
                  Suivre le stock
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={row.isActive} onChange={(e) => updateRow(index, { isActive: e.target.checked })} />
                  Active
                </label>
                <button type="button" onClick={() => removeRow(index)} className="text-xs text-red-600 inline-flex items-center gap-1 mt-1">
                  <Trash2 className="w-3 h-3" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function variantsToFormRows(
  variants: Array<{
    id: string;
    size: string | null;
    color: string | null;
    sku: string | null;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    isActive: boolean;
  }>
): VariantFormRow[] {
  return variants.map((v) => ({
    id: v.id,
    size: v.size ?? "",
    color: v.color ?? "",
    sku: v.sku ?? "",
    price: String(v.price),
    compareAtPrice: v.compareAtPrice != null ? String(v.compareAtPrice) : "",
    stock: String(v.stock),
    lowStockThreshold: String(v.lowStockThreshold),
    trackInventory: v.trackInventory,
    isActive: v.isActive,
  }));
}
