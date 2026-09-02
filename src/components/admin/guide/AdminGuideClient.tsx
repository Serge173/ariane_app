"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminGuideSections, type GuideSection } from "@/lib/admin-guide-content";
import { AdminGuideBlockRenderer } from "./AdminGuideBlockRenderer";

function sectionMatchesQuery(section: GuideSection, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    section.title,
    section.summary,
    ...section.blocks.flatMap((b) => {
      if (b.type === "p" || b.type === "h3" || b.type === "h4" || b.type === "tip" || b.type === "warn") {
        return [b.text];
      }
      if (b.type === "howto") return [b.title, b.description, ...b.steps];
      if (b.type === "ul" || b.type === "ol") return b.items;
      if (b.type === "link") return [b.label, b.description ?? ""];
      if (b.type === "table") return [...b.headers, ...b.rows.flat()];
      return [];
    }),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function AdminGuideClient() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(adminGuideSections[0]?.id ?? "");

  const filteredSections = useMemo(
    () => adminGuideSections.filter((s) => sectionMatchesQuery(s, query)),
    [query]
  );

  useEffect(() => {
    if (filteredSections.length === 0) return;
    if (!filteredSections.some((s) => s.id === activeId)) {
      setActiveId(filteredSections[0].id);
    }
  }, [filteredSections, activeId]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && adminGuideSections.some((s) => s.id === hash)) {
      setActiveId(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <aside className="lg:w-64 flex-shrink-0">
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400"
              strokeWidth={1.5}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans le guide…"
              className="w-full pl-10 pr-3 py-2.5 border border-brand-200 text-sm bg-white focus:outline-none focus:border-brand-950"
            />
          </div>

          <nav className="bg-white border border-brand-100 max-h-[60vh] lg:max-h-[calc(100vh-12rem)] overflow-y-auto">
            {filteredSections.length === 0 ? (
              <p className="p-4 text-sm text-brand-400">Aucun résultat</p>
            ) : (
              filteredSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-brand-50 last:border-0 transition-colors",
                    activeId === section.id
                      ? "bg-brand-950 text-white"
                      : "text-brand-700 hover:bg-brand-50"
                  )}
                >
                  <p className="text-sm font-medium">{section.title}</p>
                  <p
                    className={cn(
                      "text-xs mt-0.5 line-clamp-2",
                      activeId === section.id ? "text-brand-200" : "text-brand-400"
                    )}
                  >
                    {section.summary}
                  </p>
                </button>
              ))
            )}
          </nav>

          <p className="text-xs text-brand-400 hidden lg:block">
            {adminGuideSections.length} chapitres · {filteredSections.length} affiché
            {filteredSections.length > 1 ? "s" : ""}
          </p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 space-y-16">
        {filteredSections.length === 0 ? (
          <div className="bg-white border border-brand-100 p-12 text-center">
            <p className="text-brand-500">Aucune section ne correspond à votre recherche.</p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 bg-white border border-brand-100 p-6 sm:p-8"
            >
              <header className="mb-6 pb-4 border-b border-brand-100">
                <h2 className="font-display text-2xl text-brand-950 mb-2">{section.title}</h2>
                <p className="text-sm text-brand-500">{section.summary}</p>
              </header>
              <div className="space-y-4">
                {section.blocks.map((block, i) => (
                  <AdminGuideBlockRenderer key={`${section.id}-${i}`} block={block} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
