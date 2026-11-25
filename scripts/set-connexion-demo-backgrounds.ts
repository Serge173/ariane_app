/**
 * Applique les images de démo sur /connexion et /admin/connexion (site settings en base).
 * Usage : npx tsx scripts/set-connexion-demo-backgrounds.ts
 */
import {
  CONNEXION_DEMO_BACKGROUNDS,
  getSiteSettings,
  updateSiteSettings,
} from "../src/lib/site-settings";

async function main() {
  const before = await getSiteSettings();
  const next = await updateSiteSettings({
    connexion: {
      ...before.connexion,
      backgroundImage: before.connexion.backgroundImage.trim() || CONNEXION_DEMO_BACKGROUNDS.backgroundImage,
      backgroundImageAlt: before.connexion.backgroundImage.trim()
        ? before.connexion.backgroundImageAlt
        : CONNEXION_DEMO_BACKGROUNDS.backgroundImageAlt,
      adminBackgroundImage:
        before.connexion.adminBackgroundImage.trim() || CONNEXION_DEMO_BACKGROUNDS.adminBackgroundImage,
      adminBackgroundImageAlt: before.connexion.adminBackgroundImage.trim()
        ? before.connexion.adminBackgroundImageAlt
        : CONNEXION_DEMO_BACKGROUNDS.adminBackgroundImageAlt,
    },
  });
  console.log("Connexion fonds mis à jour :");
  console.log("  client:", next.connexion.backgroundImage.slice(0, 72) + "…");
  console.log("  admin:", next.connexion.adminBackgroundImage.slice(0, 72) + "…");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));