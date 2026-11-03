"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";
import { Field } from "@/components/admin/content/FormFields";

type JourneyStepImageFieldProps = {
  imageUrl: string;
  imageAlt: string;
  onImageUrlChange: (url: string) => void;
  onImageAltChange: (alt: string) => void;
  disabled?: boolean;
};

export function JourneyStepImageField({
  imageUrl,
  imageAlt,
  onImageUrlChange,
  onImageAltChange,
  disabled,
}: JourneyStepImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload/journey-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload impossible");
      onImageUrlChange(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest border border-brand-200 hover:border-brand-400 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Téléverser l&apos;image
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Field
        label="Image — URL"
        value={imageUrl}
        onChange={onImageUrlChange}
        disabled={disabled}
        hint="Ou collez un lien Unsplash / Blob après upload."
      />
      <Field label="Texte alternatif image" value={imageAlt} onChange={onImageAltChange} disabled={disabled} />
      {imageUrl.trim() ? (
        <div className="relative aspect-[6/5] max-w-[200px] overflow-hidden border border-brand-100 bg-brand-50">
          <ProductImage src={imageUrl} alt={imageAlt || "Aperçu étape"} fill fit="cover" sizes="200px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      ) : null}
    </div>
  );
}
