"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";
import {
  PAYMENT_CONTEXT_LABELS,
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_ICON_OPTIONS,
  PAYMENT_METHOD_CODES,
  normalizePaymentCode,
} from "@/lib/payment-methods";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

interface PaymentMethodRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  instructions: string | null;
  icon: string;
  context: keyof typeof PAYMENT_CONTEXT_LABELS;
  provider: keyof typeof PAYMENT_PROVIDER_LABELS;
  isActive: boolean;
  sortOrder: number;
  minAmount: number | null;
  maxAmount: number | null;
}

const emptyForm = {
  name: "",
  code: "",
  description: "",
  instructions: "",
  icon: "CreditCard",
  context: "BOTH",
  provider: "CINETPAY",
  isActive: true,
  sortOrder: "0",
  minAmount: "",
  maxAmount: "",
};

export function PaymentMethodManager({ initial }: { initial: PaymentMethodRow[] }) {
  const [methods, setMethods] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [autoCode, setAutoCode] = useState(true);

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setAutoCode(true);
  };

  const refresh = async () => {
    const res = await fetch("/api/admin/payment-methods");
    const data = await res.json();
    if (Array.isArray(data)) setMethods(data);
  };

  const setField = (key: string, value: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && autoCode && typeof value === "string") {
        next.code = normalizePaymentCode(slugify(value).replace(/-/g, "_"));
      }
      if (key === "provider" && value === "CASH_ON_DELIVERY") {
        next.context = f.context === "ACCOMPAGNEMENT" ? "BOUTIQUE" : f.context;
      }
      return next;
    });
  };

  const save = async () => {
    setLoading(true);
    const url = editing ? `/api/admin/payment-methods/${editing}` : "/api/admin/payment-methods";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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

  const startEdit = (m: PaymentMethodRow) => {
    setEditing(m.id);
    setShowForm(true);
    setAutoCode(false);
    setForm({
      name: m.name,
      code: m.code,
      description: m.description ?? "",
      instructions: m.instructions ?? "",
      icon: m.icon,
      context: m.context,
      provider: m.provider,
      isActive: m.isActive,
      sortOrder: String(m.sortOrder),
      minAmount: m.minAmount != null ? String(m.minAmount) : "",
      maxAmount: m.maxAmount != null ? String(m.maxAmount) : "",
    });
  };

  const toggleActive = async (m: PaymentMethodRow) => {
    await fetch(`/api/admin/payment-methods/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !m.isActive }),
    });
    refresh();
  };

  const remove = async (m: PaymentMethodRow) => {
    if (!confirm(`Supprimer le mode « ${m.name} » ?`)) return;
    const res = await fetch(`/api/admin/payment-methods/${m.id}`, { method: "DELETE" });
    if (res.ok) refresh();
    else {
      const d = await res.json();
      alert(d.error || "Erreur");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-section mb-1">Modes de paiement</h1>
          <p className="text-brand-600 text-sm">
            Configurez les options proposées au checkout boutique et à la réservation accompagnement.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            reset();
            setShowForm(true);
          }}
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Ajouter un mode
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-brand-100 p-6 mb-8 space-y-6">
          <h2 className="font-display text-lg">
            {editing ? "Modifier le mode de paiement" : "Nouveau mode de paiement"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Nom affiché *</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Ex. Orange Money"
              />
            </div>
            <div>
              <label className="label-field">Code technique *</label>
              {editing ? (
                <input
                  className="input-field font-mono text-sm"
                  value={form.code}
                  onChange={(e) => {
                    setAutoCode(false);
                    setField("code", normalizePaymentCode(e.target.value));
                  }}
                />
              ) : (
                <select
                  className="input-field font-mono text-sm"
                  value={form.code}
                  onChange={(e) => {
                    setAutoCode(false);
                    setField("code", e.target.value);
                  }}
                >
                  <option value="">Choisir un code</option>
                  {PAYMENT_METHOD_CODES.filter(
                    (c) => !methods.some((m) => m.code === c) || c === form.code
                  ).map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              )}
              <p className="text-[10px] text-brand-400 mt-1">Codes standard liés au système de paiement</p>
            </div>
          </div>

          <div>
            <label className="label-field">Description courte</label>
            <input
              className="input-field"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Texte affiché sous le nom au checkout"
            />
          </div>

          <div>
            <label className="label-field">Instructions détaillées</label>
            <textarea
              className="input-field min-h-[100px]"
              value={form.instructions}
              onChange={(e) => setField("instructions", e.target.value)}
              placeholder="Consignes affichées quand le client sélectionne ce mode (RIB, délais, etc.)"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label-field">Contexte d&apos;usage *</label>
              <select
                className="input-field"
                value={form.context}
                onChange={(e) => setField("context", e.target.value)}
              >
                {Object.entries(PAYMENT_CONTEXT_LABELS).map(([k, v]) => (
                  <option key={k} value={k} disabled={form.provider === "CASH_ON_DELIVERY" && k === "ACCOMPAGNEMENT"}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Type de traitement *</label>
              <select
                className="input-field"
                value={form.provider}
                onChange={(e) => setField("provider", e.target.value)}
              >
                {Object.entries(PAYMENT_PROVIDER_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Icône</label>
              <select className="input-field" value={form.icon} onChange={(e) => setField("icon", e.target.value)}>
                {PAYMENT_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Ordre d&apos;affichage</label>
              <input
                type="number"
                className="input-field"
                value={form.sortOrder}
                onChange={(e) => setField("sortOrder", e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Montant minimum (FCFA)</label>
              <input
                type="number"
                className="input-field"
                value={form.minAmount}
                onChange={(e) => setField("minAmount", e.target.value)}
                placeholder="Optionnel"
                min={0}
              />
            </div>
            <div>
              <label className="label-field">Montant maximum (FCFA)</label>
              <input
                type="number"
                className="input-field"
                value={form.maxAmount}
                onChange={(e) => setField("maxAmount", e.target.value)}
                placeholder="Optionnel"
                min={0}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField("isActive", e.target.checked)}
            />
            Mode actif (visible sur le site)
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={save} disabled={loading || !form.name || !form.code} className="btn-primary inline-flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Enregistrer" : "Créer le mode"}
            </button>
            <button type="button" onClick={reset} className="btn-secondary">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {methods.map((m) => (
          <article
            key={m.id}
            className="bg-white border border-brand-100 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-medium">{m.name}</h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-100 text-brand-600">
                  {m.code}
                </span>
              </div>
              {m.description && <p className="text-sm text-brand-500 line-clamp-1">{m.description}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-50 border border-brand-100">
                  {PAYMENT_CONTEXT_LABELS[m.context]}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-50 border border-brand-100">
                  {PAYMENT_PROVIDER_LABELS[m.provider]}
                </span>
                {(m.minAmount != null || m.maxAmount != null) && (
                  <span className="text-[10px] text-brand-400">
                    {m.minAmount != null ? `Min ${m.minAmount.toLocaleString("fr-FR")}` : ""}
                    {m.minAmount != null && m.maxAmount != null ? " · " : ""}
                    {m.maxAmount != null ? `Max ${m.maxAmount.toLocaleString("fr-FR")}` : ""} FCFA
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${m.isActive ? "bg-green-100 text-green-800" : "bg-brand-100"}`}>
                {m.isActive ? "Actif" : "Inactif"}
              </span>
              <button type="button" onClick={() => toggleActive(m)} className="p-1.5 hover:bg-brand-50 rounded" title={m.isActive ? "Désactiver" : "Activer"}>
                {m.isActive ? <EyeOff className="w-4 h-4 text-brand-600" /> : <Eye className="w-4 h-4 text-brand-600" />}
              </button>
              <button type="button" onClick={() => startEdit(m)} className="p-1.5 hover:bg-brand-50 rounded" title="Modifier">
                <Pencil className="w-4 h-4 text-brand-600" />
              </button>
              <button type="button" onClick={() => remove(m)} className="p-1.5 hover:bg-red-50 rounded" title="Supprimer">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </article>
        ))}
        {methods.length === 0 && (
          <p className="text-center text-brand-400 py-12 bg-white border border-brand-100">
            Aucun mode de paiement — ajoutez-en un ou lancez le seed.
          </p>
        )}
      </div>
    </div>
  );
}
