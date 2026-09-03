import type { LegalPageContentSettings } from "@/lib/public-pages-settings";

export function LegalPageContent({ content }: { content: LegalPageContentSettings }) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <h1 className="heading-section mb-8">{content.title}</h1>
        <div className="space-y-6 text-sm text-brand-600 leading-relaxed">
          {content.intro ? <p>{content.intro}</p> : null}
          {content.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-lg text-brand-950 mb-3">{section.title}</h2>
              <p className="whitespace-pre-line">{section.body}</p>
            </section>
          ))}
          {content.disclaimer ? (
            <p className="text-xs text-brand-400 italic pt-8">{content.disclaimer}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
