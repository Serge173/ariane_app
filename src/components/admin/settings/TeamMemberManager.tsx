"use client";

import { useState } from "react";
import type { UserRole } from "@prisma/client";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";
import {
  formatRole,
  rolesAssignableBy,
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
} from "@/lib/user-roles";
import type { AccountUser } from "./AdminAccountForm";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

interface TeamMemberManagerProps {
  initialMembers: AccountUser[];
  actorRole: UserRole;
  currentUserId: string;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "MANAGER_ORDERS" as UserRole,
};

export function TeamMemberManager({
  initialMembers,
  actorRole,
  currentUserId,
}: TeamMemberManagerProps) {
  const assignableRoles = rolesAssignableBy(actorRole);
  const [members, setMembers] = useState(initialMembers);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AccountUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showConfirm, FeedbackModal } = useFeedbackModal();

  const reset = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyForm, role: assignableRoles[0] ?? "MANAGER_ORDERS" });
  };

  const refresh = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, role: assignableRoles[0] ?? "MANAGER_ORDERS" });
    setShowForm(true);
  };

  const openEdit = (member: AccountUser) => {
    setEditing(member);
    setForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone ?? "",
      password: "",
      confirmPassword: "",
      role: member.role,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!editing) {
      if (form.password !== form.confirmPassword) {
        showError("Les mots de passe ne correspondent pas", "Mot de passe");
        setLoading(false);
        return;
      }
    } else if (form.password && form.password !== form.confirmPassword) {
      showError("Les mots de passe ne correspondent pas", "Mot de passe");
      setLoading(false);
      return;
    }

    try {
      if (editing) {
        const payload: Record<string, string> = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          role: form.role,
        };
        if (form.password) payload.password = form.password;

        const res = await fetch(`/api/admin/users/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour");

        await refresh();
        reset();
        showSuccess("Le compte a été mis à jour.", "Compte enregistré");
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur lors de la création");

        await refresh();
        reset();
        showSuccess("Le nouveau compte a été créé.", "Compte créé");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (member: AccountUser) => {
    if (member.id === currentUserId) return;

    showConfirm(
      `Voulez-vous supprimer le compte de ${member.firstName} ${member.lastName} ? Cette action est irréversible.`,
      async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/users/${member.id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression");
          await refresh();
          if (editing?.id === member.id) reset();
          showSuccess("Le compte a été supprimé.", "Compte supprimé");
        } catch (err) {
          showError(err instanceof Error ? err.message : "Erreur");
        } finally {
          setLoading(false);
        }
      },
      "Supprimer le compte"
    );
  };

  return (
    <div className="space-y-6">
      {FeedbackModal}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg">Équipe & rôles</h2>
          <p className="text-sm text-brand-500 mt-1">
            Créez des comptes administrateurs et assignez un rôle avec photo de profil.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau compte
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white border border-brand-100 p-5 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <ProfileAvatar
                src={member.avatar}
                firstName={member.firstName}
                lastName={member.lastName}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-950 truncate">
                  {member.firstName} {member.lastName}
                  {member.id === currentUserId && (
                    <span className="text-brand-400 font-normal"> (vous)</span>
                  )}
                </p>
                <p className="text-xs text-brand-500 truncate">{member.email}</p>
                <span className="inline-block mt-2 text-[10px] uppercase tracking-widest bg-brand-50 text-brand-700 px-2 py-1">
                  {formatRole(member.role)}
                </span>
              </div>
            </div>
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(member)}
                className="btn-secondary flex-1 text-xs py-2 inline-flex items-center justify-center gap-1"
              >
                <Pencil className="w-3.5 h-3.5" />
                Modifier
              </button>
              {member.id !== currentUserId && (
                <button
                  type="button"
                  onClick={() => handleDelete(member)}
                  disabled={loading}
                  className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs"
                  aria-label="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/50">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto border border-brand-100 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-brand-100">
              <h3 className="font-display text-lg">
                {editing ? "Modifier le compte" : "Créer un compte"}
              </h3>
              <button type="button" onClick={reset} aria-label="Fermer">
                <X className="w-5 h-5 text-brand-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {editing && (
                <ProfilePhotoUpload
                  avatar={editing.avatar}
                  firstName={form.firstName}
                  lastName={form.lastName}
                  uploadUrl={`/api/admin/users/${editing.id}/avatar`}
                  onUploaded={(url) =>
                    setEditing((prev) => (prev ? { ...prev, avatar: url.split("?")[0] } : prev))
                  }
                />
              )}

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
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-widest text-brand-400">Rôle</span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                    disabled={!!editing && editing.id === currentUserId}
                    className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm bg-white"
                  >
                    {assignableRoles.map((role) => (
                      <option key={role} value={role}>
                        {USER_ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-brand-500 mt-1.5">
                    {USER_ROLE_DESCRIPTIONS[form.role]}
                  </p>
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-widest text-brand-400">
                    {editing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                  </span>
                  <input
                    type="password"
                    required={!editing}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
                    minLength={8}
                    autoComplete="new-password"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-widest text-brand-400">
                    Confirmer le mot de passe
                  </span>
                  <input
                    type="password"
                    required={!editing || Boolean(form.password)}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="mt-1 w-full border border-brand-200 px-3 py-2.5 text-sm"
                    minLength={8}
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={reset} className="btn-secondary flex-1">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? "Enregistrer" : "Créer le compte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
