# Polices charte — Atacama & Hellix

**Installation automatique :** déposez les fichiers dans `brand-kit/fonts/` puis exécutez `node scripts/install-brand-fonts.mjs` (voir `brand-kit/fonts/README.md`).

Ou placez les fichiers **licenciés** directement aux emplacements suivants :

| Police | Fichier attendu |
|--------|-----------------|
| Atacama VAR | `atacama/Atacama-VAR.woff2` |
| Hellix Regular | `hellix/Hellix-Regular.woff2` |
| Hellix Medium | `hellix/Hellix-Medium.woff2` |

Convertissez les `.otf` / `.ttf` en **woff2** si besoin (ex. [fonttools](https://fonttools.readthedocs.io/), ou un outil en ligne fiable).

Tant que les fichiers sont absents, le site utilise les polices de secours définies dans `src/app/brand-fonts.css` (Cormorant / system-ui).
