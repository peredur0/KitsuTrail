# Notes pour la présentation

[Présentation Google slides](https://docs.google.com/presentation/d/141WVZ7Nw6pLwayz9w-5Vs1nUQEenf5rMd30uTflKxfQ/edit?slide=id.p#slide=id.p)


## Introduction
Présentation de l'objectif

Annonce du plan:

 > Rappeler que la demande était de faire une présentation d'une vingtaine de minutes qui met en lumière les difficultés et les fierté.

1. Schéma généraux (architecture + git)
2. Les défis rencontré lors de la réalisation du projet
3. Les éléments dont je suis fier
4. Démonstration/questions

## Schéma généraux
### Architecture
- Tenko > Frontend servis par nginx
    - core : composant de base (header, homepage, sidebar)
    - features : audit, providers, stats, users
- Kuro > Serveur API (rest) avec FastAPI
- Hatsuho > Responsable de la création des données factices (à l'initialisation)
- Inari > Base de données

> Possibilité d'ajouter un reverse-proxy (nginx) qui va gérer les https + la redirection entre le front et le back selon l'url (api.kitsu & www.kitsu)

### GIT
- Branche principale - main
- Branche de développement - develop
- Branches de fonctionnalité - feat/fix

Evolution vers:
- **pre-commit**, qui va permettre d'inclure automatiquement plusieurs check et linter juste avant de faire le commit:
    - check-merge-conflict
    - detect-private-key
    - check conventional commit message
    - linter (black, flake, es-lint)

- **CI/CD**, github_action ou gitlab-ci
    - Possibilité de pousser directement les nouvelles versions des container dans le repo docker_hub
    > Préférence pour gitlab-ci.yaml car le code est directement versionné.  

- **Testing**, utilisation de pytest, intégré directement dans pré-commit ou dans la CI

- **Code security**, Sonarqube > système qui permet de l'optimisation et de la recherche de vulnérabilité

## Défis
### Frontend
1. Apprentissage d'Angular TS  + tout l'environnement de développement
    - Plusieurs cours annexes (le quick start officiel, openclassroom pour la mise en place de l'environnement de développement)
    - J'ai apprécié la séparation entre la logique HTML, CSS et TS pour chaque composant
2. Gestion de l'asynchrone
    - Observables: retourne plusieurs valeurs au fur et a mesure du temps
        - config (gestion facilité de l'url de l'api)
        - appels API (users, providers, stats)
        - Nécessite de faire un subscribe et unsubscribe
    - Promises: Retourne une seule valeur future
        - utilisé dans le addUser
    - Signaux: un peu comme une variable globale et qui peut être modifiée
        - headers (titre et sous-titre)
3. Récupération de l'url courant pour adapter les titres et sous-titres
    - Abonnement aux évènements du router en attendant la fin de la navigation pour mettre à jour le header via un signal
4. Actualisation fluide du tableau de bord
    - refresh automatique et manuel, qui nécessitait de recharger la page.
    - avec behaviorSubject possibilité de limiter aux charts

### Backend
1. Apprentissage de nouvelles techno:
    - FastAPI: Moteur API REST
    - Pydantic: Schématisation des données avec validation automatique
        liaison entre données JSON/API facilité + documentation automatique
    - ORM: Correspondance entre les objets python et les tables SQL
        Facilitation des requêtes simples plus python-like
2. Génération de données cohérentes:
    - Ne pas créer d'activité pour l'utilisateur avant sa création
    - Garder une logique d'authentification/accès pour les utilisateurs
    - Prendre en compte la réalité temporelle des actions

## Réussites
### FrontEnd
1. Le tableau de bord est fluide et 
    - rafraîchissement manuel / automatique
    - Une fois la techno choisie (ng-apexchart) c'est allé assez vite

2. Journal d'audit avec multiple filtre:
    - filtration multi-critère
    - sauvegarde de la filtration temps qu'on est sur la page

## Backend
1. Infrastructure en microservice
    - Docker compose qui utilise les balises d'ancrage/alias yaml &.*
    - Inspiration du compose.yaml d'Apache Airflow
2. System de creation de données fictives qui répond à l'user-story
