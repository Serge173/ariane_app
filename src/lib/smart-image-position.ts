/**
 * Calcule un object-position CSS pour remplir le cadre (object-cover)
 * sans étirer l'image — cadrage adapté au ratio image vs écran.
 */
export function computeSmartObjectPosition(
  imageWidth: number,
  imageHeight: number,
  frameWidth: number,
  frameHeight: number
): string {
  if (imageWidth <= 0 || imageHeight <= 0 || frameWidth <= 0 || frameHeight <= 0) {
    return "50% 50%";
  }

  const imgRatio = imageWidth / imageHeight;
  const frameRatio = frameWidth / frameHeight;
  const relative = imgRatio / frameRatio;

  // Portrait / très vertical dans un hero paysage (mobile, photo personne)
  if (relative < 0.82) {
    return "50% 22%";
  }
  if (relative < 0.95) {
    return "50% 32%";
  }

  // Panorama plus large que l'écran
  if (relative > 1.35) {
    return "50% 50%";
  }
  if (relative > 1.08) {
    return "42% 50%";
  }

  // Ratios proches : léger bias haut pour mode / portrait
  return "50% 40%";
}

