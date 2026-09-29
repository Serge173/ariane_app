"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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
}

export function NewsletterAdminPanel({
  subscribers,
  broadcasts,
}: {
  subscribers: SubscriberRow[];
  broadcasts: BroadcastRow[];
}) {
  const [form, setForm] = useState({
    title: "",
    intro: "",
    youtubeUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    instagramUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

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
      setForm({ title: "", intro: "", youtubeUrl: "", facebookUrl: "", tiktokUrl: "", instagramUrl: "" });
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Envoi impossible");
    } finally {
      setLoading(false);
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
        <h2 className="admin-panel-title mb-1">Envoyer une actu réseaux</h2>
        <p className="text-sm text-brand-600 mb-6">
          Envoie une actu par email à tous les abonnés actifs (inscription immédiate depuis le popup ou le footer du site, avec email de bienvenue automatique).
          Les clients qui ont un compte avec la même adresse reçoivent aussi une notification dans Mon espace.
        </p>
        <form onSubmit={send} className="space-y-4 max-w-2xl">
          <div>
            <label className="label-field">Titre de l&apos;email *</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex. : Nouvelle vidéo YouTube — 3 erreurs d'image à éviter"
              required
            />
          </div>
          <div>
            <label className="label-field">Message (optionnel)</label>
            <textarea
              className="input-field min-h-[100px]"
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Lien YouTube</label>
              <input className="input-field" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Lien Facebook</label>
              <input className="input-field" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Lien TikTok</label>
              <input className="input-field" value={form.tiktokUrl} onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Lien Instagram</label>
              <input className="input-field" value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
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
                <span>{b.title}</span>
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
