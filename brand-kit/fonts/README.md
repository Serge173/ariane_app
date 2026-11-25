# Polices charte (à fournir par vous)

**Hellix** (Displaay) et **Atacama VAR** (newglyph) sont des polices **commerciales** : elles ne peuvent pas être téléchargées automatiquement dans le dépôt sans votre licence.

## 1. Obtenir les fichiers

| Police | Fournisseur | Lien |
|--------|-------------|------|
| **Hellix** Regular + Medium | Displaay | [Essais gratuits](https://displaay.net/trials) (cocher Hellix) ou [fiche Hellix](https://displaay.net/typeface/hellix/) |
| **Atacama VAR** | newglyph | [Atacama VAR](https://newglyph.com/fonts/atacama-var/) |

Après téléchargement (ZIP d’essai ou achat), décompressez ici ou dans un sous-dossier.

## 2. Installer dans le site

Placez les `.woff2` ou `.otf` dans ce dossier (`brand-kit/fonts/`), puis à la racine du projet :

```bash
node scripts/install-brand-fonts.mjs
```

Les fichiers sont copiés ou convertis vers `public/fonts/`.

## Noms reconnus (exemples)

- `Hellix-Regular.woff2`, `HellixTRIAL-Regular.otf`
- `Hellix-Medium.woff2`, `HellixTRIAL-Medium.otf`
- `Atacama-VAR.woff2`, `AtacamaTrialVAR.otf`

Conversion OTF → WOFF2 (optionnel) : `py -m pip install fonttools brotli`
