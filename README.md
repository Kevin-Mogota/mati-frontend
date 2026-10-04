# Mogota Agri-Tech — Frontend (projet Vite organisé)

Ce dossier est le résultat du découpage du prototype monolithique
(`mogota-agritech-dashboard.jsx`) en un vrai projet React organisé par
dossiers. Le contenu et le comportement sont identiques — seule
l'organisation des fichiers a changé.

## Pourquoi ce découpage

Le fichier unique faisait plus de 230 Ko et 2200 lignes. Au-delà d'une
certaine taille, un seul fichier devient difficile à :
- **naviguer** — retrouver un composant précis prend du temps ;
- **faire évoluer à plusieurs** — deux personnes qui modifient le même
  fichier entrent en conflit sur Git ;
- **tester** — un fichier = une seule unité, impossible de tester une
  partie isolément.

## Structure des dossiers

```
src/
  main.jsx              Point d'entrée : monte <App /> dans la page
  App.jsx                Composant racine : état global, navigation, mise en page
  theme.js                Couleurs, polices (tokens de design)
  data.js                 Données statiques Tchad (régions, cultures, guide)
  api.js                  Fonctions d'appel réseau (fetch vers Django et Claude)
  hooks.js                Hooks React réutilisables (auth, statut backend, etc.)
  advisory.js              Logique de calcul des conseils (semis/irrigation/risque)
  components/
    common.jsx             Panel, Pill, SectionTitle... briques d'interface réutilisées
    HeroCarousel.jsx        Bandeau animé de la page d'accueil
    Footer.jsx               Pied de page (contact, newsletter)
  tabs/
    Tab*.jsx                Un fichier par onglet public (Dashboard, Guide, Météo...)
  admin/
    AuthWall.jsx             Mur de connexion/inscription
    TabAdmin.jsx              Coquille du panneau admin (connexion + sous-navigation)
    AdminStats.jsx            Tableau de bord de statistiques
    AdminContentManagement.jsx  Actualités, Événements, À propos/Mission
    AdminAIAssist.jsx         Les 4 outils admin assistés par IA
  assets/
    logo.png                Logo Mogota (fichier image réel, plus du base64 embarqué)
```

**Règle simple à retenir pour la suite** : un fichier = une responsabilité claire.
Si vous ajoutez une fonctionnalité qui ne rentre dans aucun fichier existant,
créez-en un nouveau au bon endroit plutôt que d'agrandir un fichier existant.

## Installer et lancer

```bash
cd mati-frontend
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173 (Vite l'affiche dans le terminal).
Il se connecte automatiquement au backend Django s'il tourne sur
`http://localhost:8000` (voir `mogota-backend-django.zip`), et bascule sinon
en mode démonstration.

## Construire pour la production

```bash
npm run build
```

Génère un dossier `dist/` prêt à déployer sur n'importe quel hébergeur de
fichiers statiques (Netlify, Vercel, GitHub Pages, ou le même serveur que le
backend Django).

## Vérification effectuée

Ce découpage a été testé avec une vraie compilation (`npm run build`), pas
seulement relu — 853 modules transformés sans erreur.
