# Journal de bord

Notes lors du développement du tableau de bord.

## 2025-05-28 Démarrage de l'analyse
Une nouvelle branche a été créée pour débuter l'ajout du tableau de bord dans l'application.

Pour l'affichage, je pense utiliser `ng2-charts` qui semble être assez populaire.

Coté base de données, je pense qu'il sera nécessaire de basculer sur une base PSQL.

Pour le backend, il faudra ajouter les endpoint qui vont exposer les métriques.
Niveau performance, je pense qu'il sera préférable d'avoir un backend qui va gérer l'aggregation des métriques

Optionnellement, j'aimerais pouvoir ajouter un autre backend qui va pousser des données en continue dans la base.

Durant cette phase je vois les développement suivants:
1. Migration vers PSQL (docker partiel)
2. Service pour l'aggregation des données
3. Intégration construction du tableau de bord
4. Service pour la génération continue des données de simulation (optionnel)

## 2025-05-28 Migration postgres
Pour le fun, j'ai décidé de renommer la base SQLite Zenko.
La base PSQL prendra le nom d'Inari.

Les plus grandes modifications on été faites sur les scripts permettant d'initialiser les tables avec les données de base.

### SQLite
La base SQLite a été déplacée dans un répertoire nommé Zenko.
Pas ou peu de modification sur ce plan. La base reste en place mais elle n'a techniquement pas vocation à rester.
Elle reste néanmoins accessible pour Kuro (backend)

### PostgreSQL
L'affichage des tableaux de bords avec la génération de données statistiques risque de mettre un peu plus de pression sur la base de données, c'est pour cela que j'ai décidé de passé sur un moteur un peu stable.
J'utilise la version 16.9. Une version 17.0 est sortie récemment mais j'attends de voir si toutes les dépendances sont disponibles notamment chez les clients.

J'utilise un fichier compose.yaml avec docker compose pour démarrer une instance PSQL.
J'avais déjà utilisé cette technologie lors de mon projet précédent. J'ai pu reprendre certain éléments notamment le fichier `init.sql`, qui initialise l'utilisateur *inari* et la base de données.

Les informations de connexions pour table sont stockés dans le fichier `secrets.json`. Les informations doivent correspondre avec le fichier `.env` utilisé pour le docker compose.

### Backend Hatsuho
J'ai du modifier le programme d'initialisation pour qu'il correspondent aux nécessité de PSQL qui ne sont pas totalement identique à celles pour SQLite. J'ai déplacé ce programme dans la partie backend. Il s'appelle maintenant Hatsuho. (Toujours dans le thème des renards mythologiques japonnais)
Si je passe sur un service complémentaire pour générer automatiquement des données, ce programme sera ma base de travail.

### Backend Kuro
Avec SQLite, le backend Kuro (API) allait récupérer directement des informations dans SQLite avec un engine sqlalchemy.
Grace à ce framework, il est possible de modifier assez facilement le type de base de données à interroger.
Techniquement c'est juste un URL à changer.

J'ai ajouté une variable MODE qui permet de changer rapidement entre SQLite et PSQL si besoin.


> Prochaine étape déterminer les métriques.

## 2025-05-31 Déterminer les métriques à afficher

Il faut une partie qui va représenter l'utilisation actuelle de la plateforme, un peu comme un écran de contrôle. Une autre partie sera orientée analyse a posteriori.

On va essayer de regrouper ici toutes les idées de métriques observables

**Écran de contrôle**:
Rafraîchissement régulier
- nombre d'utilisateurs en place
    ```sql
    SELECT COUNT(*) FROM users;
    ```
- nombre d'IDP en place / répartition par protocol
    ```sql
    SELECT protocol, COUNT(*) FROM providers WHERE type = 'idp' GROUP BY protocol;
    ```
- nombre de SP en place / répartition par protocol
    ```sql
    SELECT protocol, COUNT(*) FROM providers WHERE type = 'sp' GROUP BY protocol;
    ```
- nombre de sessions actuelle active (auth il y a moins de 5 minutes)
    ```sql
    SELECT COUNT(DISTINCT(trace_id)) AS sessions
    FROM audit_logs 
    WHERE timestamp>= NOW() - INTERVAL '5 minutes' 
        AND action = 'authentication' 
        AND result = 'success';
    ```
- nombre d'utilisateur actifs (access il y a moins de 5 minutes)
    ```sql
    SELECT COUNT(DISTINCT(user_id)) AS sessions
    FROM audit_logs 
    WHERE timestamp>= NOW() - INTERVAL '5 minutes' 
        AND action = 'access' 
        AND result = 'success';
    ```

*Statistique sur plage temporelle* (1h, 24h, 36h)
- IDP/SP les plus utilisés
    ```sql
    SELECT 
        provider_type, 
        provider_name, 
        COUNT(DISTINCT(user_id)) AS users, 
        COUNT(DISTINCT(trace_id)) AS session 
    FROM audit_logs 
    WHERE timestamp >= NOW() - INTERVAL '1 hours' 
        AND result = 'success' 
    GROUP BY provider_type, provider_name 
    ORDER BY users DESC, session DESC;
    ```

- ratio success/fail 
    ```sql
    SELECT result, count(*) 
    FROM audit_logs 
    WHERE timestamp >= NOW() - INTERVAL '1 hours' 
        AND user_id IS NOT NULL 
    GROUP BY result;
    ```

- Utilisateurs les plus actifs (access success - max limit 5)
    ```sql
    SELECT user_login, COUNT(*) AS access 
    FROM audit_logs 
    WHERE timestamp >= NOW() - INTERVAL '1 hours' 
        AND action = 'access' 
        AND result = 'success' 
    GROUP BY user_login 
    ORDER by access DESC LIMIT 5;
    ```

- Utilisateurs avec le plus d'erreur (auth/access fail)
    ```sql
    SELECT user_login, COUNT(*) AS failure 
    FROM audit_logs 
    WHERE timestamp >= NOW() - INTERVAL '2 days' 
        AND user_id IS NOT NULL 
        AND result = 'fail' 
    GROUP BY user_login 
    ORDER by failure DESC LIMIT 5;
    ```
- Activité par fournisseurs (plus actif au moins actif)
    ```sql
    ```

- Tentative de brute force (unknown_user)
    ```sql
    ```

**Évolution**:
Consolidation des données statistiques effectuée de manière journalière.
> A voir quelle granularité donner (minutes, heure, jours)

Cela est plus pour suivre l'évolution de l'activité
- Nombre d'utilisateurs en place
- Nombre d'IDP en place
- Nombre de SP en place

- Activité
    - authentification réussie|échouée / par IDP|Globale
    - accès réussi|échouée / par SP|Globale

- Utilisateurs actif

- Brute force


