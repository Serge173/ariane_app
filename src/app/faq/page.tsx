import { Metadata } from "next";
import { getPublicPagesSettings } from "@/lib/public-pages-settings";

export const metadata: Metadata = { title: "FAQ" };

export default async function FAQPage() {
  const { faq } = await getPublicPagesSettings();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-premium max-w-3xl">
        <div className="text-center mb-16">
          <p className="text-overline mb-4">{faq.overline}</p>
          <h1 className="heading-section">{faq.title}</h1>
        </div>
        <div className="space-y-6">
          {faq.items.map((item) => (
            <div key={item.q} className="border-b border-brand-100 pb-6">
              <h3 className="font-display text-lg mb-3">{item.q}</h3>
              <p className="text-sm text-brand-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
