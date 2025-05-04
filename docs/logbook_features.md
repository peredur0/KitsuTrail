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

## 2025-05-04 Définition du format de l'audit log
On va réfléchir ici au format de l'audit log ainsi que de son contenu.
On peut logger les actions d'administration et les actions des utilisateurs sur la plateforme.

Imaginons la user story suivante (cf schéma ci dessous):
1. Un utilisateur tente d'accéder à une ressource (SP)
2. Le SP va demander l'autorisation à KT (Plateforme IAM) si l'utilisateur peut accéder au service
3. KT va demander à un fournisseur d'identité (IDP) si l'utilisateur peut s'authentifier
4. KT redirige l'utilisateur vers le moyen d'authentification de l'IDP
5. L'utilisateur s'authentifie sur la page de l'IDP
6. L'IDP donne le résultat à KT.
7. KT donne le résultat au SP
8. Le SP fournis la ressource à l'utilisateur

![./img/user_story_0.jpg](./img/user_story_0.jpg)

On a peut avoir les actions suivantes:
- une requête du SP vers KT (access_request)
- une requête de KT vers l'IDP (authentication_request)
- une réponse de l'IDP vers KT (authentication_reply)
- une réponse de KT vers SP (access_reply)

- création d'un utilisateur
- modification d'un utilisateur
- suppression d'un utilisateur

Les raisons d'un échec peuvent être:
- wrong_password
- user_unknown
- account_locked
- insufficient_rights

Première ébauche de champs:
| nom            | type      | nullable | valeurs possibles          | description                      |
|----------------|-----------|----------|----------------------------|----------------------------------|
| audit_id       | INTEGER   | required | 1                          | identifiant de l'évènement       |
| timestamp      | TIMESTAMP | required | 2025-05-04 15:35:10:000000 | date heure de l'évènement        |
| categorie      | STRING    | required | management, autorisation   | type d'évènement                 |
| correlation_id | STRING    | required | (SHA256)                   | relation entre plusieurs actions |
| action         | STRING    | required | (cf actions)               | évènement logger                 |
| login_id       | STRING    | required | e0e150a4                   | utilisateur concerné             |
| result         | STRING    | required | success, fail              | résultat de l'action             |
| reason         | STRING    | nullable | (cf raisons)               | raison d'un échec                |
| details        | STRING    | nullable | (cf details)               | informations complémentaires     |
| provider_id    | INTEGER   | nullable | 1                          | identifiant du provider          |

Lors de récupération des logs il devrait être possible de faire la liaison avec les infos IDP et SP.
Finalement je pense que la mise en place des provider en base va arriver plus vite que prévue.


