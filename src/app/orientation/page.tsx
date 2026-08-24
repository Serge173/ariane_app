"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionOption {
  value: string;
  label: string;
  score: Record<string, number>;
}

interface Question {
  id: string;
  question: string;
  type: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    id: "q1",
    question: "Quel est votre objectif principal ?",
    type: "single",
    options: [
      { value: "style", label: "Améliorer mon style au quotidien", score: { standard: 3, gold: 1 } },
      { value: "pro", label: "Renforcer mon image professionnelle", score: { gold: 2, platinum: 2 } },
      { value: "transformation", label: "Transformation complète de mon image", score: { platinum: 3, "sur-mesure": 1 } },
      { value: "special", label: "Événement ou projet spécifique", score: { gold: 1, "sur-mesure": 2 } },
    ],
  },
  {
    id: "q2",
    question: "Quel est votre niveau d'investissement souhaité ?",
    type: "single",
    options: [
      { value: "decouverte", label: "Découverte — je veux tester", score: { standard: 3 } },
      { value: "modere", label: "Investissement modéré", score: { gold: 3 } },
      { value: "premium", label: "Expérience premium complète", score: { platinum: 3 } },
      { value: "luxe", label: "Accompagnement luxe et exclusif", score: { "sur-mesure": 3 } },
    ],
  },
  {
    id: "q3",
    question: "Avez-vous déjà consulté un conseiller en image ?",
    type: "single",
    options: [
      { value: "non", label: "Non, c'est ma première fois", score: { standard: 2, gold: 1 } },
      { value: "oui_basique", label: "Oui, une expérience basique", score: { gold: 2, platinum: 1 } },
      { value: "oui_avance", label: "Oui, je cherche un niveau supérieur", score: { platinum: 2, "sur-mesure": 1 } },
    ],
  },
  {
    id: "q4",
    question: "Quel mode d'accompagnement préférez-vous ?",
    type: "single",
    options: [
      { value: "presentiel", label: "Présentiel à Abidjan", score: { standard: 1, gold: 1, platinum: 1 } },
      { value: "digital", label: "100% digital", score: { standard: 2, gold: 1 } },
      { value: "hybride", label: "Hybride (présentiel + digital)", score: { gold: 2, platinum: 2 } },
    ],
  },
  {
    id: "q5",
    question: "Êtes-vous intéressé(e) par le personal shopping luxe ?",
    type: "single",
    options: [
      { value: "oui", label: "Oui, c'est essentiel pour moi", score: { platinum: 2, "sur-mesure": 3 } },
      { value: "peut_etre", label: "Peut-être, selon les recommandations", score: { gold: 2, platinum: 1 } },
      { value: "non", label: "Non, pas pour le moment", score: { standard: 2, gold: 1 } },
    ],
  },
];

const recommendations: Record<string, { name: string; slug: string; description: string; price: string }> = {
  standard: {
    name: "Standard",
    slug: "standard",
    description: "Parfait pour une première approche du conseil en image",
    price: "60 000 FCFA",
  },
  gold: {
    name: "Gold",
    slug: "gold",
    description: "Idéal pour une transformation en profondeur",
    price: "150 000 FCFA",
  },
  platinum: {
    name: "Platinum",
    slug: "platinum",
    description: "L'excellence pour une refonte totale de votre image",
    price: "350 000 FCFA",
  },
  "sur-mesure": {
    name: "Sur-mesure",
    slug: "sur-mesure",
    description: "Un accompagnement entièrement personnalisé",
    price: "À partir de 500 000 FCFA",
  },
};

function calculateRecommendation(answers: Record<string, string>): string {
  const scores: Record<string, number> = {
    standard: 0,
    gold: 0,
    platinum: 0,
    "sur-mesure": 0,
  };

  questions.forEach((q) => {
    const answer = answers[q.id];
    const option = q.options.find((o) => o.value === answer);
    if (option) {
      Object.entries(option.score).forEach(([key, value]) => {
        scores[key] = (scores[key] || 0) + value;
      });
    }
  });

  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
}

export default function OrientationPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      const recommendation = calculateRecommendation(newAnswers);
      setResult(recommendation);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      setStep(questions.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  if (result) {
    const rec = recommendations[result];
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container-premium max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-brand-950 text-white rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-overline mb-4">Votre recommandation</p>
            <h1 className="heading-section mb-4">{rec.name}</h1>
            <p className="text-brand-600 mb-2">{rec.description}</p>
            <p className="text-lg font-medium mb-10">{rec.price}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {result === "sur-mesure" ? (
                <Link href="/contact?type=diagnostic" className="btn-primary inline-flex items-center gap-2">
                  Demander mon diagnostic
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link href={`/offres/${rec.slug}`} className="btn-primary inline-flex items-center gap-2">
                  Choisir {rec.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link href="/offres" className="btn-secondary">
                Voir toutes les offres
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-2xl">
        <div className="mb-12">
          <p className="text-overline mb-4">Questionnaire d&apos;orientation</p>
          <h1 className="heading-section mb-4">Trouver mon accompagnement</h1>
          <p className="text-brand-600">
            {step + 1} sur {questions.length} — Répondez librement, il n&apos;y a pas de mauvaise réponse.
          </p>
        </div>

        <div className="h-1 bg-brand-100 mb-12">
          <div
            className="h-full bg-brand-950 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-display text-2xl mb-8">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-5 border transition-all duration-300 ${
                    answers[currentQuestion.id] === option.value
                      ? "border-brand-950 bg-brand-50"
                      : "border-brand-200 hover:border-brand-400 hover:bg-brand-50/50"
                  }`}
                >
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {step > 0 && (
          <button onClick={handleBack} className="mt-8 btn-ghost inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        )}
      </div>
    </div>
  );
}
