"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { HeroSlideSettings } from "@/lib/homepage-settings";

export function HeroSlidePreviewModal({
  slide,
  listPosition,
  listTotal,
  carouselPosition,
  carouselTotal,
  onClose,
  onModify,
  onStatusChange,
}: {
  slide: HeroSlideSettings;
  listPosition: number;
  listTotal: number;
  carouselPosition: number;
  carouselTotal: number;
  onClose: () => void;
  onModify?: () => void;
  onStatusChange?: (active: boolean) => void;
}) {
  const suspended = Boolean(slide.suspended);
  const carouselRank = suspended
    ? "Non diffusé (slide suspendu)"
    : `${carouselPosition} sur ${carouselTotal}`;
  const imageUrl = slide.image?.trim() || "";

  return (
    <div
      className="hero-slide-preview-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hero-slide-preview-title"
        className="hero-slide-preview-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="hero-slide-preview-close"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <p className="hero-slide-preview-kicker">Aperçu du slide</p>
        <h3 id="hero-slide-preview-title" className="hero-slide-preview-heading">
          Slide {listPosition}
        </h3>

        <dl className="hero-slide-preview-dl">
          <div>
            <dt>Position (liste admin)</dt>
            <dd>
              Slide {listPosition} sur {listTotal}
            </dd>
          </div>
          <div>
            <dt>Position à l&apos;écran (diaporama)</dt>
            <dd>{carouselRank}</dd>
          </div>
          <div>
            <dt>Statut</dt>
            <dd>
              {onStatusChange ? (
                <div className="hero-slide-status-radios" role="radiogroup" aria-label="Statut du slide">
                  <label className="hero-slide-status-radio hero-slide-status-radio--on">
                    <input
                      type="radio"
                      name={`slide-status-${slide.id}`}
                      checked={!suspended}
                      onChange={() => onStatusChange(true)}
                      className="hero-slide-status-radio-input"
                    />
                    <span>Actif</span>
                  </label>
                  <label className="hero-slide-status-radio hero-slide-status-radio--off">
                    <input
                      type="radio"
                      name={`slide-status-${slide.id}`}
                      checked={suspended}
                      onChange={() => onStatusChange(false)}
                      className="hero-slide-status-radio-input"
                    />
                    <span>Inactif</span>
                  </label>
                </div>
              ) : suspended ? (
                "Suspendu (masqué sur le site)"
              ) : (
                "Actif"
              )}
            </dd>
          </div>
          <div>
            <dt>Surtitre</dt>
            <dd>{slide.overline || "—"}</dd>
          </div>
          <div>
            <dt>Titre</dt>
            <dd className="font-bold text-black">{slide.title || "—"}</dd>
          </div>
          <div>
            <dt>Description (texte alternatif)</dt>
            <dd>{slide.imageAlt || "—"}</dd>
          </div>
          <div>
            <dt>URL de l&apos;image</dt>
            <dd className="break-all text-xs">{imageUrl || "—"}</dd>
          </div>
        </dl>

        <div className="hero-slide-preview-image-wrap">
          <p className="text-[10px] uppercase tracking-widest text-brand-500 mb-2">Image</p>
          {imageUrl ? (
            <div className="relative w-full aspect-[16/9] bg-brand-100 border border-brand-200 overflow-hidden">
              {isRemoteImageAllowed(imageUrl) ? (
                <Image
                  src={imageUrl}
                  alt={slide.imageAlt || slide.title || "Slide hero"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 560px"
                  unoptimized
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={slide.imageAlt || slide.title || "Slide hero"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          ) : (
            <p className="text-sm text-brand-500 italic">Aucune image renseignée</p>
          )}
        </div>

        <div className="hero-slide-preview-actions">
          {onModify && (
            <button type="button" onClick={onModify} className="btn-primary flex-1">
              Modifier
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={onModify ? "btn-secondary flex-1" : "btn-primary w-full"}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
