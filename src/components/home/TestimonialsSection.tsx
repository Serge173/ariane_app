const testimonials = [
  {
    name: "Marie K.",
    role: "Directrice marketing",
    content: "Une transformation remarquable. Ariane a su comprendre mes enjeux professionnels et m'a guidée avec une expertise rare.",
    rating: 5,
  },
  {
    name: "Fatou D.",
    role: "Entrepreneure",
    content: "Le parcours Gold a dépassé mes attentes. Mon image reflète enfin qui je suis vraiment.",
    rating: 5,
  },
  {
    name: "Aminata B.",
    role: "Cadre supérieure",
    content: "Professionnalisme, écoute et résultats concrets. Je recommande vivement à toute femme ambitieuse.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-brand-950 text-white">
      <div className="container-premium">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-overline text-brand-400 mb-4">Témoignages</p>
          <h2 className="heading-section text-white mb-6">Ce qu&apos;elles en disent</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="border border-brand-800 p-8">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-accent-light">★</span>
                ))}
              </div>
              <p className="text-brand-200 leading-relaxed mb-8 italic">&ldquo;{t.content}&rdquo;</p>
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-brand-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
