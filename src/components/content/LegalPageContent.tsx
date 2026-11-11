import type { LegalPageContentSettings } from "@/lib/public-pages-settings";
import { PublicPageIntro, PublicPageShell } from "@/components/layout/PublicPageShell";

export function LegalPageContent({ content }: { content: LegalPageContentSettings }) {
  return (
    <PublicPageShell width="narrow">
      <PublicPageIntro title={content.title} showAccentRule align="left" />
      <article className="public-card p-6 sm:p-8 space-y-8 text-sm sm:text-[15px] text-brand-600 leading-relaxed">
        {content.intro ? <p className="text-brand-700">{content.intro}</p> : null}
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-lg text-brand-950 mb-3">{section.title}</h2>
            <p className="whitespace-pre-line">{section.body}</p>
          </section>
        ))}
        {content.disclaimer ? (
          <p className="text-xs text-brand-500 italic pt-4 border-t border-brand-300/50">{content.disclaimer}</p>
        ) : null}
      </article>
    </PublicPageShell>
  );
}
