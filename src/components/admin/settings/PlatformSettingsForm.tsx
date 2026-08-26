"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

export interface PlatformSettingsView {
  appUrl: string;
  whatsappNumber: string;
  cinetpaySiteId: string;
  cinetpayNotifyUrl: string;
  contactEmail: string;
  cinetpayApiKey: string;
  cinetpayConfigured: boolean;
  database: string;
}

const EMPTY_SETTINGS: PlatformSettingsView = {
  appUrl: "",
  whatsappNumber: "",
  cinetpaySiteId: "",
  cinetpayNotifyUrl: "",
  contactEmail: "",
  cinetpayApiKey: "",
  cinetpayConfigured: false,
  database: "PostgreSQL",
};

interface PlatformSettingsFormProps {
  initial?: PlatformSettingsView;
  canEdit: boolean;
}

export function PlatformSettingsForm({ initial, canEdit }: PlatformSettingsFormProps) {
  const [form, setForm] = useState<PlatformSettingsView>(initial ?? EMPTY_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!initial?.appUrl);
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/platform-settings");
        const data = await res.json();
        if (!cancelled && res.ok && data?.appUrl !== undefined) {
          setForm(data);
        }
      } catch {
        // keep defaults / SSR initial
      } finally {
        if (!cancelled) setFetching(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (initial?.appUrl) setForm(initial);
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setLoading(true);

    try {
      const res = await fetch("/api/admin/platform-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour");

      setForm({ ...EMPTY_SETTINGS, ...data });
      showSuccess("La configuration plateforme a été enregistrée.", "Configuration enregistrée");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {FeedbackModal}
      <form onSubmit={handleSubmit} className="bg-white border border-brand-100 p-6 space-y-6">
      {fetching && (
        <p className="text-sm text-brand-500 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Chargement de la configuration…
        </p>
      )}
      <div>
        <h2 className="font-display text-lg mb-1">Configuration plateforme</h2>
        <p className="text-sm text-brand-500">
          Ces paramètres sont enregistrés en base et utilisés par le site et les paiements.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">URL publique</span>
          <input
            type="url"
            required
            disabled={!canEdit}
            value={form.appUrl ?? ""}
            onChange={(e) => setForm({ ...form, appUrl: e.target.value })}
            className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm disabled:bg-brand-50"
            placeholder="https://..."
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">WhatsApp</span>
          <input
            type="tel"
            required
            disabled={!canEdit}
            value={form.whatsappNumber ?? ""}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm disabled:bg-brand-50"
            placeholder="+225..."
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">Email de contact</span>
          <input
            type="email"
            disabled={!canEdit}
            value={form.contactEmail ?? ""}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm disabled:bg-brand-50"
          />
        </label>
        <div className="sm:col-span-2 border-t border-brand-100 pt-4">
          <p className="text-sm font-medium text-brand-950 mb-3">CinetPay</p>
          <p className="text-xs text-brand-500 mb-4">
            Statut : {form.cinetpayConfigured ? "Configuré" : "À configurer"}
          </p>
        </div>
        <label className="block sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">Clé API CinetPay</span>
          <input
            type="password"
            disabled={!canEdit}
            value={form.cinetpayApiKey ?? ""}
            onChange={(e) => setForm({ ...form, cinetpayApiKey: e.target.value })}
            className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm disabled:bg-brand-50"
            placeholder={form.cinetpayConfigured ? "Laisser tel quel ou saisir une nouvelle clé" : "Clé API"}
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">Site ID</span>
          <input
            type="text"
            disabled={!canEdit}
            value={form.cinetpaySiteId ?? ""}
            onChange={(e) => setForm({ ...form, cinetpaySiteId: e.target.value })}
            className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm disabled:bg-brand-50"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">URL webhook</span>
          <input
            type="url"
            disabled={!canEdit}
            value={form.cinetpayNotifyUrl ?? ""}
            onChange={(e) => setForm({ ...form, cinetpayNotifyUrl: e.target.value })}
            className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm disabled:bg-brand-50"
          />
        </label>
        <div className="sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-brand-400">Base de données</span>
          <p className="mt-1 text-sm text-brand-600">{form.database ?? "PostgreSQL"}</p>
          <p className="text-xs text-brand-400 mt-1">Information technique — non modifiable depuis l&apos;interface.</p>
        </div>
      </div>

      {canEdit && (
        <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer la configuration
        </button>
      )}
      </form>
    </>
  );
}
