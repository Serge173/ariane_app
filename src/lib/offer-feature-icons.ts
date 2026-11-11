import {
  Brain,
  Palette,
  Heart,
  ShoppingBag,
  ClipboardList,
  Crown,
  Gem,
  PersonStanding,
  type LucideIcon,
} from "lucide-react";
import { OfferHangerIcon } from "@/components/offres/OfferMaquetteIcons";

export type OfferFeatureIcon = LucideIcon | typeof OfferHangerIcon;

/** Ordre des 5 icônes sur la maquette Platinum. */
const MAQUETTE_SEQUENCE: OfferFeatureIcon[] = [
  Brain,
  Palette,
  PersonStanding,
  Heart,
  OfferHangerIcon,
];

export function pickOfferFeatureIcon(label: string, index: number): OfferFeatureIcon {
  const l = label.toLowerCase();

  if (l.includes("mindset") || l.includes("transition")) return Brain;
  if (l.includes("colorim") || l.includes("couleur")) return Palette;
  if (l.includes("morpho") || l.includes("silhouette")) return PersonStanding;
  if (l.includes("complex")) return Heart;
  if (l.includes("diagnostic") || l.includes("garde-robe") || l.includes("audit")) {
    return OfferHangerIcon;
  }
  if (l.includes("style")) return OfferHangerIcon;
  if (l.includes("shopping")) return ShoppingBag;
  if (l.includes("conseil") || l.includes("guide")) return ClipboardList;
  if (l.includes("premium") || l.includes("gold") || l.includes("platinum")) return Crown;

  return MAQUETTE_SEQUENCE[index % MAQUETTE_SEQUENCE.length] ?? Gem;
}
