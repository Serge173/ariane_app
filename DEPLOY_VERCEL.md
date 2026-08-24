# Déploiement Vercel — Conseil en Image avec Ariane

Guide pas à pas pour mettre en ligne l'application sur [Vercel](https://vercel.com) avec une base PostgreSQL ([Neon](https://neon.tech) recommandé).

---

## 1. Base de données (Neon)

1. Créez un compte sur [neon.tech](https://neon.tech)
2. **New Project** → région proche (ex. `EU West`)
3. Copiez la connection string **pooled** (recommandée pour serverless) :
   ```
   postgresql://user:pass@ep-xxx.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```

4. Depuis votre machine locale, initialisez la base de production :

```powershell
cd "D:\conseil image ecommerce"

# Coller temporairement l'URL Neon dans .env ou en variable :
$env:DATABASE_URL="postgresql://..."

npm run db:push
npm run db:seed
```

> Le seed crée l'admin : `ariane@conseil-image.com` / `Admin2026!`

---

## 2. Importer le projet sur Vercel

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → `Serge173/ariane_app`
3. Framework détecté : **Next.js** (automatique)
4. **Ne modifiez pas** le build command : `npm run vercel-build` (défini dans `vercel.json`)

---

## 3. Variables d'environnement Vercel

Dans **Project → Settings → Environment Variables**, ajoutez :

| Variable | Production | Preview | Description |
|----------|:----------:|:-------:|-------------|
| `DATABASE_URL` | ✅ | ✅ | URL Neon PostgreSQL (pooled) |
| `NEXTAUTH_SECRET` | ✅ | ✅ | Secret aléatoire (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | ✅ | URL du site (voir ci-dessous) |
| `NEXT_PUBLIC_APP_URL` | ✅ | ✅ | Même URL que `NEXTAUTH_URL` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | ✅ | `+2250749526194` |
| `CINETPAY_API_KEY` | ✅ | ⬜ | Clé CinetPay (optionnel au début) |
| `CINETPAY_SITE_ID` | ✅ | ⬜ | Site ID CinetPay |
| `CINETPAY_NOTIFY_URL` | ✅ | ⬜ | `https://VOTRE-DOMAINE/api/payments/webhook` |
| `CINETPAY_RETURN_URL` | ✅ | ⬜ | `https://VOTRE-DOMAINE/reservation/confirmation` |

### URLs à utiliser

**Premier déploiement** (domaine Vercel) :
```
https://ariane-app.vercel.app
```
(Remplacez par le nom exact affiché après le 1er deploy)

**Avec domaine personnalisé** :
```
https://www.conseil-image-ariane.com
```

`NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` doivent être **identiques** et sans slash final.

---

## 4. Déployer

### Option A — Via GitHub (recommandé)

Chaque push sur `main` déclenche un déploiement automatique.

### Option B — Via CLI

```powershell
cd "D:\conseil image ecommerce"
npx vercel login
npx vercel link
npx vercel --prod
```

---

## 5. Après le premier déploiement

1. Ouvrez l'URL Vercel et testez :
   - Accueil, boutique, offres
   - Connexion admin : `/admin/connexion`
2. Mettez à jour `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` avec l'URL finale
3. **Redeploy** (Deployments → ⋯ → Redeploy) après changement des variables auth
4. Configurez CinetPay avec l'URL de webhook production

---

## 6. Domaine personnalisé (optionnel)

1. Vercel → **Settings → Domains**
2. Ajoutez votre domaine (ex. `conseil-image-ariane.com`)
3. Suivez les instructions DNS chez votre registrar
4. Mettez à jour `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL`
5. Redeploy

---

## 7. Limitations Vercel à connaître

| Fonctionnalité | Comportement sur Vercel |
|----------------|-------------------------|
| **Upload images blog / avatar** | Le disque est éphémère → préférez les **URLs d'image** dans l'admin blog, ou migrez vers [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| **Base de données** | Obligatoire (Neon / Vercel Postgres / Supabase) — pas de SQLite |
| **Seed** | À lancer **une fois** en local avec l'URL Neon, pas à chaque build |

---

## 8. Dépannage

| Problème | Solution |
|----------|----------|
| Build échoue sur Prisma | Vérifier que `DATABASE_URL` est définie ; `prisma generate` tourne via `postinstall` |
| Connexion admin boucle | `NEXTAUTH_URL` doit correspondre exactement à l'URL du navigateur |
| Erreur 500 sur les pages | Vérifier les logs Vercel → **Functions** ; tester la connexion Neon |
| Paiement ne s'ouvre pas | CinetPay non configuré → normal en dev ; ajouter les clés en production |

---

## Fichiers de config du projet

- `vercel.json` — build, région (`cdg1` = Paris, proche de la CI)
- `package.json` — script `vercel-build`, `postinstall: prisma generate`
- `.env.example` — liste complète des variables
