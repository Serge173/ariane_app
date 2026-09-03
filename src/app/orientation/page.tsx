import { getPublicPagesSettings } from "@/lib/public-pages-settings";
import { OrientationQuiz } from "@/components/orientation/OrientationQuiz";

export default async function OrientationPage() {
  const settings = await getPublicPagesSettings();
  return <OrientationQuiz settings={settings.orientation} />;
}
