"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import type { SiteSettings, SiteNavLink, SiteSocialLink } from "@/lib/site-settings";

function Field({
  label,
  value,
  onChange,
  disabled,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="label-field">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className="input-field resize-y min-h-[4.5rem]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="input-field"
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-brand-100 p-6 space-y-5">
      <h2 className="font-display text-xl">{title}</h2>
      {children}
    </section>
  );
}

function NavLinksEditor({
  label,
  links,
  onChange,
  disabled,
}: {
  label: string;
  links: SiteNavLink[];
  onChange: (links: SiteNavLink[]) => void;
  disabled?: boolean;
}) {
  const update = (index: number, patch: Partial<SiteNavLink>) => {
    const next = [...links];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-brand-500">{label}</p>
      {links.map((link, index) => (
        <div key={index} className="grid sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-end border border-brand-100 p-3">
          <Field label="Libellé" value={link.name} onChange={(v) => update(index, { name: v })} disabled={disabled} />
          <Field label="URL" value={link.href} onChange={(v) => update(index, { href: v })} disabled={disabled} />
          <label className="flex items-center gap-2 text-xs text-brand-600 pb-2.5">
            <input
              type="checkbox"
              checked={!!link.highlight}
              onChange={(e) => update(index, { highlight: e.target.checked })}
              disabled={disabled}
            />
            Mise en avant
          </label>
          {disabled ? null : (
            <button
              type="button"
              onClick={() => onChange(links.filter((_, i) => i !== index))}
              className="p-2 text-brand-400 hover:text-red-600 pb-2.5"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {!disabled && (
        <button
          type="button"
          onClick={() => onChange([...links, { name: "Nouveau lien", href: "/" }])}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-brand-700"
        >
          <Plus className="w-4 h-4" /> Ajouter un lien
        </button>
      )}
    </div>
  );
}

function SocialLinksEditor({
  links,
  onChange,
  disabled,
}: {
  links: SiteSocialLink[];
  onChange: (links: SiteSocialLink[]) => void;
  disabled?: boolean;
}) {
  const update = (index: number, patch: Partial<SiteSocialLink>) => {
    const next = [...links];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-brand-500">Réseaux sociaux</p>
      {links.map((link, index) => (
        <div key={index} className="grid sm:grid-cols-3 gap-2 items-end border border-brand-100 p-3">
          <Field label="Plateforme" value={link.name} onChange={(v) => update(index, { name: v })} disabled={disabled} />
          <Field label="Libellé affiché" value={link.label} onChange={(v) => update(index, { label: v })} disabled={disabled} />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Field label="URL" value={link.href} onChange={(v) => update(index, { href: v })} disabled={disabled} />
            </div>
            {disabled ? null : (
              <button
                type="button"
                onClick={() => onChange(links.filter((_, i) => i !== index))}
                className="p-2 text-brand-400 hover:text-red-600 mb-0.5"
                aria-label="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
      {!disabled && (
        <button
          type="button"
          onClick={() => onChange([...links, { name: "Réseau", label: "Compte", href: "https://" }])}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-brand-700"
        >
          <Plus className="w-4 h-4" /> Ajouter un réseau
        </button>
      )}
    </div>
  );
}

export function SiteSettingsForm({
  initial,
  canEdit,
}: {
  initial: SiteSettings;
  canEdit: boolean;
}) {
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || "Enregistrement impossible");
        return;
      }
      setForm(data);
      showSuccess("Contenu du site mis à jour");
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
        <Section title="Marque">
          <Field label="Titre principal" value={form.brand.title} onChange={(v) => setForm((f) => ({ ...f, brand: { ...f.brand, title: v } }))} disabled={!canEdit} />
          <Field label="Sous-titre" value={form.brand.subtitle} onChange={(v) => setForm((f) => ({ ...f, brand: { ...f.brand, subtitle: v } }))} disabled={!canEdit} />
        </Section>

        <Section title="Navigation principale">
          <NavLinksEditor
            label="Liens du menu"
            links={form.nav}
            onChange={(nav) => setForm((f) => ({ ...f, nav }))}
            disabled={!canEdit}
          />
        </Section>

        <Section title="Pied de page">
          <Field label="Texte d'introduction" value={form.footer.description} onChange={(v) => setForm((f) => ({ ...f, footer: { ...f.footer, description: v } }))} disabled={!canEdit} multiline />
          <NavLinksEditor
            label="Navigation"
            links={form.footer.navigation}
            onChange={(navigation) => setForm((f) => ({ ...f, footer: { ...f.footer, navigation } }))}
            disabled={!canEdit}
          />
          <NavLinksEditor
            label="Informations légales"
            links={form.footer.legal}
            onChange={(legal) => setForm((f) => ({ ...f, footer: { ...f.footer, legal } }))}
            disabled={!canEdit}
          />
          <Field label="Adresse — ligne 1" value={form.footer.contact.line1} onChange={(v) => setForm((f) => ({ ...f, footer: { ...f.footer, contact: { ...f.footer.contact, line1: v } } }))} disabled={!canEdit} />
          <Field label="Adresse — ligne 2" value={form.footer.contact.line2} onChange={(v) => setForm((f) => ({ ...f, footer: { ...f.footer, contact: { ...f.footer.contact, line2: v } } }))} disabled={!canEdit} />
          <Field label="Téléphone" value={form.footer.contact.phone} onChange={(v) => setForm((f) => ({ ...f, footer: { ...f.footer, contact: { ...f.footer.contact, phone: v } } }))} disabled={!canEdit} />
          <Field label="Email" value={form.footer.contact.email} onChange={(v) => setForm((f) => ({ ...f, footer: { ...f.footer, contact: { ...f.footer.contact, email: v } } }))} disabled={!canEdit} />
          <SocialLinksEditor
            links={form.footer.social}
            onChange={(social) => setForm((f) => ({ ...f, footer: { ...f.footer, social } }))}
            disabled={!canEdit}
          />
        </Section>

        {canEdit && (
          <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Enregistrer navigation & footer
          </button>
        )}
      </form>
    </>
  );
}
