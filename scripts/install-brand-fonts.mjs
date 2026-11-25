/**
 * Copie / prépare les polices charte dans public/fonts/.
 * Sources : dossier brand-kit/fonts/ (fichiers achetés ou essais officiels).
 *
 * Usage : node scripts/install-brand-fonts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const kitDir = path.join(root, "brand-kit", "fonts");
const targets = {
  atacama: path.join(root, "public", "fonts", "atacama", "Atacama-VAR.woff2"),
  hellixRegular: path.join(root, "public", "fonts", "hellix", "Hellix-Regular.woff2"),
  hellixMedium: path.join(root, "public", "fonts", "hellix", "Hellix-Medium.woff2"),
};

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function matchFile(files, patterns) {
  for (const file of files) {
    const base = path.basename(file);
    if (patterns.some((re) => re.test(base))) return file;
  }
  return null;
}

function copyTo(src, dest) {
  ensureDir(dest);
  fs.copyFileSync(src, dest);
  console.log(`OK  ${path.basename(dest)} ← ${src}`);
}

function tryWoff2FromOtf(otfPath, dest) {
  const py = spawnSync("py", ["-m", "fontTools", "ttLib", "woff2", "compress", otfPath, dest], {
    stdio: "inherit",
    shell: true,
  });
  if (py.status === 0) {
    console.log(`OK  ${path.basename(dest)} (converti depuis ${path.basename(otfPath)})`);
    return true;
  }
  const py3 = spawnSync("python", ["-m", "fontTools", "ttLib", "woff2", "compress", otfPath, dest], {
    stdio: "inherit",
    shell: true,
  });
  if (py3.status === 0) {
    console.log(`OK  ${path.basename(dest)} (converti depuis ${path.basename(otfPath)})`);
    return true;
  }
  return false;
}

function installOne(dest, woff2Patterns, otfPatterns) {
  const kitFiles = listFiles(kitDir);
  if (fs.existsSync(dest)) {
    console.log(`—   ${path.basename(dest)} déjà présent`);
    return true;
  }

  const woff2 = matchFile(kitFiles, woff2Patterns);
  if (woff2) {
    copyTo(woff2, dest);
    return true;
  }

  const otf = matchFile(kitFiles, otfPatterns);
  if (otf) {
    ensureDir(dest);
    if (tryWoff2FromOtf(otf, dest)) return true;
    console.warn(`⚠   ${path.basename(otf)} trouvé mais conversion woff2 impossible (installez : py -m pip install fonttools brotli)`);
    return false;
  }

  console.warn(`✗   Manquant : ${path.relative(root, dest)}`);
  return false;
}

console.log("Installation des polices charte…\n");

if (!fs.existsSync(kitDir)) {
  fs.mkdirSync(kitDir, { recursive: true });
  console.log(`Créé : ${path.relative(root, kitDir)}`);
}

const ok =
  installOne(targets.atacama, [/atacama.*\.woff2$/i, /Atacama-?VAR/i], [/atacama.*\.otf$/i, /AtacamaTrial/i]) &&
  installOne(
    targets.hellixRegular,
    [/hellix.*regular.*\.woff2$/i, /Hellix-Regular\.woff2$/i],
    [/hellix.*regular.*\.otf$/i, /HellixTRIAL-Regular/i]
  ) &&
  installOne(
    targets.hellixMedium,
    [/hellix.*medium.*\.woff2$/i, /Hellix-Medium\.woff2$/i],
    [/hellix.*medium.*\.otf$/i, /HellixTRIAL-Medium/i]
  );

console.log("\n---");
if (!ok) {
  console.log(`Déposez vos fichiers dans : ${path.relative(root, kitDir)}`);
  console.log("Puis relancez : node scripts/install-brand-fonts.mjs");
  console.log("\nEssais officiels :");
  console.log("  Hellix   → https://displaay.net/trials (sélectionner Hellix)");
  console.log("  Atacama  → https://newglyph.com/fonts/atacama-var/ (essai / achat)");
  process.exit(1);
}

console.log("Polices prêtes pour le site.");
