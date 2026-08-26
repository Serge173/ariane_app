"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { UserRole } from "@prisma/client";
import { Loader2, Save } from "lucide-react";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import { formatRole } from "@/lib/user-roles";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

export interface AccountUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  avatar: string | null;
  createdAt: string;
}

interface AdminAccountFormProps {
  user: AccountUser;
}

export function AdminAccountForm({ user }: AdminAccountFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      showError("Les mots de passe ne correspondent pas", "Mot de passe");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      };

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour");

      showSuccess("Vos informations ont été mises à jour.", "Compte enregistré");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      await update({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
      });
      router.refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {FeedbackModal}
      <div className="bg-white border border-brand-100 p-6">
        <ProfilePhotoUpload
          avatar={user.avatar}
          firstName={form.firstName}
          lastName={form.lastName}
          uploadUrl={`/api/admin/users/${user.id}/avatar`}
          syncSession
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-100 p-6 space-y-6">
        <div>
          <h2 className="font-display text-lg mb-1">Informations du compte</h2>
          <p className="text-sm text-brand-500">
            Rôle actuel : <span className="text-brand-800">{formatRole(user.role)}</span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-brand-400">Prénom</span>
            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-brand-400">Nom</span>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-400">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-400">Téléphone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
              placeholder="+225..."
            />
          </label>
        </div>

        <div className="border-t border-brand-100 pt-6">
          <h3 className="font-display text-base mb-4">Changer le mot de passe</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-400">
                Mot de passe actuel
              </span>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
                autoComplete="current-password"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-brand-400">
                Nouveau mot de passe
              </span>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
                autoComplete="new-password"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-brand-400">
                Confirmer le mot de passe
              </span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
                autoComplete="new-password"
              />
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
