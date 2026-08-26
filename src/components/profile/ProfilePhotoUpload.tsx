"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Camera, Loader2 } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

interface ProfilePhotoUploadProps {
  avatar?: string | null;
  firstName: string;
  lastName: string;
  uploadUrl?: string;
  fieldName?: string;
  syncSession?: boolean;
  onUploaded?: (avatarUrl: string) => void;
}

export function ProfilePhotoUpload({
  avatar,
  firstName,
  lastName,
  uploadUrl = "/api/profile/avatar",
  fieldName = "avatar",
  syncSession = false,
  onUploaded,
}: ProfilePhotoUploadProps) {
  const router = useRouter();
  const { update } = useSession();
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatar || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Veuillez sélectionner une image (JPG, PNG, WebP).", "Format invalide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("L'image ne doit pas dépasser 5 Mo.", "Fichier trop volumineux");
      return;
    }

    setLoading(true);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");

      setPreview(data.avatar);
      onUploaded?.(data.avatar);

      if (syncSession) {
        await update({ image: data.avatar.split("?")[0] });
      }

      showSuccess("Votre photo de profil a été mise à jour.", "Photo enregistrée");
      router.refresh();
    } catch (err) {
      setPreview(avatar || null);
      showError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      {FeedbackModal}
      <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <ProfileAvatar src={preview} firstName={firstName} lastName={lastName} size="xl" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 rounded-full bg-brand-950/0 group-hover:bg-brand-950/40 flex items-center justify-center transition-all"
          aria-label="Changer la photo de profil"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin opacity-0 group-hover:opacity-100" />
          ) : (
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="text-center sm:text-left">
        <p className="font-display text-xl mb-1">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-brand-500 mb-3">Photo de profil</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="btn-secondary text-xs py-2 px-4"
        >
          {loading ? "Envoi en cours..." : "Changer la photo"}
        </button>
      </div>
    </div>
    </>
  );
}
