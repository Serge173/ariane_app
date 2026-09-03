"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getDashboardPath } from "@/lib/navigation";
import { fetchSessionSafe } from "@/lib/auth-session";
import { CLIENT_SPACE_COPY } from "@/lib/client-space-copy";

export default function ConnexionPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      const session = await fetchSessionSafe();
      const user = session?.user as { role?: string } | undefined;

      if (isAdmin(user?.role)) {
        router.push("/admin");
      } else {
        router.push(getDashboardPath(user?.role));
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center">
      <div className="container-premium max-w-md w-full">
        <div className="text-center mb-10">
          <p className="text-overline mb-3">Espace client</p>
          <h1 className="heading-section mb-2">
            {isRegister ? "Créer mon compte" : "Connexion client"}
          </h1>
          <p className="text-sm text-brand-600">
            {isRegister ? CLIENT_SPACE_COPY.connexionRegister : CLIENT_SPACE_COPY.connexionLogin}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Prénom</label>
                  <input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div>
                  <label className="label-field">Nom</label>
                  <input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label-field">Téléphone</label>
                <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+225..." />
              </div>
            </>
          )}

          <div>
            <label className="label-field">Email</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="label-field">Mot de passe</label>
            <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Chargement..." : isRegister ? "Créer mon compte client" : "Accéder à mon espace"}
          </button>
        </form>

        <p className="text-center text-sm text-brand-500 mt-8">
          {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }} className="text-brand-950 underline">
            {isRegister ? "Se connecter" : "Créer un compte"}
          </button>
        </p>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-brand-400 hover:text-brand-600">← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  );
}
