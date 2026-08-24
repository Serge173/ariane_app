"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { isAdmin } from "@/lib/auth";

export default function AdminConnexionPage() {
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

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (!isAdmin(session?.user?.role)) {
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
    <div className="min-h-screen bg-brand-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl text-white mb-2">Administration</h1>
          <p className="text-sm text-brand-400">Connexion réservée à l&apos;équipe Conseil en Image</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-6">
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
          {error && <p className="text-sm text-red-600 bg-red-50 p-3">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Connexion..." : "Accéder au back-office"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/connexion" className="text-xs text-brand-400 hover:text-brand-200">
            ← Espace client
          </Link>
          {" · "}
          <Link href="/" className="text-xs text-brand-400 hover:text-brand-200">
            Site public
          </Link>
        </p>
      </div>
    </div>
  );
}
