import { PublicPageIntro } from "@/components/layout/PublicPageShell";
import { CLIENT_SPACE_COPY } from "@/lib/client-space-copy";

type ClientPageIntroProps = {
  title: string;
  description?: string;
  align?: "center" | "left";
  showAccentRule?: boolean;
  className?: string;
  overline?: string;
};

export function ClientPageIntro({
  overline = CLIENT_SPACE_COPY.headerEyebrow,
  ...props
}: ClientPageIntroProps) {
  return <PublicPageIntro overline={overline} {...props} />;
}
