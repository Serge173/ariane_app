"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { fetchSessionSafe } from "@/lib/auth-session";
import { BRAND_FULL_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function AdminConnexionPageClient({ hasBackground }: { hasBackground: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants incorrects");
        return;
      }

      const session = await fetchSessionSafe();
      const user = session?.user as { role?: string } | undefined;

      if (!isAdmin(user?.role)) {
        setError("Accès réservé aux administrateurs");
        await signOut({ redirect: false });
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "admin-connexion-page__content relative z-10 min-h-screen min-h-[100dvh] flex items-center justify-center p-4",
        hasBackground && "admin-connexion-page--with-bg"
      )}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6",
              hasBackground ? "bg-white/15 backdrop-blur-sm" : "bg-white/10"
            )}
          >
            <Shield className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl text-white mb-2 admin-connexion-page__title">Administration</h1>
          <p className="text-sm text-brand-400 admin-connexion-page__subtitle">
            Connexion réservée à l&apos;équipe {BRAND_FULL_NAME}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6 shadow-lg rounded-sm">
          <div>
            <label className="label-field">Email administrateur</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-field">Mot de passe</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Connexion..." : "Accéder au back-office"}
          </button>
        </form>

        <p className="text-center mt-6 admin-connexion-page__links text-brand-400">
          <Link href="/connexion" className="text-xs hover:text-brand-950 admin-connexion-page__link">
            ← Espace client
          </Link>
          {" · "}
          <Link href="/" className="text-xs hover:text-brand-950 admin-connexion-page__link">
            Site public
          </Link>
        </p>
      </div>
    </div>
  );
}