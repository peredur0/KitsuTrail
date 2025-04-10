# Journal de bord

Partie du journal de bord spécialement dédiée au développement du backend.
Pour des informations sur les origines du projet, merci de consulter l'entête du [logbook_front](./logbook_front.md)

Pour le backend, j'ai choisi de coder en python. C'est un langage que je connais bien.
Cependant j'ai encore des particularités qui m'échappe, notamment dans le développement web.
L'objectif est bien approfondir ma maîtrise de ce langage.

J'ai envisagé les framework suivants:
- FastAPI
- Django

L'interface utilisateur étant gérée par Angular, j'ai surtout besoin d'un serveur API REST qui va pouvoir être interroger rapidement par le front.
Le choix se porte donc sur FastAPI. 

## 2025-04-07 Apprentissage des bases de fastAPI
Pas grand chose pour ce début.
Simplement l'apprentissage des tout premiers concept.
Lancer le serveur et executer les premières requêtes depuis le navigateur ou le swagger.

Je devrais approfondir les grands principes avec le tutoriel officiel [https://fastapi.tiangolo.com/tutorial/](https://fastapi.tiangolo.com/tutorial/).

Fin de soirée arrivé à [https://fastapi.tiangolo.com/tutorial/query-params/](https://fastapi.tiangolo.com/tutorial/query-params/)
Continuation de l'apprentissage de FastAPI

## 2025-04-09 Préparation de l'API KitsuTrail
J'ai lu pas mal d'article de le documentation officielle.
Le point qui m'a le plus marqué est l'utilisation de pydantic pour typer fortement les attendus des paramètres ou du body.

Je vais commencer à coder une solution avec une architecture que j'espère modulaire.
Pour le moment je vais laisser de coté la partie authentification.
J'y reviendrais peut être plus tard si j'ai le temps.

L'objectif est maintenant d'avoir des méthodes correct pour faire le CRUD sur les users.
On va commencer par faire une base de données SQLite pour stocker les utilisateurs, lors de la phase de développement.

## 2025-04-10 Création de la base de données
Pour le développement, on va rester sur une base SQLlite.
- [https://docs.python.org/3/library/sqlite3.html](https://docs.python.org/3/library/sqlite3.html)

La première table sera pour les utilisateurs
- id `TEXT PRIMARY KEY CHECK (length(id) = 8)`
- login `TEXT NOT NULL UNIQUE`
- firstname `TEXT`
- lastname `TEXT`
- email `TEXT`
- created_at `DATETIME DEFAULT CURRENT_TIMESTAMP`

On ajoute également un index sur les champs:
- login
- firstname
- lastname
- email
L'objectif sera de pouvoir effectuer des recherches d'utilisateur sur ces champs.