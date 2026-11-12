"use client";

import { JourneyStepImageField } from "@/components/admin/content/JourneyStepImageField";
import { Field } from "@/components/admin/content/FormFields";
import type { OffersAudienceHubCardSettings } from "@/lib/public-pages-settings";

export function OffersAudienceHubCardField({
  title,
  card,
  onChange,
  disabled,
}: {
  title: string;
  card: OffersAudienceHubCardSettings;
  onChange: (patch: Partial<OffersAudienceHubCardSettings>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3 border border-brand-100 p-4 bg-brand-50/40">
      <p className="text-[10px] uppercase tracking-widest text-brand-600">{title}</p>
      <JourneyStepImageField
        imageUrl={card.image}
        imageAlt={card.imageAlt}
        onImageUrlChange={(image) => onChange({ image })}
        onImageAltChange={(imageAlt) => onChange({ imageAlt })}
        disabled={disabled}
      />
      <Field label="Surtitre (petit libellé)" value={card.eyebrow} onChange={(eyebrow) => onChange({ eyebrow })} disabled={disabled} />
      <Field label="Titre du cadre" value={card.title} onChange={(title) => onChange({ title })} disabled={disabled} />
      <Field
        label="Description"
        value={card.description}
        onChange={(description) => onChange({ description })}
        disabled={disabled}
        multiline
      />
      <Field label="Bouton — texte" value={card.ctaLabel} onChange={(ctaLabel) => onChange({ ctaLabel })} disabled={disabled} />
    </div>
  );
}
