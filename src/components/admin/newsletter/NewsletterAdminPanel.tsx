"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { NewsletterSettings } from "@/lib/newsletter-settings";
import {
  DEFAULT_NEWSLETTER_BODY_TEMPLATE,
  DEFAULT_NEWSLETTER_SUBJECT_TEMPLATE,
} from "@/lib/newsletter-settings";

interface SubscriberRow {
  id: string;
  email: string;
  firstName: string | null;
  isActive: boolean;
  source: string | null;
  createdAt: string;
  confirmedAt: string | null;
}

interface BroadcastRow {
  id: string;
  title: string;
  recipientCount: number;
  sentAt: string;
  source?: string | null;
}

type SettingsState = NewsletterSettings & { webhookUrl?: string };

const emptyBroadcastForm = {
  title: "",
  intro: "",
  publicationBody: "",
  siteUrl: "",
  youtubeUrl: "",
  facebookUrl: "",
  whatsappUrl: "",
  twitterUrl: "",
  tiktokUrl: "",
  instagramUrl: "",
};

export function NewsletterAdminPanel({
  subscribers,
  broadcasts,
}: {
  subscribers: SubscriberRow[];
  broadcasts: BroadcastRow[];
}) {
  const [form, setForm] = useState(emptyBroadcastForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [settingsDraft, setSettingsDraft] = useState({
    autoSendOnBlogPublish: true,
    autoSendOnSocialWebhook: true,
    emailSubjectTemplate: DEFAULT_NEWSLETTER_SUBJECT_TEMPLATE,
    emailBodyTemplate: DEFAULT_NEWSLETTER_BODY_TEMPLATE,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState("");

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSettings(data);
      setSettingsDraft({
        autoSendOnBlogPublish: data.autoSendOnBlogPublish,
        autoSendOnSocialWebhook: data.autoSendOnSocialWebhook,
        emailSubjectTemplate: data.emailSubjectTemplate,
        emailBodyTemplate: data.emailBodyTemplate,
      });
    } catch (err) {
      setSettingsFeedback(err instanceof Error ? err.message : "Chargement impossible");
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const inactiveCount = subscribers.filter((s) => !s.isActive).length;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setFeedback(
        `Envoi terminé : ${data.sent} email(s) envoyé(s) sur ${data.recipientCount} abonné(s) actif(s).`
      );
      setForm(emptyBroadcastForm);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsFeedback("");
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/admin/newsletter/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsDraft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSettings(data);
      setSettingsFeedback("Paramètres enregistrés.");
    } catch (err) {
      setSettingsFeedback(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSettingsSaving(false);
    }
  };

  const regenerateWebhookSecret = async () => {
    if (!confirm("Générer un nouveau secret ? Les automatisations existantes devront être mises à jour.")) {
      return;
    }
    const secret = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    setSettingsSaving(true);
    try {
      const res = await fetch("/api/admin/newsletter/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookSecret: secret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSettings(data);
      setSettingsFeedback("Nouveau secret webhook généré.");
    } catch (err) {
      setSettingsFeedback(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="admin-kpi">
          <p className="admin-kpi-label">Abonnés actifs</p>
          <p className="admin-kpi-value">{activeCount}</p>
        </div>
        <div className="admin-kpi">
          <p className="admin-kpi-label">Inactifs (désinscrits)</p>
          <p className="admin-kpi-value">{inactiveCount}</p>
        </div>
        <div className="admin-kpi">
          <p className="admin-kpi-label">Total inscriptions</p>
          <p className="admin-kpi-value">{subscribers.length}</p>
        </div>
      </div>

      <section className="admin-panel">
        <h2 className="admin-panel-title mb-1">Envoi automatique & modèle d&apos;email</h2>
        <p className="text-sm text-brand-600 mb-6">
          Les abonnés actifs reçoivent un email d&apos;information à chaque publication. Sur le{" "}
          <strong>blog du site</strong>, l&apos;envoi se déclenche à la première mise en ligne d&apos;un article
          (si l&apos;option est activée). Pour Facebook, WhatsApp, X, TikTok, etc., connectez Make ou Zapier au
          webhook ci-dessous : dès qu&apos;une publication est détectée, le même modèle est utilisé.
        </p>
        {settingsLoading ? (
          <p className="text-sm text-brand-500 inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
          </p>
        ) : (
          <form onSubmit={saveSettings} className="space-y-5 max-w-3xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={settingsDraft.autoSendOnBlogPublish}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, autoSendOnBlogPublish: e.target.checked })
                }
              />
              <span className="text-sm">
                <strong>Site (blog)</strong> — envoyer automatiquement quand un article est publié (titre, extrait
                et contenu + lien vers l&apos;article).
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={settingsDraft.autoSendOnSocialWebhook}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, autoSendOnSocialWebhook: e.target.checked })
                }
              />
              <span className="text-sm">
                <strong>Réseaux (Facebook, WhatsApp, X, TikTok…)</strong> — accepter le webhook et envoyer
                automatiquement les emails aux abonnés.
              </span>
            </label>

            <div>
              <label className="label-field">Objet de l&apos;email (modèle)</label>
              <input
                className="input-field"
                value={settingsDraft.emailSubjectTemplate}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, emailSubjectTemplate: e.target.value })
                }
              />
              <p className="text-xs text-brand-500 mt-1">Variable : {"{{title}}"}</p>
            </div>
            <div>
              <label className="label-field">Message email (HTML modifiable)</label>
              <textarea
                className="input-field min-h-[220px] font-mono text-xs"
                value={settingsDraft.emailBodyTemplate}
                onChange={(e) =>
                  setSettingsDraft({ ...settingsDraft, emailBodyTemplate: e.target.value })
                }
              />
              <p className="text-xs text-brand-500 mt-2 leading-relaxed">
                Variables : {"{{greeting}}"}, {"{{message}}"}, {"{{publicationBlock}}"} (texte complet formaté),{" "}
                {"{{linksBlock}}"}, {"{{siteUrl}}"}, {"{{facebookUrl}}"}, {"{{whatsappUrl}}"}, {"{{twitterUrl}}"},{" "}
                {"{{tiktokUrl}}"}, {"{{instagramUrl}}"}, {"{{youtubeUrl}}"}, {"{{unsubscribeUrl}}"}
              </p>
            </div>

            {settings?.webhookUrl && (
              <div className="p-4 border-2 border-black bg-brand-50/50 space-y-2 text-sm">
                <p className="font-semibold">Webhook (Make, Zapier, n8n…)</p>
                <p>
                  <span className="text-brand-600">URL : </span>
                  <code className="text-xs break-all">{settings.webhookUrl}</code>
                </p>
                <p>
                  <span className="text-brand-600">Secret : </span>
                  <code className="text-xs break-all">{settings.webhookSecret}</code>
                </p>
                <p className="text-xs text-brand-600">
                  En-tête : <code>X-Newsletter-Secret: …</code> ou <code>Authorization: Bearer …</code>. Corps JSON
                  : title, message, publicationContent, facebookUrl, whatsappUrl, twitterUrl, tiktokUrl, siteUrl…
                </p>
                <button
                  type="button"
                  className="btn-secondary text-xs mt-2"
                  onClick={() => void regenerateWebhookSecret()}
                  disabled={settingsSaving}
                >
                  Régénérer le secret
                </button>
              </div>
            )}

            {settingsFeedback && <p className="text-sm text-brand-700">{settingsFeedback}</p>}
            <button type="submit" disabled={settingsSaving} className="btn-primary inline-flex items-center gap-2">
              {settingsSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer les paramètres
            </button>
          </form>
        )}
      </section>

      <section className="admin-panel">
        <h2 className="admin-panel-title mb-1">Publier & notifier manuellement</h2>
        <p className="text-sm text-brand-600 mb-6">
          Utilisez ce formulaire après une publication sur les réseaux : le texte complet et les liens sont inclus
          dans l&apos;email selon le modèle ci-dessus. Les clients avec un compte reçoivent aussi une notification
          dans Mon espace.
        </p>
        <form onSubmit={send} className="space-y-4 max-w-2xl">
          <div>
            <label className="label-field">Titre de l&apos;email *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex. : Nouvelle vidéo — 3 erreurs d'image à éviter"
              required
            />
          </div>
          <div>
            <label className="label-field">Message d&apos;introduction (optionnel)</label>
            <textarea
              className="input-field min-h-[80px]"
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
              placeholder="Courte intro avant le contenu de la publication…"
            />
          </div>
          <div>
            <label className="label-field">Contenu de la publication *</label>
            <textarea
              className="input-field min-h-[140px]"
              value={form.publicationBody}
              onChange={(e) => setForm({ ...form, publicationBody: e.target.value })}
              placeholder="Texte, légende ou description telle que publiée sur le réseau…"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Lien article / site</label>
              <input
                className="input-field"
                value={form.siteUrl}
                onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Lien Facebook</label>
              <input
                className="input-field"
                value={form.facebookUrl}
                onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Lien WhatsApp</label>
              <input
                className="input-field"
                value={form.whatsappUrl}
                onChange={(e) => setForm({ ...form, whatsappUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Lien X (Twitter)</label>
              <input
                className="input-field"
                value={form.twitterUrl}
                onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Lien TikTok</label>
              <input
                className="input-field"
                value={form.tiktokUrl}
                onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Lien Instagram</label>
              <input
                className="input-field"
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Lien YouTube</label>
              <input
                className="input-field"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              />
            </div>
          </div>
          {feedback && <p className="text-sm text-brand-700">{feedback}</p>}
          <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Envoyer aux abonnés
          </button>
        </form>
      </section>

      <section className="admin-panel overflow-x-auto">
        <h2 className="admin-panel-title mb-4">Abonnés</h2>
        <table className="admin-table w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-brand-100 text-left bg-brand-50">
              <th className="py-3 px-3 text-xs uppercase tracking-widest text-brand-500">Email</th>
              <th className="py-3 px-3 text-xs uppercase tracking-widest text-brand-500">Statut</th>
              <th className="py-3 px-3 text-xs uppercase tracking-widest text-brand-500">Source</th>
              <th className="py-3 px-3 text-xs uppercase tracking-widest text-brand-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-brand-50">
                <td className="py-2.5 px-3 text-sm">{s.email}</td>
                <td className="py-2.5 px-3 text-sm">{s.isActive ? "Actif" : "Inactif"}</td>
                <td className="py-2.5 px-3 text-sm text-brand-600">{s.source ?? "—"}</td>
                <td className="py-2.5 px-3 text-sm text-brand-600">
                  {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-brand-500 text-sm">
                  Aucun abonné pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {broadcasts.length > 0 && (
        <section className="admin-panel">
          <h2 className="admin-panel-title mb-4">Derniers envois</h2>
          <ul className="space-y-2 text-sm">
            {broadcasts.map((b) => (
              <li key={b.id} className="flex justify-between gap-4 border-b border-brand-50 py-2">
                <span>
                  {b.title}
                  {b.source ? (
                    <span className="text-brand-400 ml-2 text-xs uppercase">{b.source}</span>
                  ) : null}
                </span>
                <span className="text-brand-500 shrink-0">
                  {b.recipientCount} dest. — {new Date(b.sentAt).toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
