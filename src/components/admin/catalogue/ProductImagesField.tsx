"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { uploadAdminImage } from "@/lib/admin-image-upload-client";
import { IMAGES } from "@/lib/images";
import { MEDIA_FRAME_CLASS } from "@/lib/image-display";

const UPLOAD_ENDPOINT = "/api/admin/upload/product-image";

function parseImageLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function joinImageLines(urls: string[]): string {
  return urls.join("\n");
}

interface ProductImagesFieldProps {
  value: string;
  onChange: (text: string) => void;
}

export function ProductImagesField({ value, onChange }: ProductImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const urls = parseImageLines(value);

  const setUrls = (next: string[]) => {
    onChange(joinImageLines(next));
  };

  const removeAt = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError("");
    setUploading(true);
    const added: string[] = [];

    try {
      for (const file of list) {
        const { url } = await uploadAdminImage(UPLOAD_ENDPOINT, file);
        added.push(url);
      }
      setUrls([...urls, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
      if (added.length > 0) setUrls([...urls, ...added]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-950 bg-brand-50 hover:bg-brand-100 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          Téléverser des images
        </button>
        <span className="text-xs text-brand-500">JPG, PNG, WebP, GIF · max 5 Mo · plusieurs fichiers possibles</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length) void uploadFiles(files);
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {urls.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {urls.map((url, index) => (
            <li key={`${url}-${index}`} className="space-y-1">
              <div className={`relative aspect-[4/5] ${MEDIA_FRAME_CLASS} border border-brand-100`}>
                <ProductImage
                  src={url}
                  fallback={IMAGES.productFallback}
                  alt=""
                  fill
                  fit="contain"
                  sizes="120px"
                />
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute top-1 right-1 z-10 p-1 bg-white/90 hover:bg-white rounded-full shadow"
                  title="Retirer cette image"
                >
                  <X className="w-3.5 h-3.5 text-brand-600" />
                </button>
              </div>
              <p className="text-[10px] text-brand-500 truncate font-mono" title={url}>
                {index === 0 ? "Image principale · " : ""}
                {url}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-500 mb-2">
          URLs images (une par ligne, optionnel)
        </label>
        <textarea
          className="input-field min-h-[80px] font-mono text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… ou /uploads/products/…"
        />
        <p className="text-xs text-brand-400 mt-1">
          Vous pouvez combiner téléversement et liens. La première image est utilisée en vignette catalogue.
        </p>
      </div>
    </div>
  );
}
