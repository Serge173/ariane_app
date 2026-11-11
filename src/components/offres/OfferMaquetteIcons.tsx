import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };

/** Cintre — icône maquette (hero + diagnostic style). */
export function OfferHangerIcon({
  className,
  strokeWidth = 1.5,
  ...props
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 12 3Z" />
      <path d="M12 6.5V9" />
      <path d="M6.5 9h11" />
      <path d="M5 20h14" />
      <path d="M7.5 9 5.5 20" />
      <path d="M16.5 9 18.5 20" />
    </svg>
  );
}
