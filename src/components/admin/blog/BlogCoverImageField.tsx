"use client";

import { useRef, useState } from "react";
import { Link2, Upload, Loader2, X } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";

interface BlogCoverImageFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function BlogCoverImageField({ value, onChange }: BlogCoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Sélectionnez une image (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload/blog-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");

      onChange(data.url);
      setMode("url");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
            mode === "url" ? "border-brand-950 bg-brand-50" : "border-brand-200 hover:border-brand-400"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          Par lien
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
            mode === "upload" ? "border-brand-950 bg-brand-50" : "border-brand-200 hover:border-brand-400"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Par fichier
        </button>
      </div>

      {mode === "url" ? (
        <input
          className="input-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/... ou /uploads/blog/..."
        />
      ) : (
        <div className="border border-dashed border-brand-200 p-6 text-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary inline-flex items-center gap-2 text-xs"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Choisir une image
              </>
            )}
          </button>
          <p className="text-xs text-brand-400 mt-2">JPG, PNG, WebP ou GIF — max 5 Mo</p>
          {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
        </div>
      )}

      {value && (
        <div className="relative aspect-[16/9] max-w-md bg-brand-100 border border-brand-100 overflow-hidden">
          <ProductImage
            src={value}
            fallback={IMAGES.blogCover}
            alt="Aperçu couverture"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow"
            title="Supprimer l'image"
          >
            <X className="w-4 h-4 text-brand-600" />
          </button>
        </div>
      )}
    </div>
  );
}
