"use client";

import { useState } from "react";
import {
  PAYMENT_CONTEXT_LABELS,
  PAYMENT_PROVIDER_LABELS,
  PAYMENT_METHOD_CODES,
  PAYMENT_CODE_LABELS,
  PAYMENT_ICON_OPTIONS,
  CINETPAY_CHANNEL_OPTIONS,
} from "@/lib/payment-methods";
import { PAYMENT_PROVIDER_TEMPLATES, type PaymentProviderTemplate } from "@/lib/payment-providers";
import { PaymentMethodLogo, type PaymentMethodDisplay } from "@/components/payments/PaymentMethodLogo";
import { PaymentMethodDetailModal } from "@/components/payments/PaymentMethodDetailModal";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Upload } from "lucide-react";
import type { PaymentMethodProvider, PaymentMethodContext } from "@prisma/client";

interface PaymentMethodRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  instructions: string | null;
  icon: string;
  logoUrl: string | null;
  apiChannel: string | null;
  context: PaymentMethodContext;
  provider: PaymentMethodProvider;
  isActive: boolean;
  sortOrder: number;
  minAmount: number | null;
  maxAmount: number | null;
}

const CUSTOM_TEMPLATE = "__custom__";

const emptyForm = {
  name: "",
  code: "",
  description: "",
  instructions: "",
  icon: "CreditCard",
  logoUrl: "",
  apiChannel: "",
  context: "BOTH" as PaymentMethodContext,
  provider: "CINETPAY" as PaymentMethodProvider,
  isActive: true,
  sortOrder: "0",
  minAmount: "",
  maxAmount: "",
};

function toPreviewMethod(form: typeof emptyForm): PaymentMethodDisplay {
  return {
    code: form.code,
    name: form.name || "Aperçu",
    description: form.description || null,
    instructions: form.instructions || null,
    icon: form.icon,
    logoUrl: form.logoUrl || null,
    apiChannel: form.apiChannel || null,
    provider: form.provider,
    context: form.context,
    isActive: form.isActive,
  };
}

export function PaymentMethodManager({ initial }: { initial: PaymentMethodRow[] }) {
  const [methods, setMethods] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [detailMethod, setDetailMethod] = useState<PaymentMethodDisplay | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const usedCodes = new Set(methods.map((m) => m.code));
  const availableTemplates = PAYMENT_PROVIDER_TEMPLATES.filter(
    (t) => !usedCodes.has(t.code) || t.code === form.code
  );
  const availableCodes = PAYMENT_METHOD_CODES.filter(
    (c) => !usedCodes.has(c) || c === form.code
  );

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    setSelectedTemplate(null);
  };

  const refresh = async () => {
    const res = await fetch("/api/admin/payment-methods");
    const data = await res.json();
    if (Array.isArray(data)) setMethods(data);
  };

  const applyTemplate = (t: PaymentProviderTemplate) => {
    setSelectedTemplate(t.code);
    setForm({
      name: t.name,
      code: t.code,
      description: t.description,
      instructions: t.instructions ?? "",
      icon: t.icon,
      logoUrl: t.logoUrl,
      apiChannel: t.apiChannel ?? "",
      context: t.context,
      provider: t.provider,
      isActive: true,
      sortOrder: String(t.code === "CASH_ON_DELIVERY" ? 1 : PAYMENT_PROVIDER_TEMPLATES.indexOf(t) + 1),
      minAmount: "",
      maxAmount: "",
    });
  };

  const startCustom = () => {
    setSelectedTemplate(CUSTOM_TEMPLATE);
    setForm(emptyForm);
  };

  const setField = (key: string, value: string | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };

      if (key === "provider") {
        const provider = value as PaymentMethodProvider;
        if (provider !== "CINETPAY") {
          next.apiChannel = "";
        } else if (!next.apiChannel) {
          next.apiChannel = "MOBILE_MONEY";
        }
        if (provider === "CASH_ON_DELIVERY" && next.context === "ACCOMPAGNEMENT") {
          next.context = "BOUTIQUE";
        }
      }

      if (key === "context" && value === "ACCOMPAGNEMENT" && next.provider === "CASH_ON_DELIVERY") {
        next.context = "BOUTIQUE";
      }

      return next;
    });
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/admin/upload/payment-logo", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const { url } = await res.json();
      setField("logoUrl", url);
    } else {
      const d = await res.json();
      alert(d.error || "Erreur upload");
    }
  };

  const canSave =
    Boolean(form.name.trim()) &&
    Boolean(form.code) &&
    (form.provider !== "CINETPAY" || Boolean(form.apiChannel));

  const save = async () => {
    if (!canSave) {
      alert("Complétez le nom, le code technique et le canal API si CinetPay est sélectionné.");
      return;
    }

    setLoading(true);
    const url = editing ? `/api/admin/payment-methods/${editing}` : "/api/admin/payment-methods";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
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
    setSelectedTemplate(m.code);
    setForm({
      name: m.name,
      code: m.code,
      description: m.description ?? "",
      instructions: m.instructions ?? "",
      icon: m.icon,
      logoUrl: m.logoUrl ?? "",
      apiChannel: m.apiChannel ?? "",
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

  const openCreateForm = () => {
    reset();
    setShowForm(true);
    startCustom();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-section mb-1">Modes de paiement</h1>
          <p className="text-brand-600 text-sm">
            Créez ou modifiez un mode : logo, API, canal CinetPay, consignes et limites de montant.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="btn-primary inline-flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          Ajouter un mode
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-brand-100 p-6 mb-8 space-y-8">
          <h2 className="font-display text-lg">
            {editing ? "Modifier le mode de paiement" : "Nouveau mode de paiement"}
          </h2>

          {!editing && (
            <div>
              <label className="label-field mb-3 block">Préremplir depuis un modèle API (optionnel)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={startCustom}
                  className={`flex flex-col items-center justify-center gap-2 p-4 border text-center transition-all min-h-[120px] ${
                    selectedTemplate === CUSTOM_TEMPLATE
                      ? "border-brand-950 bg-brand-50 ring-1 ring-brand-950"
                      : "border-brand-200 hover:border-brand-400 border-dashed"
                  }`}
                >
                  <Plus className="w-6 h-6 text-brand-400" />
                  <span className="text-xs font-medium">Configuration manuelle</span>
                  <span className="text-[10px] text-brand-400">Tous les champs éditables</span>
                </button>
                {availableTemplates.map((t) => (
                  <button
                    key={t.code}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className={`flex flex-col items-center gap-2 p-4 border text-center transition-all ${
                      selectedTemplate === t.code
                        ? "border-brand-950 bg-brand-50 ring-1 ring-brand-950"
                        : "border-brand-200 hover:border-brand-400"
                    }`}
                  >
                    <PaymentMethodLogo method={t} size="md" />
                    <span className="text-xs font-medium">{t.name}</span>
                    <span className="text-[10px] text-brand-400">{t.apiLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Identité & logo */}
          <section className="space-y-4">
            <h3 className="text-overline text-brand-500">Identité & logo</h3>
            <div className="flex flex-wrap items-start gap-6 p-4 bg-brand-50 border border-brand-100">
              <PaymentMethodLogo
                method={toPreviewMethod(form)}
                size="lg"
                clickable={Boolean(form.name || form.logoUrl)}
                onClick={() => form.name && setDetailMethod(toPreviewMethod(form))}
              />
              <div className="flex-1 min-w-[240px] space-y-4">
                <div>
                  <label className="label-field">Logo (URL ou upload)</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      className="input-field flex-1 text-sm"
                      value={form.logoUrl}
                      onChange={(e) => setField("logoUrl", e.target.value)}
                      placeholder="/payments/orange-money.svg ou /uploads/payments/..."
                    />
                    <label className="btn-secondary inline-flex items-center gap-1 text-xs cursor-pointer px-3">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Nom affiché *</label>
                    <input
                      className="input-field"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="Orange Money"
                    />
                  </div>
                  <div>
                    <label className="label-field">Code technique *</label>
                    <select
                      className="input-field font-mono text-sm"
                      value={form.code}
                      onChange={(e) => setField("code", e.target.value)}
                      disabled={Boolean(editing)}
                    >
                      <option value="">— Choisir un code —</option>
                      {availableCodes.map((code) => (
                        <option key={code} value={code}>
                          {PAYMENT_CODE_LABELS[code]} ({code})
                        </option>
                      ))}
                    </select>
                    {editing && (
                      <p className="text-[10px] text-brand-400 mt-1">Le code ne peut pas être modifié après création.</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="label-field">Icône de secours (si pas de logo)</label>
                  <select className="input-field" value={form.icon} onChange={(e) => setField("icon", e.target.value)}>
                    {PAYMENT_ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-brand-500">
                  Cliquez sur le logo pour prévisualiser la fiche détaillée vue par le client.
                </p>
              </div>
            </div>
          </section>

          {/* API & traitement */}
          <section className="space-y-4">
            <h3 className="text-overline text-brand-500">API & traitement</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label-field">Fournisseur / API *</label>
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
              {form.provider === "CINETPAY" && (
                <div>
                  <label className="label-field">Canal CinetPay *</label>
                  <select
                    className="input-field font-mono text-sm"
                    value={form.apiChannel}
                    onChange={(e) => setField("apiChannel", e.target.value)}
                  >
                    <option value="">— Choisir un canal —</option>
                    {CINETPAY_CHANNEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="label-field">Contexte d&apos;utilisation *</label>
                <select
                  className="input-field"
                  value={form.context}
                  onChange={(e) => setField("context", e.target.value)}
                >
                  {Object.entries(PAYMENT_CONTEXT_LABELS).map(([k, v]) => (
                    <option
                      key={k}
                      value={k}
                      disabled={form.provider === "CASH_ON_DELIVERY" && k === "ACCOMPAGNEMENT"}
                    >
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Contenu client */}
          <section className="space-y-4">
            <h3 className="text-overline text-brand-500">Informations client</h3>
            <div>
              <label className="label-field">Description courte</label>
              <input
                className="input-field"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Paiement sécurisé via Orange Money"
              />
            </div>
            <div>
              <label className="label-field">Instructions détaillées</label>
              <textarea
                className="input-field min-h-[100px]"
                value={form.instructions}
                onChange={(e) => setField("instructions", e.target.value)}
                placeholder="Consignes affichées au client après sélection du mode…"
              />
            </div>
          </section>

          {/* Paramètres */}
          <section className="space-y-4">
            <h3 className="text-overline text-brand-500">Paramètres</h3>
            <div className="grid sm:grid-cols-3 gap-4">
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
              <div>
                <label className="label-field">Montant min. (FCFA)</label>
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
                <label className="label-field">Montant max. (FCFA)</label>
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
              <input type="checkbox" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} />
              Mode actif (visible sur le site)
            </label>
          </section>

          <div className="flex gap-3 pt-2 border-t border-brand-100">
            <button
              type="button"
              onClick={save}
              disabled={loading || !canSave}
              className="btn-primary inline-flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Enregistrer les modifications" : "Créer le mode de paiement"}
            </button>
            <button type="button" onClick={reset} className="btn-secondary">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {methods.map((m) => (
          <article key={m.id} className="bg-white border border-brand-100 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <PaymentMethodLogo
                method={m}
                size="md"
                clickable
                onClick={() => setDetailMethod(m)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-medium">{m.name}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-brand-100 text-brand-600">{m.code}</span>
                </div>
                {m.description && <p className="text-sm text-brand-500 line-clamp-1">{m.description}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-50 border border-brand-100">{PAYMENT_CONTEXT_LABELS[m.context]}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-50 border border-brand-100">{PAYMENT_PROVIDER_LABELS[m.provider]}</span>
                  {m.apiChannel && (
                    <span className="text-[10px] font-mono text-brand-400">{m.apiChannel}</span>
                  )}
                </div>
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
            Aucun mode de paiement — ajoutez-en un pour commencer.
          </p>
        )}
      </div>

      <PaymentMethodDetailModal
        method={detailMethod}
        open={!!detailMethod}
        onOpenChange={(open) => !open && setDetailMethod(null)}
      />
    </div>
  );
}
