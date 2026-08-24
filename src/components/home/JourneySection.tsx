const steps = [
  { number: "01", title: "Découvrir", description: "Explorez nos accompagnements et notre univers premium" },
  { number: "02", title: "S'orienter", description: "Répondez au questionnaire pour trouver votre formule idéale" },
  { number: "03", title: "Réserver", description: "Choisissez votre créneau et finalisez votre réservation" },
  { number: "04", title: "Payer", description: "Réglez en toute sécurité via Mobile Money ou carte bancaire" },
  { number: "05", title: "Coaching", description: "Vivez votre séance et recevez vos livrables personnalisés" },
  { number: "06", title: "Suivre", description: "Accédez à votre espace image pour poursuivre votre parcours" },
];

export function JourneySection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container-premium">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-overline mb-4">Votre parcours</p>
          <h2 className="heading-section mb-6">De la découverte à la transformation</h2>
          <p className="text-brand-600 leading-relaxed">
            Un parcours fluide et premium, pensé pour vous accompagner à chaque étape
            de votre évolution image.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative pl-16 opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              <span className="absolute left-0 top-0 font-display text-5xl font-light text-brand-200">
                {step.number}
              </span>
              <h3 className="font-display text-xl mb-3">{step.title}</h3>
              <p className="text-sm text-brand-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
