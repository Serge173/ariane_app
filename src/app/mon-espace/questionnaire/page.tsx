"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";

const questions = [
  { id: "pc1", question: "Décrivez votre style actuel en quelques mots", type: "text" },
  { id: "pc2", question: "Quelles couleurs portez-vous le plus souvent ?", type: "text" },
  { id: "pc3", question: "Quels sont vos objectifs pour cette séance ?", type: "textarea" },
  { id: "pc4", question: "Avez-vous des contraintes particulières (allergies, budget, etc.) ?", type: "textarea" },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/questionnaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "pre-coaching", answers }),
      });
      if (!res.ok) throw new Error("Erreur");
      showSuccess(
        "Merci ! Vos réponses nous aideront à personnaliser votre accompagnement.",
        "Questionnaire envoyé",
        () => setSubmitted(true)
      );
    } catch {
      showError("Vos réponses n'ont pas pu être enregistrées. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-2xl mb-4">Questionnaire envoyé</h2>
        <p className="text-brand-600 mb-8">Merci ! Vos réponses nous aideront à personnaliser votre accompagnement.</p>
        <Link href="/mon-espace" className="btn-primary">Retour au tableau de bord</Link>
      </div>
    );
  }

  return (
    <>
      {FeedbackModal}
      <div>
      <div className="mb-8">
        <h1 className="heading-section mb-2">Préparer mon coaching</h1>
        <p className="text-brand-600">Quelques questions pour personnaliser votre séance avec Ariane.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-100 p-8 space-y-8 max-w-2xl">
        {questions.map((q) => (
          <div key={q.id}>
            <label className="label-field">{q.question}</label>
            {q.type === "textarea" ? (
              <textarea className="input-field min-h-[120px]" value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
            ) : (
              <input className="input-field" value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
            )}
          </div>
        ))}
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer mes réponses"}
        </button>
      </form>
    </div>
    </>
  );
}
