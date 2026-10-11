"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Upload, Loader2, X, Pencil } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";
import {
  type BlogPublicationLinks,
  PUBLICATION_LINK_LABELS,
  emptyPublicationLinks,
} from "@/lib/blog-publication-links";

interface BlogCoverImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  publicationLinks?: BlogPublicationLinks;
  onPublicationLinksChange?: (links: BlogPublicationLinks) => void;
}

type LinkDraft = BlogPublicationLinks & { coverUrl: string };

const LINK_KEYS = Object.keys(PUBLICATION_LINK_LABELS) as (keyof BlogPublicationLinks)[];

function countLinks(links: BlogPublicationLinks): number {
  return Object.values(links).filter((v) => v?.trim()).length;
}

export function BlogCoverImageField({
  value,
  onChange,
  publicationLinks = emptyPublicationLinks(),
  onPublicationLinksChange,
}: BlogCoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [draft, setDraft] = useState<LinkDraft>({ coverUrl: "", ...emptyPublicationLinks() });
  const [selectedNetwork, setSelectedNetwork] = useState<keyof BlogPublicationLinks | "">("");

  const openLinkModal = () => {
    setDraft({
      coverUrl: value,
      ...emptyPublicationLinks(),
      ...publicationLinks,
    });
    setSelectedNetwork("");
    setLinkModalOpen(true);
  };

  useEffect(() => {
    if (!linkModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLinkModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [linkModalOpen]);

  const applyLinkModal = () => {
    onChange(draft.coverUrl.trim());
    onPublicationLinksChange?.({
      facebookUrl: draft.facebookUrl?.trim(),
      youtubeUrl: draft.youtubeUrl?.trim(),
      tiktokUrl: draft.tiktokUrl?.trim(),
      instagramUrl: draft.instagramUrl?.trim(),
      whatsappUrl: draft.whatsappUrl?.trim(),
      twitterUrl: draft.twitterUrl?.trim(),
    });
    setLinkModalOpen(false);
  };

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
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const linkCount = countLinks(publicationLinks);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openLinkModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-950 bg-brand-50 hover:bg-brand-100 transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" />
          Par lien
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-200 hover:border-brand-400 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          Par fichier
        </button>
        {(value || linkCount > 0) && (
          <button
            type="button"
            onClick={openLinkModal}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs text-brand-600 hover:text-brand-950"
          >
            <Pencil className="w-3.5 h-3.5" />
            Modifier les liens
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleUpload}
        className="hidden"
      />

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

      {linkCount > 0 && (
        <ul className="text-xs text-brand-600 space-y-1 border border-brand-100 bg-brand-50/50 px-3 py-2">
          {(Object.keys(PUBLICATION_LINK_LABELS) as (keyof BlogPublicationLinks)[]).map((key) => {
            const url = publicationLinks[key]?.trim();
            if (!url) return null;
            return (
              <li key={key} className="truncate">
                <span className="font-medium text-brand-800">{PUBLICATION_LINK_LABELS[key]} : </span>
                {url}
              </li>
            );
          })}
        </ul>
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

      {!value && linkCount === 0 && (
        <p className="text-xs text-brand-400">Image et liens de publication — optionnels.</p>
      )}

      {linkModalOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
          onClick={() => setLinkModalOpen(false)}
        >
          <div className="absolute inset-0 bg-brand-950/45 backdrop-blur-[3px]" aria-hidden />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-link-modal-title"
            className="relative z-10 w-full max-w-lg max-h-[min(90svh,100%)] overflow-y-auto bg-white border-[3px] border-black p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLinkModalOpen(false)}
              className="absolute top-3 right-3 p-2 border-2 border-black bg-white hover:bg-brand-50"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <h3 id="blog-link-modal-title" className="font-display text-lg pr-10 mb-1">
              Image & publications
            </h3>
            <p className="text-sm text-brand-600 mb-6">
              Tous les champs sont optionnels. Image de couverture et liens de publication, un réseau à la
              fois.
            </p>

            <div className="space-y-4">
              <div>
                <label className="label-field">URL de l&apos;image de couverture</label>
                <input
                  className="input-field"
                  value={draft.coverUrl}
                  onChange={(e) => setDraft({ ...draft, coverUrl: e.target.value })}
                  placeholder="https://… ou /uploads/blog/…"
                  autoFocus
                />
              </div>

              <div className="pt-2 border-t-2 border-black/10">
                <label className="label-field" htmlFor="blog-publication-network">
                  Lien de publication
                </label>
                <select
                  id="blog-publication-network"
                  className="input-field"
                  value={selectedNetwork}
                  onChange={(e) =>
                    setSelectedNetwork(e.target.value as keyof BlogPublicationLinks | "")
                  }
                >
                  <option value="">— Choisir un réseau social —</option>
                  {LINK_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {PUBLICATION_LINK_LABELS[key]}
                      {draft[key]?.trim() ? " ✓" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selectedNetwork ? (
                <div>
                  <label className="label-field">
                    URL {PUBLICATION_LINK_LABELS[selectedNetwork]}
                  </label>
                  <input
                    className="input-field"
                    value={draft[selectedNetwork] ?? ""}
                    onChange={(e) => setDraft({ ...draft, [selectedNetwork]: e.target.value })}
                    placeholder="https://…"
                  />
                  {draft[selectedNetwork]?.trim() ? (
                    <button
                      type="button"
                      className="mt-2 text-xs text-brand-500 hover:text-red-600 underline"
                      onClick={() => setDraft({ ...draft, [selectedNetwork]: "" })}
                    >
                      Retirer ce lien
                    </button>
                  ) : null}
                </div>
              ) : null}

              {LINK_KEYS.some((key) => draft[key]?.trim()) ? (
                <div className="rounded-sm border border-brand-200 bg-brand-50/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-brand-500 mb-2">
                    Liens enregistrés dans cette fenêtre
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {LINK_KEYS.filter((key) => draft[key]?.trim()).map((key) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => setSelectedNetwork(key)}
                          className="text-xs px-2.5 py-1 border-2 border-black bg-white hover:bg-brand-50"
                        >
                          {PUBLICATION_LINK_LABELS[key]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <button type="button" onClick={applyLinkModal} className="btn-primary">
                Enregistrer
              </button>
              <button type="button" onClick={() => setLinkModalOpen(false)} className="btn-secondary">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
