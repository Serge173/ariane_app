/**
 * Choisit le mode d'affichage hero : image entière (contain) ou remplissage (cover).
 * Évite de couper tête / pieds sur mobile et portraits.
 */
export type HeroImageFitMode = "cover" | "contain";

export function shouldUseHeroContainFit(
  imageWidth: number,
  imageHeight: number,
  frameWidth: number,
  frameHeight: number,
  isNarrowViewport: boolean
): boolean {
  if (imageWidth <= 0 || imageHeight <= 0 || frameWidth <= 0 || frameHeight <= 0) {
    return isNarrowViewport;
  }

  const imgRatio = imageWidth / imageHeight;
  const frameRatio = frameWidth / frameHeight;

  // Téléphone / tablette portrait : privilégier l'image entière
  if (isNarrowViewport) {
    return true;
  }

  // Photo plus haute que le cadre (portrait) → contain
  if (imgRatio < frameRatio * 0.92) {
    return true;
  }

  // Si object-cover rognerait beaucoup en hauteur, afficher tout le sujet
  const coverScale = Math.max(frameWidth / imageWidth, frameHeight / imageHeight);
  const scaledHeightAtCover = imageHeight * coverScale;
  const croppedVertical = scaledHeightAtCover - frameHeight;
  if (croppedVertical > frameHeight * 0.12) {
    return true;
  }

  const scaledWidthAtCover = imageWidth * coverScale;
  const croppedHorizontal = scaledWidthAtCover - frameWidth;
  if (croppedHorizontal > frameWidth * 0.12) {
    return true;
  }

  return false;
}
