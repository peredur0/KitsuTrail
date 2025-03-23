# Journal de bord

Fichier de suivis et notes informatives tout au long du développement du projet.

Le projet à pour objectif d'insérer des éléments de tableaux de bords dans une application Web existante ou pseudo existante.
La plateforme cible utilise Angular et est déployée dans une infrastructure Cloud.

Avant le début du projet j'ai commencé à apprendre Angular sur les sites suivants:
- https://angular.dev/
- https://openclassrooms.com

L'idée principale est de développer une application Angular qui va permettre à un utilisateur d'ajouter des lignes de log d'audit pour simuler des actions utilisateurs sur une plateforme de gestion des accès.

Une fois cette plateforme en place, il sera alors possible de travailler sur l'ajout des tableaux de bord et rapport qui vont se baser sur les logs renseigner par les utilisateurs.

Initialement, je compte utiliser les technologies suivantes:
- Frontend: Angular (nécessité technique)
- Backend: Python (Affinité avec le langage et approfondissement des mes connaissances)
  * Facilité d'intégration de modèle IA
  * FastAPI: (apprentissage de la mise en place d'un serveur API)
- Base de données: (Choix final à définir)
  * Postgres SQL: base de données puissante et connue
  * MongoDB: base noSQL flexible et facilement transférable dans le cloud (Cloud Atlas)
- Docker: (Utiliser pour le développement) 

## 2025-03-23 - Initialisation du projet
Démarrage officiel du projet avec la création des répertoires de l'architecture globale du projet avec les répertoires frontend, backend et database.
J'ai également ajouté ce fichier journal de bord, des fichiers README et une licence MIT pour être complètement OpenSource.

L'ensemble du projet a été poussé dans github: [https://github.com/peredur0/KitsuTrail](https://github.com/peredur0/KitsuTrail)

Le nom du projet est KitsuTrail, Kitsu en référence au renard et Trail pour la piste. Je tente également de créer le logo de la plateforme avec de l'IA générative.
J'utilise le modèle Dreamshaper8 avec une instance local InvokeAI, pour générer un logo.

**Démarrage du développement du frontend**
- Utilisation de node 18 `nvm use 18`
- Utilisation d'Angular 19 `npm i -g @angular/cli`
- Création de l'application angular (sans tests pour le moment) `ng new KitsuTrail --style=scss` (Sans SSR)
- Draft du design à l'aide de Moqups [https://app.moqups.com](https://app.moqups.com) ![design_draft](./img/kitsutrail_design_draft.png)