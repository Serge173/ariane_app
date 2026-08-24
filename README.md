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

### 1. Créer la base Neon

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un projet PostgreSQL
3. Copier la connection string `DATABASE_URL`

### 2. Déployer sur Vercel

```bash
npm i -g vercel
vercel
```

Variables d'environnement à configurer dans Vercel :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Connection string Neon PostgreSQL |
| `NEXTAUTH_URL` | URL de production (ex: https://votre-domaine.vercel.app) |
| `NEXTAUTH_SECRET` | Secret aléatoire (`openssl rand -base64 32`) |
| `CINETPAY_API_KEY` | Clé API CinetPay |
| `CINETPAY_SITE_ID` | Site ID CinetPay |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | +2250749526194 |

### 3. Migrer la base en production

```bash
npm run db:push
npm run db:seed
```

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
