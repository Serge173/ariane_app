"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DURATION, EASE_COUTURE, EASE_EXIT, RISE_PX } from "@/lib/motion";
import type { OrientationPageSettings } from "@/lib/public-pages-settings";

function calculateRecommendation(
  questions: OrientationPageSettings["questions"],
  answers: Record<string, string>
): string {
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

const fadeVariants = (reduced: boolean | null) => ({
  initial: { opacity: 0, y: reduced ? 0 : 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0.15 : DURATION.short, ease: EASE_COUTURE },
  },
  exit: {
    opacity: 0,
    transition: { duration: reduced ? 0.15 : DURATION.short, ease: EASE_EXIT },
  },
});

function OrientationQuizPopup({
  ariaLabel,
  children,
}: {
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="orientation-quiz-scene">
      <div className="orientation-quiz-backdrop" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="orientation-quiz-panel"
      >
        <Link href="/offres" className="orientation-quiz-close" aria-label="Fermer">
          <X className="w-5 h-5" strokeWidth={1.5} />
        </Link>
        {children}
      </div>
    </div>
  );
}

export function OrientationQuiz({ settings }: { settings: OrientationPageSettings }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const { questions, recommendations } = settings;

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 240);
    } else {
      setResult(calculateRecommendation(questions, newAnswers));
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
      <OrientationQuizPopup ariaLabel={settings.resultOverline}>
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : RISE_PX }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: reduced ? 0.15 : DURATION.medium,
              ease: EASE_COUTURE,
            },
          }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-brand-950 text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8" />
          </div>
          <p className="text-overline mb-4">{settings.resultOverline}</p>
          <h1 className="heading-section mb-4">{rec.name}</h1>
          <p className="text-brand-600 mb-2">{rec.description}</p>
          <p className="text-lg font-medium mb-10">{rec.price}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {result === "sur-mesure" ? (
              <Link href="/contact?type=diagnostic" className="btn-primary inline-flex items-center gap-2">
                {settings.ctaDiagnostic}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href={`/offres/${rec.slug}`} className="btn-primary inline-flex items-center gap-2">
                {settings.ctaChoosePrefix} {rec.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link href="/offres" className="btn-secondary">
              {settings.ctaAllOffers}
            </Link>
          </div>
        </motion.div>
      </OrientationQuizPopup>
    );
  }

  return (
    <OrientationQuizPopup ariaLabel={settings.title}>
      <div className="orientation-quiz-head">
        <p className="text-overline mb-4">{settings.overline}</p>
        <h1 id="orientation-quiz-title" className="heading-section mb-4">
          {settings.title}
        </h1>
        <p className="text-brand-600">
          {step + 1} sur {questions.length} — {settings.progressHint}
        </p>
      </div>

      <div className="orientation-quiz-progress">
        <div className="orientation-quiz-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} {...fadeVariants(reduced)}>
          <h2 className="font-display text-2xl mb-8">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className={`orientation-quiz-option ${
                  answers[currentQuestion.id] === option.value ? "orientation-quiz-option--selected" : ""
                }`}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button type="button" onClick={handleBack} className="mt-8 btn-ghost inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      )}
    </OrientationQuizPopup>
  );
}
