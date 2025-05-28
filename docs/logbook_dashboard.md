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

