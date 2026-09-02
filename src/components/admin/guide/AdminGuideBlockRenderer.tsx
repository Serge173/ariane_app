import Link from "next/link";
import { AlertTriangle, Info, ExternalLink } from "lucide-react";
import type { GuideBlock } from "@/lib/admin-guide-content";

export function AdminGuideBlockRenderer({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-sm text-brand-700 leading-relaxed">{block.text}</p>;

    case "h3":
      return (
        <h3 className="font-display text-lg text-brand-950 mt-8 first:mt-0 mb-3">{block.text}</h3>
      );

    case "h4":
      return <h4 className="font-medium text-sm text-brand-900 mt-6 mb-2">{block.text}</h4>;

    case "ul":
      return (
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-brand-700 leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="list-decimal pl-5 space-y-1.5 text-sm text-brand-700 leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );

    case "tip":
      return (
        <div className="flex gap-3 bg-brand-50 border border-brand-200 p-4 text-sm text-brand-700 leading-relaxed">
          <Info className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p>{block.text}</p>
        </div>
      );

    case "warn":
      return (
        <div className="flex gap-3 bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p>{block.text}</p>
        </div>
      );

    case "link":
      return (
        <Link
          href={block.href}
          className="flex items-start gap-3 p-4 border border-brand-200 bg-white hover:border-brand-950 transition-colors group"
        >
          <ExternalLink
            className="w-4 h-4 text-brand-400 group-hover:text-brand-950 flex-shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-sm font-medium text-brand-950 group-hover:underline">{block.label}</p>
            {block.description && (
              <p className="text-xs text-brand-500 mt-1">{block.description}</p>
            )}
          </div>
        </Link>
      );

    case "howto":
      return (
        <div className="border border-brand-200 bg-brand-50/50 p-5 sm:p-6 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-500 mb-2">Comment faire</p>
            <h4 className="font-display text-base text-brand-950">{block.title}</h4>
            <p className="text-sm text-brand-600 mt-2 leading-relaxed">{block.description}</p>
          </div>
          <ol className="space-y-3">
            {block.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-brand-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-950 text-white text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto border border-brand-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-100">
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 font-medium text-brand-600 text-xs uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-brand-50 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-3 px-4 text-brand-700 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}
