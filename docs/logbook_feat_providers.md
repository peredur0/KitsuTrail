# Journal de bord

Notes lors du développement de la feature qui doit contenir les services.

## 2025-04-29 Démarrage
J'ai passé pas mal de temps à développer la gestion des utilisateurs, qui n'est toujours pas finie mais est fonctionnelle pour ce que je veux faire.
Maintenant il faut que j'ajoute des providers (IDP et SP).

## 2025-04-30 Mise en place des pseudo providers
Dans un premier temps, j'ai transformé le retour de la liste des providers `getProviders` en retour d'un observable. Cela pour préparer le cas où la liste des providers est également gérer par le backend.

Les composants `identities-list` et `services-list` on été adapté pour récupérer les fournisseurs correspondant (idp ou sp) et de les afficher en passant par un nouveau composant `provider-card`.
Pour le moment l'affichage de chaque fournisseur est un simple paragraphe. Cela sera amélioré par la suite pour coller à la charte graphique du site.

> Prochaine étape avancer sur les traces d'audit
