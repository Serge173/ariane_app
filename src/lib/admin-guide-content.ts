export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "warn"; text: string }
  | { type: "link"; href: string; label: string; description?: string }
  | { type: "howto"; title: string; description: string; steps: string[] }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

export interface GuideSection {
  id: string;
  title: string;
  summary: string;
  blocks: GuideBlock[];
}

export const adminGuideSections: GuideSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    summary: "Connexion, vue d'ensemble et organisation du back-office.",
    blocks: [
      {
        type: "p",
        text: "Ce guide décrit l'utilisation complète du back-office de la plateforme Conseil en Image avec Ariane. Il couvre chaque menu, chaque écran et les actions disponibles au quotidien.",
      },
      { type: "h3", text: "Accéder à l'administration" },
      {
        type: "ol",
        items: [
          "Ouvrez la page de connexion admin : /admin/connexion",
          "Saisissez l'email et le mot de passe d'un compte équipe (Administrateur, Super administrateur, etc.).",
          "Seuls les comptes avec un rôle admin peuvent accéder au back-office ; les clients sont redirigés vers leur espace personnel.",
        ],
      },
      { type: "h3", text: "Organisation générale" },
      {
        type: "p",
        text: "Le back-office est organisé autour d'un menu latéral fixe (ou tiroir sur mobile). Chaque section affiche un titre, un sous-titre explicatif, puis le contenu (tableaux, formulaires, statistiques). Certaines sections possèdent une sous-navigation horizontale (onglets) pour naviguer entre les sous-pages.",
      },
      {
        type: "tip",
        text: "Utilisez le lien « Voir le site » en haut à droite pour ouvrir la boutique publique dans un nouvel onglet et vérifier vos modifications.",
      },
      {
        type: "howto",
        title: "Se connecter au back-office",
        description:
          "Le back-office est l'espace réservé à l'équipe Ariane. Il permet de gérer la boutique, les commandes, le blog et les paramètres du site.",
        steps: [
          "Ouvrez votre navigateur et allez sur l'adresse /admin/connexion (ex. https://votre-site.com/admin/connexion).",
          "Saisissez l'adresse email de votre compte équipe.",
          "Saisissez votre mot de passe.",
          "Cliquez sur le bouton de connexion.",
          "Si les identifiants sont corrects et que votre compte a un rôle admin, vous arrivez sur le Tableau de bord.",
          "En cas d'erreur, vérifiez email/mot de passe ou contactez un administrateur pour réinitialiser votre accès.",
        ],
      },
    ],
  },
  {
    id: "tutoriels",
    title: "Tutoriels pas à pas",
    summary: "Les actions les plus courantes, expliquées étape par étape.",
    blocks: [
      {
        type: "p",
        text: "Cette section regroupe les procédures les plus utilisées. Chaque tutoriel indique clairement où cliquer, quoi remplir et comment vérifier que le résultat est correct sur le site public.",
      },
      {
        type: "howto",
        title: "Ajouter un article de luxe dans la boutique",
        description:
          "Un article LUXE est un produit vendu sur la page /boutique (sac, accessoire, parfum…). Une fois créé et activé, il apparaît dans le catalogue et peut être acheté en ligne.",
        steps: [
          "Menu latéral → Catalogue boutique → Produits (ou cliquez sur « Nouveau produit »).",
          "Cliquez sur le bouton « Nouveau produit » en haut à droite.",
          "Dans « Type », sélectionnez « Article de luxe (boutique) ».",
          "Remplissez le nom (ex. « Sac Cabas Cuir ») — le slug URL se génère automatiquement.",
          "Choisissez une catégorie LUXE existante, ou créez-en une d'abord dans Catégories.",
          "Sélectionnez une marque dans la liste, ou saisissez un nom de marque libre.",
          "Indiquez le prix en FCFA.",
          "Rédigez la description courte (visible sur les cartes produit) et la description complète (fiche détaillée).",
          "Dans « URLs images », collez une adresse d'image par ligne. La première image sera la photo principale.",
          "Cochez « Actif (visible) » pour publier le produit.",
          "Cliquez sur « Créer le produit ».",
          "Ouvrez /boutique dans un nouvel onglet pour vérifier que l'article s'affiche correctement.",
        ],
      },
      {
        type: "howto",
        title: "Modifier un produit existant",
        description:
          "Permet de corriger le prix, changer la photo, mettre à jour la description ou masquer temporairement un article sans le supprimer.",
        steps: [
          "Allez dans Catalogue boutique → Produits.",
          "Utilisez la barre de recherche ou les filtres (type, catégorie, marque) pour trouver le produit.",
          "Cliquez sur l'icône crayon (Modifier) sur la ligne du produit.",
          "Modifiez les champs souhaités dans le formulaire.",
          "Pour masquer le produit sans le supprimer, décochez « Actif (visible) ».",
          "Cliquez sur « Enregistrer ».",
          "Actualisez la page boutique pour contrôler le résultat.",
        ],
      },
      {
        type: "howto",
        title: "Supprimer ou désactiver un produit",
        description:
          "Désactiver cache le produit du site public tout en le conservant en base. Supprimer l'efface définitivement du catalogue.",
        steps: [
          "Allez dans Catalogue boutique → Produits.",
          "Repérez le produit concerné dans la liste.",
          "Pour le masquer : cliquez sur Modifier, décochez « Actif », enregistrez.",
          "Pour le supprimer : cliquez sur l'icône corbeille, confirmez la suppression dans la fenêtre qui s'ouvre.",
          "Attention : la suppression est définitive. Préférez la désactivation si vous pourriez remettre le produit en vente plus tard.",
        ],
      },
      {
        type: "howto",
        title: "Créer une catégorie boutique ou coaching",
        description:
          "Les catégories organisent le catalogue. Les catégories LUXE structurent la boutique ; les catégories SERVICE structurent les prestations coaching sur /offres.",
        steps: [
          "Allez dans Catalogue boutique → Catégories.",
          "Choisissez l'onglet « Boutique luxe » ou « Accompagnements » selon le type voulu.",
          "Cliquez sur « Nouvelle catégorie ».",
          "Saisissez le nom (ex. « Maroquinerie » ou « Colorimétrie »).",
          "Le slug se génère automatiquement — il sert dans l'URL de filtre (/boutique?category=…).",
          "Optionnel : choisissez une catégorie parente pour créer une sous-catégorie.",
          "Renseignez une description et un ordre d'affichage si nécessaire.",
          "Cochez « Active » et enregistrez.",
          "La catégorie est maintenant disponible lors de la création d'un produit.",
        ],
      },
      {
        type: "howto",
        title: "Ajouter une marque",
        description:
          "Les marques évitent de retaper « Maison Élégance » à chaque produit. Elles s'affichent sur les fiches et dans la section mise en avant de la boutique.",
        steps: [
          "Allez dans Catalogue boutique → Marques.",
          "Cliquez sur « Nouvelle marque ».",
          "Saisissez le nom de la marque.",
          "Enregistrez.",
          "Lors de la création d'un produit LUXE, sélectionnez cette marque dans le menu déroulant.",
        ],
      },
      {
        type: "howto",
        title: "Configurer la section « Les plus convoités » sur la boutique",
        description:
          "Cette section éditoriale met en avant 2 produits phares sur /boutique. Vous pouvez personnaliser le titre, le texte du bouton et choisir quels produits afficher.",
        steps: [
          "Assurez-vous d'avoir au moins un produit LUXE actif avec image et description courte.",
          "Allez dans Catalogue boutique → Page boutique.",
          "Modifiez le « Titre de la section » (ex. « Les plus convoités » ou « Nos coups de cœur »).",
          "Modifiez le « Texte du bouton » (ex. « Découvrir », « Voir le produit »).",
          "Pour le Produit 1 : laissez « Automatique » pour afficher les produits cochés « Mis en avant », ou sélectionnez un article précis.",
          "Pour le Produit 2 : sélectionnez un second article ou laissez « Aucun ».",
          "Cliquez sur « Enregistrer ».",
          "Ouvrez /boutique : l'image, la marque, le nom et la description viennent de chaque fiche produit — modifiez-les dans Produits si besoin.",
        ],
      },
      {
        type: "howto",
        title: "Créer une prestation coaching (accompagnement)",
        description:
          "Une prestation SERVICE est vendue sur /offres. Le client peut réserver un créneau après achat. Elle apparaît aussi dans Prestations & Produits → Accompagnements.",
        steps: [
          "Créez d'abord une catégorie SERVICE dans Catégories (onglet Accompagnements).",
          "Allez dans Catalogue boutique → Produits → Nouveau produit.",
          "Sélectionnez le type « Accompagnement coaching ».",
          "Remplissez nom, catégorie, prix et durée (ex. « 2 heures »).",
          "Rédigez les descriptions et ajoutez une image de couverture.",
          "Cochez « Actif » et enregistrez.",
          "Vérifiez sur /offres que la prestation s'affiche.",
          "Après une commande client, le rendez-vous apparaîtra dans Admin → Rendez-vous.",
        ],
      },
      {
        type: "howto",
        title: "Ajouter un mode de paiement (Mobile Money, carte…)",
        description:
          "Les modes de paiement déterminent ce que le client voit au moment de payer. Ils doivent être configurés après CinetPay dans les paramètres plateforme.",
        steps: [
          "Vérifiez que CinetPay est configuré dans Paramètres → Plateforme.",
          "Allez dans Paiements → Modes de paiement.",
          "Cliquez sur « Ajouter un mode ».",
          "Choisissez un modèle (ex. Orange Money, MTN, Carte bancaire) — cela pré-remplit le code et le canal API.",
          "Personnalisez le nom affiché, la description et les instructions pour le client.",
          "Uploadez un logo ou indiquez une URL d'image.",
          "Sélectionnez le contexte : Boutique, Prestations ou Les deux.",
          "Cochez « Actif » et définissez l'ordre d'affichage.",
          "Enregistrez et testez un achat réel ou de test.",
        ],
      },
      {
        type: "howto",
        title: "Configurer CinetPay pour accepter les paiements en ligne",
        description:
          "CinetPay est le prestataire de paiement. Sans cette configuration, les clients ne pourront pas finaliser leurs achats par Mobile Money ou carte.",
        steps: [
          "Connectez-vous à votre espace marchand CinetPay et récupérez votre Site ID et votre clé API.",
          "Dans l'admin, allez dans Paramètres → onglet Plateforme.",
          "Renseignez l'« URL publique » avec l'adresse exacte de votre site (https://…).",
          "Collez le « CinetPay Site ID ».",
          "Collez la « CinetPay clé API ».",
          "Indiquez l'« URL notification CinetPay » — en général https://votre-site.com/api/payments/cinetpay/notify (vérifiez avec votre développeur si besoin).",
          "Cliquez sur « Enregistrer ».",
          "Créez ou activez vos modes de paiement dans Paiements → Modes.",
          "Effectuez un achat test et vérifiez la transaction dans Paiements → Transactions.",
        ],
      },
      {
        type: "howto",
        title: "Consulter une commande et son statut",
        description:
          "La page Commandes liste tous les achats (boutique et prestations). Elle permet de suivre qui a commandé quoi, pour quel montant et à quel stade se trouve la commande.",
        steps: [
          "Menu latéral → Commandes.",
          "Parcourez le tableau du plus récent au plus ancien.",
          "Repérez la référence commande (numéro unique).",
          "Vérifiez le client : nom + photo si compte inscrit, ou email invité.",
          "Consultez le produit, le montant en FCFA et le statut (En attente, Payée, Expédiée…).",
          "Pour une prestation coaching, ouvrez Rendez-vous pour voir le créneau réservé.",
          "Pour le détail du paiement, consultez Paiements → Transactions.",
        ],
      },
      {
        type: "howto",
        title: "Lire et répondre à un message contact",
        description:
          "Les visiteurs envoient des messages via le formulaire Contact du site. Ils arrivent ici pour que vous puissiez les traiter.",
        steps: [
          "Menu latéral → Messages.",
          "Les messages non lus ont une bordure plus visible et sont comptés sur le Tableau de bord.",
          "Lisez le nom, l'email, le téléphone et le type de demande (contact général, entreprise, diagnostic).",
          "Lisez le contenu du message.",
          "Répondez via votre messagerie (Gmail, Outlook…) en utilisant l'email indiqué dans le message.",
          "L'adresse email affichée sur le site se modifie dans Paramètres → Plateforme → Email de contact.",
        ],
      },
      {
        type: "howto",
        title: "Créer et publier un article de blog",
        description:
          "Le blog alimente la page publique /blog. Vous pouvez préparer un article en brouillon avant de le rendre visible.",
        steps: [
          "Menu latéral → Blog → Articles (ou Blog → Tableau → Nouvel article).",
          "Cliquez sur « Nouvel article ».",
          "Saisissez le titre — le slug URL se génère automatiquement.",
          "Rédigez l'extrait (résumé court pour les cartes et le référencement).",
          "Rédigez le contenu complet de l'article.",
          "Ajoutez une image de couverture (upload ou URL).",
          "Indiquez l'auteur et des tags séparés par des virgules.",
          "Pour publier immédiatement, cochez « Publié ». Sinon laissez décoché pour enregistrer en brouillon.",
          "Cliquez sur « Créer l'article » ou « Enregistrer ».",
          "Vérifiez sur /blog que l'article apparaît (si publié).",
        ],
      },
      {
        type: "howto",
        title: "Ajouter un membre à l'équipe admin",
        description:
          "Réservé aux Administrateurs et Super administrateurs. Permet de donner accès au back-office à un collaborateur avec un rôle adapté à ses missions.",
        steps: [
          "Allez dans Paramètres → onglet Équipe.",
          "Cliquez sur « Ajouter un membre ».",
          "Remplissez prénom, nom, email et téléphone.",
          "Choisissez un rôle : Gestionnaire boutique (catalogue), Gestionnaire commandes (commandes/clients/RDV), Comptabilité (paiements), ou Administrateur.",
          "Définissez un mot de passe initial que vous communiquerez au collaborateur.",
          "Confirmez le mot de passe.",
          "Enregistrez.",
          "Le collaborateur pourra se connecter sur /admin/connexion avec son email et ce mot de passe.",
        ],
      },
      {
        type: "howto",
        title: "Changer son mot de passe admin",
        description:
          "Chaque membre de l'équipe peut modifier son propre mot de passe depuis son compte, sans passer par un administrateur.",
        steps: [
          "Allez dans Paramètres → onglet Mon compte.",
          "Descendez jusqu'à la section « Mot de passe ».",
          "Saisissez votre mot de passe actuel.",
          "Saisissez le nouveau mot de passe.",
          "Confirmez le nouveau mot de passe.",
          "Cliquez sur « Mettre à jour le mot de passe ».",
          "Lors de la prochaine connexion, utilisez le nouveau mot de passe.",
        ],
      },
      {
        type: "howto",
        title: "Consulter les statistiques de vente",
        description:
          "La page Statistiques donne une vue d'ensemble de la performance commerciale : chiffre d'affaires, conversion et produits les plus vendus.",
        steps: [
          "Menu latéral → Statistiques.",
          "Consultez le chiffre d'affaires total affiché en haut.",
          "Analysez la répartition des commandes par statut pour repérer les commandes en attente.",
          "Consultez le classement des produits les plus vendus.",
          "Utilisez ces données pour ajuster votre catalogue (mettre en avant les best-sellers, revoir les produits qui ne se vendent pas).",
        ],
      },
    ],
  },
  {
    id: "roles",
    title: "Rôles et droits",
    summary: "Qui peut faire quoi dans l'application admin.",
    blocks: [
      {
        type: "p",
        text: "Chaque membre de l'équipe a un rôle qui définit ce qu'il peut voir et modifier. Comprendre les rôles évite les erreurs et permet de donner le bon accès à chaque collaborateur.",
      },
      { type: "h3", text: "Rôles disponibles" },
      {
        type: "table",
        headers: ["Rôle", "Description", "Droits principaux"],
        rows: [
          [
            "Super administrateur",
            "Accès total",
            "Tout le back-office, gestion de l'équipe (tous les rôles), paramètres plateforme",
          ],
          [
            "Administrateur",
            "Accès complet",
            "Tout le back-office, gestion de l'équipe (sauf Super admin), paramètres plateforme",
          ],
          [
            "Gestionnaire boutique",
            "Catalogue",
            "Produits, catégories, marques, page boutique, contenu catalogue",
          ],
          [
            "Gestionnaire commandes",
            "Opérations",
            "Commandes, clients, rendez-vous, messages",
          ],
          [
            "Comptabilité",
            "Finances",
            "Consultation des paiements et transactions",
          ],
        ],
      },
      { type: "h3", text: "Modifications réservées aux administrateurs" },
      {
        type: "ul",
        items: [
          "Création, modification et suppression de membres de l'équipe (Paramètres → Équipe)",
          "Enregistrement des paramètres plateforme (URL, CinetPay, WhatsApp, email contact)",
          "Modification de la section « Page boutique » (titre, bouton, produits mis en avant)",
        ],
      },
      {
        type: "warn",
        text: "Si un bouton ou un champ est grisé, votre rôle ne dispose pas des droits d'écriture sur cette fonctionnalité. Contactez un Super administrateur ou un Administrateur.",
      },
      {
        type: "howto",
        title: "Savoir quel rôle attribuer à un collaborateur",
        description:
          "Le bon rôle limite les accès au strict nécessaire : un responsable logistique n'a pas besoin de modifier le blog, un rédacteur n'a pas besoin de voir les transactions.",
        steps: [
          "Catalogue uniquement → Gestionnaire boutique",
          "Commandes, clients, RDV, messages → Gestionnaire commandes",
          "Consultation des paiements sans modification → Comptabilité",
          "Accès quasi total + gestion équipe → Administrateur",
          "Accès total absolu → Super administrateur (réservé au responsable principal)",
        ],
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    summary: "Structure du menu latéral et sous-menus.",
    blocks: [
      {
        type: "p",
        text: "Le menu latéral gauche est votre principal outil de navigation. Chaque entrée correspond à une zone fonctionnelle du back-office. Les sections avec une flèche contiennent des sous-pages.",
      },
      { type: "h3", text: "Menu principal" },
      {
        type: "table",
        headers: ["Menu", "Route", "Contenu"],
        rows: [
          ["Tableau de bord", "/admin", "Vue d'ensemble et indicateurs clés"],
          ["Commandes", "/admin/commandes", "Liste de toutes les commandes"],
          ["Clients", "/admin/clients", "Comptes clients inscrits"],
          ["Rendez-vous", "/admin/rendez-vous", "RDV coaching à venir et historique"],
          ["Catalogue boutique", "/admin/catalogue", "Produits, catégories, marques, page boutique"],
          ["Prestations & Produits", "/admin/offres", "Vue synthétique coaching et luxe"],
          ["Paiements", "/admin/paiements", "Modes de paiement et transactions"],
          ["Messages", "/admin/messages", "Demandes reçues via le formulaire contact"],
          ["Avis clients", "/admin/avis", "Témoignages laissés par les clients"],
          ["Blog", "/admin/blog", "Articles du blog public"],
          ["Statistiques", "/admin/statistiques", "Chiffres et analyses"],
          ["Paramètres", "/admin/parametres", "Compte, équipe, configuration plateforme"],
          ["Guide", "/admin/guide", "Ce manuel d'utilisation"],
        ],
      },
      { type: "h3", text: "Sections avec sous-menu dépliable" },
      {
        type: "p",
        text: "Catalogue boutique, Prestations & Produits, Paiements et Blog possèdent un sous-menu. Cliquez sur la flèche pour développer, ou sur le nom de la section pour accéder au « Tableau » (page hub avec liens rapides).",
      },
      { type: "h3", text: "Sous-navigation horizontale" },
      {
        type: "ul",
        items: [
          "Catalogue : Tableau, Produits, Catégories, Marques, Page boutique",
          "Prestations : Tableau, Accompagnements coaching, Articles de luxe",
          "Paiements : Tableau, Modes de paiement, Transactions",
          "Blog : Tableau, Articles",
          "Paramètres : Mon compte, Équipe, Plateforme (onglets internes)",
        ],
      },
      {
        type: "tip",
        text: "Pour les procédures détaillées étape par étape, consultez le chapitre « Tutoriels pas à pas » dans ce guide.",
      },
    ],
  },
  {
    id: "tableau-de-bord",
    title: "Tableau de bord",
    summary: "Indicateurs, commandes récentes et rendez-vous.",
    blocks: [
      {
        type: "p",
        text: "Le Tableau de bord est votre page d'accueil après connexion. Il résume l'activité en un coup d'œil pour que vous sachiez immédiatement ce qui demande votre attention.",
      },
      {
        type: "link",
        href: "/admin",
        label: "Ouvrir le tableau de bord",
        description: "Page d'accueil du back-office après connexion.",
      },
      { type: "h3", text: "Cartes indicateurs" },
      {
        type: "p",
        text: "Cinq cartes cliquables résument l'activité : nombre total de commandes, chiffre d'affaires (hors annulations/remboursements), nombre de clients inscrits, rendez-vous à venir (planifiés ou confirmés), messages contact non lus.",
      },
      { type: "h3", text: "Commandes récentes" },
      {
        type: "p",
        text: "Affiche les 5 dernières commandes avec référence, client, montant et statut. Le lien « Voir tout » mène à la page Commandes.",
      },
      { type: "h3", text: "Prochains rendez-vous" },
      {
        type: "p",
        text: "Liste les rendez-vous coaching planifiés ou confirmés, avec date, horaire, prestation associée et mode (visio, présentiel, etc.).",
      },
      { type: "h3", text: "Actions rapides" },
      {
        type: "ul",
        items: [
          "Accès direct au catalogue produits",
          "Création d'un nouvel article de blog",
          "Consultation des messages",
          "Paramètres de la plateforme",
        ],
      },
      {
        type: "howto",
        title: "Utiliser le tableau de bord au quotidien",
        description:
          "Consultez cette page chaque matin pour repérer les nouvelles commandes, les messages non lus et les rendez-vous du jour.",
        steps: [
          "Connectez-vous : vous arrivez automatiquement sur le Tableau de bord.",
          "Regardez la carte « Messages non lus » : si le chiffre est > 0, cliquez pour ouvrir Messages.",
          "Regardez « RDV à venir » : cliquez pour voir le planning détaillé.",
          "Parcourez les 5 dernières commandes pour détecter des paiements en attente.",
          "Utilisez les actions rapides en bas pour accéder directement aux tâches fréquentes.",
        ],
      },
    ],
  },
  {
    id: "commandes",
    title: "Commandes",
    summary: "Suivi des achats boutique et prestations.",
    blocks: [
      {
        type: "p",
        text: "La page Commandes centralise tous les achats passés sur le site, qu'il s'agisse d'articles boutique ou de prestations coaching. C'est votre outil principal pour le suivi commercial et la relation client.",
      },
      {
        type: "link",
        href: "/admin/commandes",
        label: "Ouvrir les commandes",
      },
      { type: "h3", text: "Contenu de la liste" },
      {
        type: "p",
        text: "Le tableau affiche toutes les commandes, de la plus récente à la plus ancienne. Pour chaque commande vous voyez :",
      },
      {
        type: "ul",
        items: [
          "Référence (numéro de commande unique)",
          "Client (compte inscrit avec photo, ou email invité pour achat sans compte)",
          "Produit principal (premier article de la commande)",
          "Montant total en FCFA",
          "Statut (En attente, Payée, Expédiée, Livrée, Annulée, Remboursée…)",
          "Date de création",
        ],
      },
      { type: "h3", text: "Statuts possibles" },
      {
        type: "p",
        text: "Les statuts reflètent le cycle de vie de la commande, de la création au paiement puis à la livraison ou l'annulation. Consultez la page Statistiques pour une répartition par statut.",
      },
      {
        type: "tip",
        text: "Une commande peut être liée à un rendez-vous coaching (prestation SERVICE) ou à un article boutique (LUXE). Vérifiez la section Rendez-vous pour les prestations avec créneau.",
      },
      {
        type: "howto",
        title: "Comprendre le statut d'une commande",
        description:
          "Le statut indique où en est la commande dans son cycle de vie. Il se met à jour automatiquement lors du paiement et peut évoluer selon votre processus de livraison.",
        steps: [
          "En attente : la commande est créée mais le paiement n'est pas encore confirmé.",
          "Payée : le paiement a été reçu avec succès.",
          "Expédiée / Livrée : étapes de fulfillment pour les articles boutique (selon votre processus).",
          "Annulée / Remboursée : la commande a été annulée ou remboursée.",
          "Pour connaître le détail du paiement, croisez avec Paiements → Transactions en utilisant la référence commande.",
        ],
      },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    summary: "Liste des comptes clients inscrits.",
    blocks: [
      {
        type: "p",
        text: "Cette page liste tous les clients ayant créé un compte sur le site. Elle sert à identifier vos acheteurs récurrents et à retrouver leurs coordonnées.",
      },
      {
        type: "link",
        href: "/admin/clients",
        label: "Ouvrir les clients",
      },
      { type: "h3", text: "Informations affichées" },
      {
        type: "ul",
        items: [
          "Nom, prénom et photo de profil",
          "Email et téléphone",
          "Date d'inscription",
          "Nombre de commandes passées",
        ],
      },
      {
        type: "p",
        text: "Seuls les utilisateurs avec le rôle « Client » apparaissent ici. Les membres de l'équipe admin sont gérés dans Paramètres → Équipe.",
      },
      {
        type: "tip",
        text: "Les achats « invité » (sans création de compte) n'apparaissent pas dans Clients mais restent visibles dans Commandes avec l'email invité.",
      },
    ],
  },
  {
    id: "rendez-vous",
    title: "Rendez-vous",
    summary: "Planning coaching à venir et historique.",
    blocks: [
      {
        type: "p",
        text: "Les rendez-vous sont créés automatiquement quand un client achète une prestation coaching et choisit un créneau. Cette page est votre agenda pour préparer et suivre les séances.",
      },
      {
        type: "link",
        href: "/admin/rendez-vous",
        label: "Ouvrir les rendez-vous",
      },
      { type: "h3", text: "Organisation de la page" },
      {
        type: "p",
        text: "La page est divisée en deux blocs : « À venir » (statuts Planifié ou Confirmé) et « Historique » (terminés, annulés, etc.).",
      },
      { type: "h3", text: "Détail d'un rendez-vous" },
      {
        type: "ul",
        items: [
          "Client (compte ou invité via la commande)",
          "Date et créneau horaire (début – fin)",
          "Prestation commandée (nom du produit SERVICE)",
          "Mode de rendez-vous (visio, présentiel…)",
          "Statut actuel",
        ],
      },
      {
        type: "tip",
        text: "Les rendez-vous sont créés côté client lors du parcours d'achat d'une prestation coaching. Assurez-vous que vos produits SERVICE sont actifs et correctement configurés.",
      },
      {
        type: "howto",
        title: "Préparer un rendez-vous coaching",
        description:
          "Avant chaque séance, vérifiez les informations client et la prestation commandée depuis cette page.",
        steps: [
          "Ouvrez Admin → Rendez-vous.",
          "Dans « À venir », repérez le rendez-vous du jour.",
          "Notez le nom du client, son email (via Commandes ou Clients si besoin).",
          "Vérifiez la prestation commandée et le créneau horaire.",
          "Vérifiez le mode (visio ou présentiel) affiché sur la ligne du RDV.",
          "Après la séance, le statut passera dans « Historique » automatiquement ou manuellement selon le workflow.",
        ],
      },
    ],
  },
  {
    id: "catalogue",
    title: "Catalogue boutique",
    summary: "Produits, catégories, marques et mise en avant page boutique.",
    blocks: [
      {
        type: "p",
        text: "Le catalogue est le cœur de votre boutique en ligne. Tout ce que les visiteurs voient sur /boutique et /offres provient d'ici : produits, catégories, marques et mise en avant éditoriale.",
      },
      {
        type: "link",
        href: "/admin/catalogue",
        label: "Hub catalogue",
      },
      { type: "h3", text: "Vue d'ensemble (Tableau)" },
      {
        type: "p",
        text: "La page hub affiche des compteurs (produits, catégories, marques) et des liens rapides vers chaque sous-section, dont la configuration de la page boutique publique.",
      },
      { type: "h3", text: "Produits — liste et filtres" },
      {
        type: "link",
        href: "/admin/catalogue/produits",
        label: "Gérer les produits",
      },
      {
        type: "ul",
        items: [
          "Filtrez par type : LUXE (boutique) ou SERVICE (coaching/prestations)",
          "Recherchez par nom dans la barre de recherche",
          "Actions : modifier, supprimer, accéder à la fiche produit",
          "Bouton « Nouveau produit » pour créer un article",
        ],
      },
      { type: "h4", text: "Créer ou modifier un produit" },
      {
        type: "p",
        text: "Le formulaire produit comporte trois blocs : Informations générales, Médias & contenu, Publication.",
      },
      {
        type: "table",
        headers: ["Champ", "Description"],
        rows: [
          ["Type *", "LUXE = article boutique ; SERVICE = accompagnement coaching"],
          ["Nom *", "Titre affiché sur le site et dans l'admin"],
          ["Slug URL", "Identifiant dans l'adresse (/boutique/mon-produit). Généré automatiquement depuis le nom à la création"],
          ["SKU", "Référence interne optionnelle"],
          ["Catégorie *", "Catégorie du même scope (LUXE ou SERVICE)"],
          ["Marque", "Sélection dans la liste ou saisie libre si aucune marque enregistrée"],
          ["Prix (FCFA) *", "Prix affiché et utilisé au checkout"],
          ["Durée", "Uniquement pour SERVICE (ex. « 4 heures »)"],
          ["Description courte", "Texte d'accroche (cartes produit, section mise en avant)"],
          ["Description complète *", "Contenu détaillé de la fiche produit"],
          ["URLs images", "Une URL par ligne (Unsplash, CDN, etc.) — première image = vignette principale"],
          ["Points forts", "Un avantage par ligne (liste à puces sur la fiche)"],
          ["Mots-clés", "Séparés par virgule — améliorent la recherche boutique"],
          ["Ordre", "Nombre pour trier l'affichage (plus petit = plus haut)"],
          ["Actif", "Coché = visible sur le site public"],
          ["Mis en avant", "Coché = éligible à la section « Les plus convoités » (si non choisi manuellement)"],
        ],
      },
      { type: "h3", text: "Catégories" },
      {
        type: "link",
        href: "/admin/catalogue/categories",
        label: "Gérer les catégories",
      },
      {
        type: "ul",
        items: [
          "Créez des catégories LUXE (boutique) ou SERVICE (prestations)",
          "Organisez une hiérarchie parent / enfant pour structurer le catalogue",
          "Le slug est utilisé dans les filtres URL de la boutique (/boutique?category=…)",
          "L'ordre d'affichage se règle via le champ « Ordre »",
        ],
      },
      { type: "h3", text: "Marques" },
      {
        type: "link",
        href: "/admin/catalogue/marques",
        label: "Gérer les marques",
      },
      {
        type: "p",
        text: "Enregistrez les marques réutilisables (ex. « Maison Élégance »). Lors de la création d'un produit LUXE, sélectionnez la marque dans la liste plutôt que de la retaper à chaque fois.",
      },
      { type: "h3", text: "Page boutique — section « Les plus convoités »" },
      {
        type: "link",
        href: "/admin/catalogue/boutique",
        label: "Configurer la page boutique",
      },
      {
        type: "p",
        text: "Cette page permet de personnaliser la section éditoriale visible sur /boutique (style mise en avant Wix) :",
      },
      {
        type: "table",
        headers: ["Paramètre admin", "Effet sur le site public"],
        rows: [
          ["Titre de la section", "Remplace « Les plus convoités »"],
          ["Texte du bouton", "Remplace « Découvrir » sur chaque bloc produit"],
          ["Produit 1 / Produit 2", "Force l'affichage de 2 articles précis (max 2)"],
          ["Automatique (produit 1)", "Affiche les produits LUXE marqués « Mis en avant »"],
        ],
      },
      {
        type: "p",
        text: "L'image, la marque, le nom et la description courte de chaque bloc proviennent toujours de la fiche produit correspondante — modifiez-les dans Catalogue → Produits.",
      },
      {
        type: "tip",
        text: "Workflow recommandé : 1) créer les produits LUXE avec images et descriptions, 2) cocher « Mis en avant » ou les sélectionner dans Page boutique, 3) personnaliser titre et bouton, 4) vérifier sur /boutique.",
      },
      {
        type: "howto",
        title: "Filtrer et retrouver un produit dans la liste",
        description:
          "Quand le catalogue grandit, les filtres permettent de retrouver rapidement un article à modifier.",
        steps: [
          "Allez dans Catalogue → Produits.",
          "Tapez un mot dans la barre « Rechercher » pour filtrer par nom.",
          "Utilisez le filtre « Type » pour n'afficher que LUXE ou SERVICE.",
          "Filtrez par catégorie ou marque via les menus déroulants.",
          "Filtrez par statut Actif/Inactif pour voir les produits masqués.",
          "Cliquez sur le crayon pour modifier le produit trouvé.",
        ],
      },
    ],
  },
  {
    id: "offres",
    title: "Prestations & Produits",
    summary: "Vue consolidée coaching et articles de luxe.",
    blocks: [
      {
        type: "link",
        href: "/admin/offres",
        label: "Hub prestations",
      },
      { type: "h3", text: "Rôle de cette section" },
      {
        type: "p",
        text: "Il s'agit d'une vue de lecture orientée « offres commerciales ». Les tableaux Accompagnements et Articles de luxe listent les produits existants mais ne remplacent pas le catalogue : toute modification se fait dans Catalogue → Produits.",
      },
      { type: "h3", text: "Accompagnements coaching" },
      {
        type: "link",
        href: "/admin/offres/accompagnements",
        label: "Voir les accompagnements",
      },
      {
        type: "ul",
        items: [
          "Liste des produits de type SERVICE",
          "Affiche nom, catégorie, prix, durée, statut actif/inactif",
          "Lien vers la fiche produit pour édition",
        ],
      },
      { type: "h3", text: "Articles de luxe" },
      {
        type: "link",
        href: "/admin/offres/luxe",
        label: "Voir les articles de luxe",
      },
      {
        type: "ul",
        items: [
          "Liste des produits de type LUXE regroupés par catégorie",
          "Utile pour vérifier rapidement le catalogue boutique avant publication",
        ],
      },
    ],
  },
  {
    id: "paiements",
    title: "Paiements",
    summary: "Modes de paiement, CinetPay et historique des transactions.",
    blocks: [
      {
        type: "p",
        text: "Cette section gère tout ce qui touche à l'argent : les moyens de paiement proposés aux clients et l'historique des transactions. Elle est indispensable pour activer Mobile Money, la carte bancaire et suivre les encaissements.",
      },
      {
        type: "link",
        href: "/admin/paiements",
        label: "Hub paiements",
      },
      { type: "h3", text: "Tableau paiements" },
      {
        type: "p",
        text: "Résumé : nombre de modes actifs, transactions enregistrées, montant total encaissé.",
      },
      { type: "h3", text: "Modes de paiement" },
      {
        type: "link",
        href: "/admin/paiements/modes",
        label: "Configurer les modes",
      },
      {
        type: "p",
        text: "Gérez les moyens proposés au checkout (Mobile Money, carte, virement, etc.).",
      },
      {
        type: "table",
        headers: ["Champ", "Usage"],
        rows: [
          ["Modèle / fournisseur", "Pré-remplit nom, code et canal API (ex. Orange Money via CinetPay)"],
          ["Nom affiché", "Libellé visible par le client au paiement"],
          ["Code", "Identifiant technique unique du mode"],
          ["Description & instructions", "Texte d'aide affiché lors du choix du mode"],
          ["Logo", "Upload ou URL — affiché sur les cartes de paiement"],
          ["Canal API CinetPay", "Correspondance avec le canal CinetPay (OM, MTN, Moov, carte…)"],
          ["Contexte", "Boutique, prestations ou les deux"],
          ["Montants min / max", "Limites optionnelles en FCFA"],
          ["Actif", "Visible ou masqué au checkout"],
          ["Ordre", "Priorité d'affichage"],
        ],
      },
      {
        type: "warn",
        text: "Les paiements en ligne nécessitent une configuration CinetPay valide dans Paramètres → Plateforme (Site ID, clé API, URL de notification).",
      },
      { type: "h3", text: "Transactions" },
      {
        type: "link",
        href: "/admin/paiements/transactions",
        label: "Historique des transactions",
      },
      {
        type: "ul",
        items: [
          "Liste chronologique des paiements enregistrés",
          "Référence transaction, commande associée, montant, statut, fournisseur",
          "Utile pour le rapprochement comptable et le support client",
        ],
      },
      {
        type: "howto",
        title: "Vérifier qu'un client a bien payé",
        description:
          "Quand un client dit avoir payé mais que la commande reste « En attente », vérifiez la transaction dans l'historique.",
        steps: [
          "Demandez au client sa référence commande (visible dans son email de confirmation).",
          "Allez dans Commandes et repérez la commande par sa référence.",
          "Allez dans Paiements → Transactions.",
          "Cherchez une transaction liée à cette commande avec le statut « Réussi » ou « SUCCESS ».",
          "Si aucune transaction n'apparaît, le paiement n'a pas abouti — invitez le client à réessayer ou vérifiez la config CinetPay.",
        ],
      },
    ],
  },
  {
    id: "messages",
    title: "Messages",
    summary: "Demandes reçues via les formulaires de contact.",
    blocks: [
      {
        type: "p",
        text: "Tous les messages envoyés depuis la page Contact du site arrivent ici. C'est votre boîte de réception pour les demandes de renseignements, partenariats et diagnostics sur-mesure.",
      },
      {
        type: "link",
        href: "/admin/messages",
        label: "Ouvrir les messages",
      },
      { type: "h3", text: "Types de messages" },
      {
        type: "table",
        headers: ["Type", "Origine"],
        rows: [
          ["Contact général", "Formulaire contact standard"],
          ["Demande entreprise", "Formulaire orienté entreprises / B2B"],
          ["Diagnostic sur-mesure", "Demande de diagnostic personnalisé"],
        ],
      },
      { type: "h3", text: "Lecture d'un message" },
      {
        type: "ul",
        items: [
          "Nom, email, téléphone et entreprise (si renseignée)",
          "Date d'envoi",
          "Corps du message",
          "Les messages non lus ont une bordure plus marquée et sont comptés sur le tableau de bord",
        ],
      },
      {
        type: "tip",
        text: "Répondez aux messages via votre client email habituel en utilisant l'adresse indiquée. L'email de contact affiché sur le site se configure dans Paramètres → Plateforme.",
      },
    ],
  },
  {
    id: "avis",
    title: "Avis clients",
    summary: "Témoignages et modération.",
    blocks: [
      {
        type: "p",
        text: "Les clients peuvent laisser des avis après leur expérience. Cette page vous permet de les consulter et de contrôler ce qui est affiché publiquement sur le site.",
      },
      {
        type: "link",
        href: "/admin/avis",
        label: "Ouvrir les avis",
      },
      { type: "h3", text: "Contenu affiché" },
      {
        type: "ul",
        items: [
          "Photo et nom du client",
          "Note en étoiles (1 à 5)",
          "Titre et texte du témoignage",
          "Statut : En attente, Approuvé ou Rejeté",
          "Date de soumission",
        ],
      },
      {
        type: "p",
        text: "Seuls les avis approuvés sont destinés à l'affichage public sur le site. Consultez cette page régulièrement pour modérer les nouveaux témoignages.",
      },
    ],
  },
  {
    id: "blog",
    title: "Blog",
    summary: "Création et publication d'articles.",
    blocks: [
      {
        type: "p",
        text: "Le blog permet de publier des articles de conseil, actualités et contenus SEO sur la page /blog. Vous pouvez rédiger en brouillon puis publier quand l'article est prêt.",
      },
      {
        type: "link",
        href: "/admin/blog",
        label: "Hub blog",
      },
      { type: "h3", text: "Tableau blog" },
      {
        type: "p",
        text: "Compteurs : total d'articles, publiés, brouillons. Lien vers la liste complète et création d'un nouvel article.",
      },
      { type: "h3", text: "Liste des articles" },
      {
        type: "link",
        href: "/admin/blog/articles",
        label: "Gérer les articles",
      },
      {
        type: "ul",
        items: [
          "Vue de tous les articles avec statut publié / brouillon",
          "Modifier ou supprimer un article existant",
          "Accès au formulaire de création",
        ],
      },
      { type: "h3", text: "Formulaire article" },
      {
        type: "table",
        headers: ["Champ", "Description"],
        rows: [
          ["Titre *", "Titre de l'article affiché sur /blog"],
          ["Slug URL", "Segment d'URL (généré depuis le titre à la création)"],
          ["Extrait", "Résumé pour les cartes et le SEO"],
          ["Contenu *", "Corps de l'article (texte complet)"],
          ["Image de couverture", "Upload ou URL — vignette de l'article"],
          ["Auteur", "Nom affiché (par défaut Ariane DAGO)"],
          ["Tags", "Mots-clés séparés par virgule"],
          ["Publié", "Coché = visible immédiatement sur le blog public"],
        ],
      },
      {
        type: "tip",
        text: "Enregistrez en brouillon (Publié décoché) pour préparer un article, puis publiez-le quand le contenu est prêt.",
      },
    ],
  },
  {
    id: "statistiques",
    title: "Statistiques",
    summary: "Analyses commerciales et performance.",
    blocks: [
      {
        type: "link",
        href: "/admin/statistiques",
        label: "Ouvrir les statistiques",
      },
      { type: "h3", text: "Indicateurs disponibles" },
      {
        type: "ul",
        items: [
          "Chiffre d'affaires total et évolution",
          "Taux de conversion (visiteurs → commandes, selon données disponibles)",
          "Répartition des commandes par statut",
          "Produits les plus vendus (top du catalogue)",
        ],
      },
      {
        type: "p",
        text: "Utilisez cette page pour piloter l'activité boutique et coaching, identifier les produits performants et détecter d'éventuels blocages (commandes en attente de paiement, etc.).",
      },
    ],
  },
  {
    id: "parametres",
    title: "Paramètres",
    summary: "Compte personnel, équipe et configuration plateforme.",
    blocks: [
      {
        type: "p",
        text: "Les paramètres regroupent trois zones : votre compte personnel, la gestion de l'équipe admin et la configuration technique du site (URL, CinetPay, contacts).",
      },
      {
        type: "link",
        href: "/admin/parametres",
        label: "Ouvrir les paramètres",
      },
      { type: "h3", text: "Mon compte" },
      {
        type: "ul",
        items: [
          "Modifier prénom, nom, téléphone et email",
          "Changer la photo de profil (upload)",
          "Mettre à jour le mot de passe (ancien + nouveau + confirmation)",
        ],
      },
      { type: "h3", text: "Équipe (administrateurs uniquement)" },
      {
        type: "p",
        text: "Gérez les comptes back-office : création, modification, suppression. Pour chaque membre : identité, email, téléphone, rôle, mot de passe initial.",
      },
      {
        type: "ul",
        items: [
          "Super administrateur peut assigner tous les rôles équipe",
          "Administrateur peut assigner tous les rôles sauf Super administrateur",
          "Un administrateur ne peut pas supprimer son propre compte depuis cette interface",
        ],
      },
      { type: "h3", text: "Plateforme" },
      {
        type: "table",
        headers: ["Paramètre", "Rôle"],
        rows: [
          ["URL publique", "Adresse du site (liens absolus, emails, redirections paiement)"],
          ["Numéro WhatsApp", "Contact WhatsApp affiché / utilisé sur le site"],
          ["Email de contact", "Destinataire ou expéditeur des communications contact"],
          ["CinetPay Site ID", "Identifiant marchand CinetPay"],
          ["CinetPay clé API", "Secret d'authentification (masqué après enregistrement)"],
          ["URL notification CinetPay", "Webhook de retour de paiement — doit pointer vers votre domaine"],
        ],
      },
      {
        type: "warn",
        text: "Ne partagez jamais la clé API CinetPay. Vérifiez que l'URL publique correspond exactement à votre domaine de production (https://…).",
      },
    ],
  },
  {
    id: "bonnes-pratiques",
    title: "Bonnes pratiques",
    summary: "Workflows recommandés et dépannage.",
    blocks: [
      { type: "h3", text: "Mettre en ligne un nouvel article boutique" },
      {
        type: "ol",
        items: [
          "Créer la marque si nécessaire (Catalogue → Marques)",
          "Créer ou vérifier la catégorie LUXE",
          "Créer le produit avec images, prix, descriptions",
          "Cocher « Actif »",
          "Optionnel : cocher « Mis en avant » ou le sélectionner dans Page boutique",
          "Vérifier sur /boutique (filtres, recherche, fiche produit)",
        ],
      },
      { type: "h3", text: "Mettre en ligne une prestation coaching" },
      {
        type: "ol",
        items: [
          "Créer une catégorie SERVICE",
          "Créer le produit SERVICE avec durée et description",
          "Vérifier sur /offres et le parcours d'achat client",
          "Suivre les rendez-vous dans Admin → Rendez-vous après commande",
        ],
      },
      { type: "h3", text: "Activer les paiements en ligne" },
      {
        type: "ol",
        items: [
          "Renseigner CinetPay dans Paramètres → Plateforme",
          "Créer les modes de paiement avec les bons canaux API",
          "Tester une commande en environnement de production",
          "Contrôler la transaction dans Paiements → Transactions",
        ],
      },
      { type: "h3", text: "Problèmes fréquents" },
      {
        type: "table",
        headers: ["Problème", "Piste de résolution"],
        rows: [
          ["Produit invisible sur la boutique", "Vérifier que « Actif » est coché et que le type est LUXE"],
          ["Section « Les plus convoités » vide", "Marquer des produits « Mis en avant » ou les sélectionner dans Page boutique"],
          ["Paiement échoue", "Vérifier CinetPay (Site ID, clé API, URL notification) et le mode actif"],
          ["Image produit absente", "Ajouter une URL valide dans le champ images (une par ligne)"],
          ["Bouton grisé dans l'admin", "Votre rôle n'a pas les droits d'écriture — contacter un administrateur"],
        ],
      },
    ],
  },
];
