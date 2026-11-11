import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PublicPageWidth = "narrow" | "default" | "wide" | "full";

const WIDTH: Record<PublicPageWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

export function PublicPageShell({
  children,
  className,
  width = "default",
  tone = "cream",
}: {
  children: ReactNode;
  className?: string;
  width?: PublicPageWidth;
  tone?: "cream" | "white";
}) {
  return (
    <div
      className={cn(
        "public-page min-h-screen pt-[4.75rem] sm:pt-24 pb-16 sm:pb-20",
        tone === "cream" ? "public-page--cream" : "public-page--white",
        className
      )}
    >
      <div className={cn("container-premium", WIDTH[width])}>{children}</div>
    </div>
  );
}

export function PublicPageIntro({
  overline,
  title,
  description,
  align = "center",
  showAccentRule = true,
  className,
}: {
  overline?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  showAccentRule?: boolean;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "public-page-intro mb-10 sm:mb-14",
        centered && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {overline ? <p className="text-overline text-accent mb-3 sm:mb-4">{overline}</p> : null}
      <h1 className={cn("heading-section", centered && "mx-auto")}>{title}</h1>
      {description ? (
        <p className={cn("public-page-desc mt-3 sm:mt-4", centered && "mx-auto max-w-xl")}>
          {description}
        </p>
      ) : null}
      {showAccentRule ? (
        <span
          className={cn("public-page-accent-rule", centered && "mx-auto")}
          aria-hidden
        />
      ) : null}
    </header>
  );
}
