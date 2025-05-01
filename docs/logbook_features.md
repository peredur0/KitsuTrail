# Journal de bord

Notes lors du développement de la feature qui doit contenir les services.

## 2025-04-29 Démarrage (Providers)
J'ai passé pas mal de temps à développer la gestion des utilisateurs, qui n'est toujours pas finie mais est fonctionnelle pour ce que je veux faire.
Maintenant il faut que j'ajoute des providers (IDP et SP).

## 2025-04-30 Mise en place des pseudo providers (Providers)
Dans un premier temps, j'ai transformé le retour de la liste des providers `getProviders` en retour d'un observable. Cela pour préparer le cas où la liste des providers est également gérer par le backend.

Les composants `identities-list` et `services-list` on été adapté pour récupérer les fournisseurs correspondant (idp ou sp) et de les afficher en passant par un nouveau composant `provider-card`.
Pour le moment l'affichage de chaque fournisseur est un simple paragraphe. Cela sera amélioré par la suite pour coller à la charte graphique du site.

> Prochaine étape avancer sur les traces d'audit

## 2025-05-01 Démarrage (Audit log)
Activation du bouton pour l'accès au journal d'audit.
Puis préparation des routes et du composant qui va accueillir la liste des traces d'audit.

J'ai également ajouter un bouton Reports dans la partie traitement des données qui restera désactiver. C'est juste pour garder une trace de cette fonctionnalité.

Je dois maintenant réfléchir au format de ces traces. Pour le moment je pars sur un tableau pour l'affichage.

Pour cette feature, je vais à nouveau travailler avec le backend.
