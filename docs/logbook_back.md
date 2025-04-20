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

Le fichier `init_db.py` dans sqlite permet d'initialiser la base.
Ci dessous quelques commandes utiles:
``` 
$ sqlite3 inari.db
> .tables
> .schema users
> .headers on
> mode columns
> SELECT * FROM users;
```

la table est prête il faut maintenant que le backend récupère ses informations dans la base.
Un peu de documentation:
- [https://fastapi.tiangolo.com/tutorial/sql-databases/](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [https://docs.sqlalchemy.org/en/20/core/engines.html#sqlite](https://docs.sqlalchemy.org/en/20/core/engines.html#sqlite)
- [https://blog.sqlitecloud.io/sqlite-python-sqlalchemy](https://blog.sqlitecloud.io/sqlite-python-sqlalchemy)

## 2025-04-11 Connection fastAPI et SQLite
Etude des solutions proposée pour la liaison en FastAPI.
La solution proposée par la documentation officielle est la plus compréhensible.
L'inconvénient est que tout est dans le même fichier.
Mais je trouverais un moyen de mettre dans un format modulaire.

Je me demande s'il ne serait pas judicieux que le backend soit en charge de créer les bases qu'il va utiliser. Mais il ne faudrait pas qu'il réinitialise tout l'ensemble à chaque démarrage.
Pour moi la question se pose aussi de la fermeture de la connexion en cas d'échec. J'ai pas trop compris si une instance peut être ouverte pour le temps de l'execution et fermée avec le backend. Je pense pas que ça soit une bonne pratique.

Je dois également étudier l'abstraction ORM qui peut être mise en place avec BaseModel, SQLModel et Pydantic.

## 2025-04-18 Reprise suite à une petite pose
L'objectif maintenant est d'arriver à faire interagir FastAPI avec la base SQLite. On va vraiment se baser la dessus
- [https://fastapi.tiangolo.com/tutorial/sql-databases/](https://fastapi.tiangolo.com/tutorial/sql-databases/)

C'est finalement assez facile de lier une table sql avec l'outil SQLmodel.
Il faut définir en amont le model souhaité.
Pour le moment on récupère bien la liste des users avec une requête GET.
La prochaine étape est de rendre modulaire le code de fastAPI.
De cette manière, il sera plus simple d'ajouter des nouvelles tables et des nouveaux accès.

Une idée complémentaire est d'ajouter un log d'audit directement quand une requête est faite à l'API.

## 2025-04-19 travail sur la gestion des utilisateurs
J'ai pu déplacer les fonctions relative à la connexion et les actions sur la base de données dans un module externe.

Je vais également ajouter une vérification des données du header.
Cette vérification est pour le moment présente uniquement pour l'acceptation de 'application/json'.
A terme ça sera utilisé dans la phase d'authentification.

J'ai pas mal travaillé sur la gestion de l'importation des modules user pour le moment.
Chaque module va contenir une fonction *init_router()* qui va se charger de faire les vérifications d'usage. Comme par exemple la présence de la table.
Le *main* va également contenir un boucle qui va charger chaque module un par un.
Si le chargement d'un seul module échoue, les autres ne seront pas impactés et le backend restera disponible.
> Le seul problème que je n'ai pas encore pu résoudre c'est que lors du lancement du serveur si un module échoue j'ai 2 fois le message. 1 fois au lancement du serveur sans le format logging et une seconde fois lors du chargement du module dans le main avec le bon format. Pour le moment ce n'est pas un problème bloquant.

Prochaine étape est d'ajouter toutes les fonctionnalités CRUD sur les utilisateurs.
J'ai ajouté la méthode POST pour pouvoir ajouter un utilisateur dans la base de données.
J'ai du réorganiser un peu les modèles utilisateurs en fonction de l'utilisation.
Mais je ne suis pas totalement convaincu de la nécessité:
Les modèles sont les suivants:
- UserBase: avec les informations partagées entre tous les types
    - login, firstname, lastname, email
- UserCreate: pour récupérer les informations du formulaire de création
    - mêmes champs que UserBase
- UserInDB: pour la connexion avec la table en base
    - UserBase + id + created_at
- UserPublic: pour l'objet retourné par l'API, et la possibilité de masquer certains champs
    - UserBase + id + created_at

Le backend s'occupe de générer un nouvel uuid et de vérifier s'il n'est pas déjà utilisé.
Il se charge également d'ajouter directement la date/heure de création.
Je le fais directement dans le post car je vais utiliser la même date dans les logs d'audit.

Pour les logs d'audit j'aimerais faire en sorte que les deux doivent réussir pour que toutes les infos dans les tables soient consistantes.

Petit ajout rapide de la fonction delete user. Pas de difficulté.

Prochaine étape l'update d'un utilisateur.

## 2025-04-20 Mise à jour d'un utilisateur
La mise à jour de l'utilisateur est possible maintenant grace à la méthode patch.
Il est possible de modifier indépendamment chaque champs ou l'ensemble.
J'ai ajouté un modèle *UserUpdate* qui contient tous les champs modifiables.

On a maintenant une liste d'utilisateur présent dans une base sqlite.
Les actions possibles:
- Lister les utilisateurs
- Créer un nouvel utilisateur
- Lire un utilisateur existant
- Supprimer un utilisateur existant
- Modifier un utilisateur existant

Je pense qu'il est temps de lier le front et le back end.
