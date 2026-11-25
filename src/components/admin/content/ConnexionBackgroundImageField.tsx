"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Field } from "@/components/admin/content/FormFields";

type ConnexionBackgroundImageFieldProps = {
  imageUrl: string;
  imageAlt: string;
  onImageUrlChange: (url: string) => void;
  onImageAltChange: (alt: string) => void;
  disabled?: boolean;
  /** Chemin affiché dans l'aide (ex. /connexion). */
  pagePath?: string;
  previewAlt?: string;
};

export function ConnexionBackgroundImageField({
  imageUrl,
  imageAlt,
  onImageUrlChange,
  onImageAltChange,
  disabled,
  pagePath = "/connexion",
  previewAlt = "Aperçu fond connexion",
}: ConnexionBackgroundImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload/home-image", { method: "POST", body: fd });
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
      <p className="text-xs text-brand-500 leading-relaxed">
        Image plein écran derrière le formulaire sur <code className="text-brand-700">{pagePath}</code>. Recommandé :
        portrait ou paysage 1920×1080 minimum (JPEG/WebP).
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest border border-brand-200 hover:border-brand-400 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Téléverser l&apos;image de fond
        </button>
        {imageUrl && !disabled && (
          <button
            type="button"
            onClick={() => onImageUrlChange("")}
            className="inline-flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest border border-brand-200 text-brand-600 hover:border-brand-400"
          >
            Retirer l&apos;image
          </button>
        )}
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
      {imageUrl ? (
        <div className="relative w-full max-w-md aspect-[16/10] border border-brand-200 overflow-hidden rounded-lg">
          <ProductImage src={imageUrl} alt={imageAlt || previewAlt} fill fit="cover" sizes="400px" />
        </div>
      ) : null}
      <Field
        label="URL image (optionnel)"
        value={imageUrl}
        onChange={onImageUrlChange}
        disabled={disabled}
        hint="Ou collez une URL déjà hébergée."
      />
      <Field
        label="Texte alternatif"
        value={imageAlt}
        onChange={onImageAltChange}
        disabled={disabled}
      />
    </div>
  );
}