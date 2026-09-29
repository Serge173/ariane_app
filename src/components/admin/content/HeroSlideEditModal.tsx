"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Field } from "@/components/admin/content/FormFields";
import type { HeroSlideSettings } from "@/lib/homepage-settings";

export function HeroSlideEditModal({
  listPosition,
  listTotal,
  carouselPosition,
  carouselTotal,
  slide,
  pendingImageUrl,
  uploading,
  saving,
  onClose,
  onSave,
  onUpload,
}: {
  listPosition: number;
  listTotal: number;
  carouselPosition: number;
  carouselTotal: number;
  slide: HeroSlideSettings;
  pendingImageUrl?: string | null;
  uploading: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (updated: HeroSlideSettings, listPosition1Based: number) => void;
  onUpload: (file: File) => void;
}) {
  const [draft, setDraft] = useState(slide);
  const [position, setPosition] = useState(listPosition);

  useEffect(() => {
    setDraft(slide);
    setPosition(listPosition);
  }, [slide.id, listPosition, slide]);

  useEffect(() => {
    if (pendingImageUrl) {
      setDraft((d) => ({ ...d, image: pendingImageUrl }));
    }
  }, [pendingImageUrl]);

  const suspended = Boolean(draft.suspended);
  const carouselRank = suspended
    ? "Non diffusé (slide suspendu)"
    : `${carouselPosition} sur ${carouselTotal}`;

  const handleSave = () => {
    onSave(draft, position);
  };

  return (
    <div className="hero-slide-preview-backdrop" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hero-slide-edit-title"
        className="hero-slide-preview-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="hero-slide-preview-close"
          aria-label="Fermer"
          disabled={saving}
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <p className="hero-slide-preview-kicker">Modification</p>
        <h3 id="hero-slide-edit-title" className="hero-slide-preview-heading">
          Slide {listPosition}
        </h3>

        <div className="content-editor-fields space-y-2">
          <div>
            <label className="label-field">Position (liste admin)</label>
            <select
              className="input-field"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              disabled={saving}
            >
              {Array.from({ length: listTotal }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Slide {n} sur {listTotal}
                </option>
              ))}
            </select>
            <p className="text-xs text-brand-500 mt-1">
              Ordre à l&apos;écran (diaporama, si actif) : {carouselRank}
            </p>
          </div>

          <div>
            <span className="label-field">Statut</span>
            <div className="hero-slide-status-radios mt-1" role="radiogroup" aria-label="Statut du slide">
              <label className="hero-slide-status-radio hero-slide-status-radio--on">
                <input
                  type="radio"
                  name={`slide-edit-status-${slide.id}`}
                  checked={!suspended}
                  onChange={() => setDraft((d) => ({ ...d, suspended: false }))}
                  className="hero-slide-status-radio-input"
                  disabled={saving}
                />
                <span>Actif</span>
              </label>
              <label className="hero-slide-status-radio hero-slide-status-radio--off">
                <input
                  type="radio"
                  name={`slide-edit-status-${slide.id}`}
                  checked={suspended}
                  onChange={() => setDraft((d) => ({ ...d, suspended: true }))}
                  className="hero-slide-status-radio-input"
                  disabled={saving}
                />
                <span>Inactif</span>
              </label>
            </div>
          </div>

          <Field
            label="Surtitre"
            value={draft.overline}
            onChange={(v) => setDraft((d) => ({ ...d, overline: v }))}
            disabled={saving}
          />
          <Field
            label="Titre"
            value={draft.title}
            onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            disabled={saving}
          />
          <Field
            label="Description (texte alternatif)"
            value={draft.imageAlt}
            onChange={(v) => setDraft((d) => ({ ...d, imageAlt: v }))}
            disabled={saving}
          />
          <Field
            label="URL de l'image"
            value={draft.image}
            onChange={(v) => setDraft((d) => ({ ...d, image: v }))}
            disabled={saving}
          />
          <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wide text-brand-700 cursor-pointer">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Téléverser une image
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={saving || uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="hero-slide-preview-actions">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Enregistrer
          </button>
          <button type="button" onClick={onClose} disabled={saving} className="btn-secondary flex-1">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
