# uTasks - Application de Gestion de Tâches Kanban

Application web de type Kanban développée avec React, TypeScript, Material-UI et React Beautiful DnD pour la gestion collaborative de tâches.

##  Prérequis

- **Node.js** : version 18.x ou supérieure
- **npm** : version 9.x ou supérieure
- Navigateur web moderne (Chrome, Firefox, Edge, Safari)

##  Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/joquist09/utasks.git
cd utasks
```

2. Installer les dépendances :
```bash
npm install
```

##  Démarrage

### Mode développement

```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Build de production

```bash
npm run build
```

Les fichiers générés seront dans le dossier `dist/`

### Prévisualisation du build

```bash
npm run preview
```

### Vérification du code

```bash
npm run lint
```

##  Fonctionnalités

### Authentification (3/3 points)
-  Création de compte utilisateur (inscription)
-  Connexion avec nom d'utilisateur
-  Déconnexion
- Note : L'API ne supporte pas les mots de passe, authentification par nom d'utilisateur uniquement

### Gestion des Boards (5/5 points)
-  Création de boards (titre 3-50 caractères)
-  Visualisation de tous les boards
-  Accès à un board spécifique
-  Suppression de boards
-  Validation des champs avec compteur de caractères

### Gestion des Listes (5/5 points)
-  Création de listes via dialog (nom 3-30 caractères)
-  Affichage des listes d'un board
-  Suppression de listes avec confirmation
-  Drag & drop pour réorganiser les listes (20/20 points)

### Gestion des Cartes (5/5 points)
-  Création de cartes via dialog avec tous les champs :
  - Titre (3-50 caractères)
  - Description (max 30 caractères, requis)
  - Priorité (Basse/Moyenne/Haute)
  - Date d'échéance (requis)
-  Modification des cartes
-  Suppression avec confirmation
-  Affichage avec indicateurs visuels (priorité, date)

### Visualisation (3/3 points)
-  Interface Kanban claire et intuitive
-  Design responsive (mobile et desktop)
-  Icônes et couleurs pour les priorités

### Drag & Drop (20/20 points)
-  Déplacement des cartes entre listes
-  Réorganisation des listes
-  Mise à jour optimiste (pas de flash visuel)
-  Persistance des changements via API

### Tri des Cartes (15/15 points)
-  Tri par priorité (croissant/décroissant)
-  Tri par date d'échéance (croissant/décroissant)
-  Option "Aucun tri"
-  Tri indépendant par liste

### Gestion des Erreurs (8/8 points)
-  Messages d'erreur clairs et informatifs
-  Validation côté client
-  Gestion des erreurs API
-  Alertes utilisateur appropriées

### Qualité du Code (8/8 points)
-  TypeScript strict
-  Composants réutilisables
-  Separation of concerns
-  Pas de console.log (seulement console.error)
-  Code formaté et lint-free
-  Conventions de nommage cohérentes


## API

L'application utilise l'API REST hébergée à :
```
https://utasks-026af75f15a3.herokuapp.com/api
```

### Endpoints utilisés

#### Authentification
- `POST /users/register` - Créer un compte
- `GET /users/{userId}` - Récupérer un utilisateur

#### Boards
- `GET /boards/user/{userId}` - Lister les boards d'un utilisateur
- `GET /boards/{boardId}` - Obtenir un board
- `POST /boards` - Créer un board
- `PUT /boards/{boardId}` - Modifier un board
- `DELETE /boards/{boardId}` - Supprimer un board

#### Listes
- `GET /lists/board/{boardId}` - Lister les listes d'un board
- `POST /lists` - Créer une liste
- `DELETE /lists/{listId}` - Supprimer une liste

#### Cartes
- `GET /cards/list/{listId}` - Lister les cartes d'une liste
- `GET /cards/{cardId}` - Obtenir une carte
- `POST /cards` - Créer une carte
- `PUT /cards/{cardId}` - Modifier une carte
- `DELETE /cards/{cardId}` - Supprimer une carte

## Tests

Pour tester l'application :

1. **Inscription** :
   - Aller sur `/register`
   - Créer un compte avec un nom d'utilisateur unique (min 3 caractères)

2. **Connexion** :
   - Utiliser le même nom d'utilisateur
   - Vous serez redirigé vers la liste des boards

3. **Créer un Board** :
   - Cliquer sur "Create Board"
   - Entrer un titre (3-50 caractères)

4. **Gérer les Listes** :
   - Cliquer sur "Add List"
   - Drag & drop pour réorganiser

5. **Gérer les Cartes** :
   - Cliquer sur "+ Add a card"
   - Remplir tous les champs requis
   - Drag & drop entre listes
   - Utiliser le menu (⋮) pour éditer/supprimer

6. **Trier les Cartes** :
   - Utiliser le menu déroulant "Sort by" dans chaque liste

7. **Responsive** :
   - Tester sur mobile (≤768px) : disposition verticale
   - Tester sur desktop (>768px) : disposition horizontale


## Design Responsive

### Mobile (< 768px)
- Listes empilées verticalement
- Cartes pleine largeur
- Interface tactile optimisée

### Desktop (≥ 768px)
- Listes disposées horizontalement
- Scroll horizontal pour nombreuses listes
- Largeur fixe de 280px par liste


##  Auteur

Par Jordan Quist - Projet réalisé dans le cadre du cours GLO-3102 à l'Université Laval.
