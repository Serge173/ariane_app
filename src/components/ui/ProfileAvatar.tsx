import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

function getInitials(firstName?: string, lastName?: string, name?: string | null): string {
  if (firstName || lastName) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  }
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return parts[0]?.[0]?.toUpperCase() || "?";
  }
  return "?";
}

export function ProfileAvatar({
  src,
  firstName,
  lastName,
  name,
  size = "md",
  className,
}: ProfileAvatarProps) {
  const initials = getInitials(firstName, lastName, name);
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-brand-100 flex-shrink-0 ring-2 ring-brand-100",
          sizeClass,
          className
        )}
      >
        <Image
          src={src}
          alt="Photo de profil"
          fill
          className="object-cover"
          sizes={size === "xl" ? "96px" : size === "lg" ? "64px" : "40px"}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-brand-200 text-brand-700 font-medium flex items-center justify-center flex-shrink-0 ring-2 ring-brand-100",
        sizeClass,
        className
      )}
      aria-label="Photo de profil"
    >
      {initials}
    </div>
  );
}
