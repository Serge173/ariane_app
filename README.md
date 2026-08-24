# Conseil en Image avec Ariane

Plateforme premium de conseil en image — réservation, paiement, espace client et back-office.

## Stack technique

- **Frontend/Backend** : Next.js 15 (App Router) + TypeScript
- **Base de données** : PostgreSQL via [Neon](https://neon.tech)
- **ORM** : Prisma
- **Auth** : NextAuth.js
- **Paiement** : CinetPay (Mobile Money + Carte — Côte d'Ivoire)
- **Hébergement** : Vercel
- **Design** : Tailwind CSS, inspiration Polène Paris

## Parcours client

```
Prospect → Orientation → Prestation → Rendez-vous → Paiement → Coaching → Suivi → Fidélisation
```

## Fonctionnalités MVP

- Site vitrine premium (mobile-first)
- 4 offres : Standard, Gold, Platinum, Sur-mesure
- Questionnaire d'orientation avec recommandation
- Panier et réservation avec calendrier
- Paiement Mobile Money (Orange, MTN, Wave) + Carte
- Espace client « Mon Espace Image »
- Questionnaire pré-coaching
- Back-office admin complet
- Blog, FAQ, contact, WhatsApp
- Notifications (structure prête pour email/SMS)

## Installation locale

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Remplir DATABASE_URL (Neon), NEXTAUTH_SECRET, etc.

# 3. Initialiser la base de données
npm run db:push
npm run db:seed

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Compte admin (seed)

- **Email** : ariane@conseil-image.com
- **Mot de passe** : Admin2026!

## Déploiement Vercel + Neon

Guide complet : **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**

Résumé :

1. Créer une base **Neon** → copier `DATABASE_URL`
2. Importer `Serge173/ariane_app` sur [vercel.com/new](https://vercel.com/new)
3. Configurer les variables d'environnement (voir `DEPLOY_VERCEL.md`)
4. Lancer `npm run db:push` et `npm run db:seed` en local avec l'URL Neon
5. Deploy → tester `/admin/connexion`

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Accueil
│   ├── offres/               # Catalogue prestations
│   ├── orientation/          # Questionnaire d'orientation
│   ├── reservation/          # Réservation + paiement
│   ├── panier/               # Panier
│   ├── mon-espace/           # Espace client
│   ├── admin/                # Back-office
│   ├── connexion/            # Auth
│   ├── contact/              # Contact
│   ├── blog/                 # Blog
│   └── api/                  # API routes
├── components/
│   ├── home/                 # Composants accueil
│   ├── layout/               # Header, Footer
│   └── shop/                 # E-commerce
├── lib/
│   ├── prisma.ts             # Client Prisma
│   ├── auth.ts               # NextAuth config
│   ├── payments/             # CinetPay
│   └── store/                # Zustand (panier)
└── types/
prisma/
├── schema.prisma             # Schéma complet
└── seed.ts                   # Données initiales
```

## Paiement CinetPay

1. Créer un compte marchand sur [cinetpay.com](https://cinetpay.com)
2. Obtenir API Key et Site ID
3. Configurer l'URL de notification : `https://votre-domaine.com/api/payments/webhook`
4. Tester en sandbox avant production

## Prochaines étapes (V2)

- [ ] Multi-langue (anglais)
- [ ] Programme fidélité / parrainage
- [ ] Boutique produits physiques
- [ ] CRM avancé
- [ ] Intégration calendrier Google
- [ ] Visioconférence pour séances digitales
- [ ] Emails transactionnels (Resend)
- [ ] SMS/WhatsApp notifications (Twilio)

## Client

**Conseil en Image avec Ariane** — DAGO Stéphanie Ariane  
Abidjan, Côte d'Ivoire

## Prestataire

Consultant Keayeni Serge Pacôme
