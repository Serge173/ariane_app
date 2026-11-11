"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Field } from "@/components/admin/content/FormFields";

type PersonalShoppingImageFieldProps = {
  imageUrl: string;
  imageAlt: string;
  onImageUrlChange: (url: string) => void;
  onImageAltChange: (alt: string) => void;
  onDimensionsChange: (width: number, height: number) => void;
  disabled?: boolean;
};

function probeImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Impossible de lire les dimensions"));
    img.src = url;
  });
}

export function PersonalShoppingImageField({
  imageUrl,
  imageAlt,
  onImageUrlChange,
  onImageAltChange,
  onDimensionsChange,
  disabled,
}: PersonalShoppingImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const applyUrl = async (url: string) => {
    onImageUrlChange(url);
    try {
      const { width, height } = await probeImageDimensions(url);
      if (width > 0 && height > 0) onDimensionsChange(width, height);
    } catch {
      /* garde les dimensions existantes */
    }
  };

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload/home-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload impossible");
      await applyUrl(data.url as string);
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
          Téléverser la bannière
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
        hint="Bannière pleine largeur après les forfaits. Recommandé : image large (ex. 2400×380 px), ratio paysage. Après modification d'URL, enregistrez puis rechargez l'aperçu si besoin."
      />
      <button
        type="button"
        disabled={disabled || !imageUrl.trim()}
        onClick={() => void applyUrl(imageUrl.trim())}
        className="text-[10px] uppercase tracking-widest text-brand-600 hover:text-brand-950 disabled:opacity-50"
      >
        Recalculer les dimensions (ratio)
      </button>
      <Field label="Texte alternatif" value={imageAlt} onChange={onImageAltChange} disabled={disabled} />
      {imageUrl.trim() ? (
        <div className="overflow-hidden border border-brand-100 bg-brand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt || "Aperçu bannière Personal Shopping"}
            className="block w-full h-auto"
          />
        </div>
      ) : null}
    </div>
  );
}
