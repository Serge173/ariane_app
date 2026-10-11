"use client";

import { Plus } from "lucide-react";
import type { DiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";
import type { DiscoveryAnswers } from "@/lib/discovery-parcours-questions";

export type DiscoveryContactFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mode: "IN_PERSON" | "DIGITAL" | "HYBRID";
  objective: string;
};

interface DiscoveryParcoursFormProps {
  settings: DiscoveryParcoursSettings;
  contact: DiscoveryContactFields;
  onContactChange: (field: keyof DiscoveryContactFields, value: string) => void;
  answers: DiscoveryAnswers;
  onChange: (answers: DiscoveryAnswers) => void;
}

export function DiscoveryParcoursForm({
  settings,
  contact,
  onContactChange,
  answers,
  onChange,
}: DiscoveryParcoursFormProps) {
  const setLine = (questionId: string, index: number, value: string) => {
    const lines = [...(answers[questionId] ?? [])];
    lines[index] = value;
    onChange({ ...answers, [questionId]: lines });
  };

  const { header, questions } = settings;

  return (
    <div className="discovery-parcours">
      <header className="discovery-parcours-header text-center pb-8 mb-8">
        <h2 className="font-display text-xl sm:text-2xl tracking-wide uppercase">{header.title}</h2>
        <p className="mt-3 text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-700">
          {header.subtitle}
        </p>
        <p className="mt-2 text-xs text-brand-600">{header.contact}</p>
      </header>

      {settings.intro.trim() ? (
        <p className="text-sm text-brand-600 mb-8 leading-relaxed">{settings.intro}</p>
      ) : null}

      <section className="discovery-parcours-coords mb-12">
        <div className="discovery-parcours-coords-banner">
          <span>{settings.coordsBanner}</span>
        </div>
        <div className="discovery-parcours-coords-body space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="discovery-parcours-label">Nom *</label>
              <input
                className="discovery-parcours-field"
                value={contact.lastName}
                onChange={(e) => onContactChange("lastName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="discovery-parcours-label">Prénoms *</label>
              <input
                className="discovery-parcours-field"
                value={contact.firstName}
                onChange={(e) => onContactChange("firstName", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="discovery-parcours-label">Email *</label>
              <input
                type="email"
                className="discovery-parcours-field"
                value={contact.email}
                onChange={(e) => onContactChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="discovery-parcours-label">Contact / WhatsApp *</label>
              <input
                type="tel"
                className="discovery-parcours-field"
                value={contact.phone}
                onChange={(e) => onContactChange("phone", e.target.value)}
                placeholder="+225…"
                required
              />
            </div>
          </div>
          <div>
            <label className="discovery-parcours-label">Mode d&apos;accompagnement *</label>
            <select
              className="discovery-parcours-field"
              value={contact.mode}
              onChange={(e) => onContactChange("mode", e.target.value)}
            >
              <option value="IN_PERSON">Présentiel (Abidjan)</option>
              <option value="DIGITAL">100% Digital</option>
              <option value="HYBRID">Hybride</option>
            </select>
          </div>
        </div>
      </section>

      <div className="space-y-10">
        {questions.map((q) => {
          const lines = answers[q.id] ?? [""];
          return (
            <div key={q.id} className="discovery-parcours-block">
              <div className="discovery-parcours-block-head">
                <p className="discovery-parcours-question">{q.label}</p>
                {!q.large ? (
                  <span className="discovery-parcours-add discovery-parcours-add--decor" aria-hidden>
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                ) : null}
              </div>

              <div className={q.large ? "discovery-parcours-large" : "discovery-parcours-lines"}>
                {q.large ? (
                  <textarea
                    className="discovery-parcours-textarea"
                    value={lines[0] ?? ""}
                    onChange={(e) => setLine(q.id, 0, e.target.value)}
                    rows={6}
                    placeholder="Votre projection…"
                  />
                ) : (
                  lines.map((line, index) => (
                    <div key={`${q.id}-${index}`} className="discovery-parcours-line">
                      <span className="discovery-parcours-bullet" aria-hidden />
                      <input
                        type="text"
                        className="discovery-parcours-input"
                        value={line}
                        onChange={(e) => setLine(q.id, index, e.target.value)}
                        placeholder="Votre réponse…"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
