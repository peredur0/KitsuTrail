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

Pour ce projet j'utilise également des plateformes d'IA générative (chatGPT & MistralAI) pour effectuer des recherches ou accélérer le processus de debugging. Aucun code généré par ces plateformes n'est inséré tel quel dans le code.

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

**Mise en place de l'architecture et des premiers composant**
- core: répertoire pour les modules de base de l'application
  - components
    - header: entête du site
    - landing-page: page d'accueil
    - sidebar: barre de navigation latérale
- features: répertoire des fonctionnalités de l'app
  - users: composant spécialisé dans la gestion des utilisateurs
    - components
      - users-list: liste des utilisateurs

L'ajout du composant user-list va simplement permettre de vérifier la bonne configuration du routing dans cette phase.
Je garde aussi cette page comme exemple de lazy-loading pour plus tard.
Les guards ne sont pas en place pour le moment.

**Mise en forme globale**
Préparation CSS des 3 éléments principaux de l'affichage.
1. Barre latérale
  * Mise en forme du header avec l’icône, un titre et un sous-titre
  * Préparation liens et des menus déroulants
  * Mise en place d'un pied de page qui va contenir le nom de l'utilisateur
2. Entête
  * Elle va servir à transmettre des informations à l'utilisateur
3. Contenant principal
  * c'est la que les actions de l'utilisateur vont se dérouler.

Le favicon a également été changé.

Le logo et le favicon ont été généré par IA (voir plus haut), des modifications mineures, principalement de la transparence, ont été réalisées avec GIMP.

> Fin de travail:
> Prochaine étape gérer les menus déroulants de la barre latérale


## 2025-04-24 - Travail sur la barre latérale
L'idée est d'ajouter des menus retractable dans le sidebar.
Le module Angular Material offre cette possibilité [https://material.angular.io/](https://material.angular.io/)
```
ng add @angular/material
```
Documentation sur les expansion panel : [https://material.angular.io/components/expansion/overview](https://material.angular.io/components/expansion/overview)

La mise en place des menu retractable est assez simple.
Tout comme la modification des éléments graphique.
L'installation du module va ajouter des données dans le fichier style global. Il est alors possible de faire un override dans le CSS du component.

J'ai ajouté des liens fictifs afin de donner un peu de corps à la barre latérale.

> **Difficultés**:
> 1. Je ne suis pas parvenue à gérer correctement l'espacement entre le header du menu retractable et le premier item de la liste en dessous
> 2. Le div central de la sidebar n'est pas scrollable. Sur des fenêtres petites certains menu peuvent se retrouver masqués

Résultat en image:

![Barre latérale](./img/20250324_sidebare.png)


> Le travail de ce jour a été principalement HTML et CSS et uniquement sur la barre latérale. Demain on vas essayer de construire la page d'accueil ou la gestion des utilisateurs


## 2025-03-25 - Travail sur la page d'accueil et le header
- Renommage du répertoire Angular de KitsuTrail en Shiro (blanc)
- Préparation du nom du backend (Kuro)

Actions sur la page d'accueil:
- Mise en place de boite et des boutons qui vont être utilisée pour permettre de se rendre sur les pages de l'application

## 2025-03-26 Amélioration du code de la page d'accueil
- Mise en place d'un service unique pour gérer l'affichage et la présence des menus dans la sidebar et la landing-page.
> Prochaine étape utiliser ce service dans l'affichage avec des ngFor et ngIf. L'objectif est d'avoir un code le plus modulaire possible

Les menus de la landing page sont maintenant beaucoup plus modulaires.
Les propriétés de chaque menu sont maintenant gérées dans un service.
L'affichage se fait avec une boucle @for dans le template html.
Selon la propriété display du menu je suis capable d'afficher ou non un menu avec l'instruction @if.
J'ai également utiliser l'instruction *ngFor dans une balise article pour s'occuper de l'affichage des boutons.

Je dois maintenant appliquer du CSS sur ces boutons.

L'étape d'après sera de remplacer le code statique dans la sidebar.
Le code statique de la sidebar a été replacé par la version modulaire.
Les menus et la forme des liens sont maintenant gérés de manière centralisée via le service *menu.service*.
Il est possible de masquer complètement un menu en jouant sur la propriété *display*.
La propriété *disabled* de liens va voir une action via sur le CSS.

Le résultat à ce stade est:
![landing page](./img/20250326_landing.png)

> Prochaine étape gérer le header pour qu'il affiche un texte particulier selon la page sur laquelle se trouve l'utilisateur.

## 2025-03-27 Travail sur le header
Le but est de modifier le header dynamiquement en fonction de la page sur laquelle l'utilisateur se trouve.
Pour ce faire j'ai décidé d'utiliser les signaux.
> Cela va demander d'ajouter le service gérant les signaux dans tous les composants.

Documentation sur laquelle je me suis appuyé:
- [https://angular.dev/guide/signals](https://angular.dev/guide/signals)
- [https://angular.dev/essentials/signals](https://angular.dev/essentials/signals)
- [https://angular.dev/essentials/templates](https://angular.dev/essentials/templates)
- [https://angular.fr/signals/](https://angular.fr/signals/)

Pour une meilleure scalabilité, je vais essayer d'ajouter la récupération de l'url pour déterminer à partir du service menu quels éléments sont à afficher.

une piste : 

## 2025-03-28 Travail sur la location
En utilisant la méthode location.back(), j'ai pu ajouter un bouton retour dans le Header.
J'ai du faire une petite manipulation pour que le retour reste quand même sur l'application, en utilisant la propriété `window.history.length`.

Pour le moment je suis capable d'afficher le path courant, mais je dois importé le module location dans tous les composants dans lequel je souhaite l'utiliser.
J'aimerais pouvoir utiliser cette capacité pour modifier dynamiquement le contenu du header.
Le titre dans le header devrait être le nom de section (Gestion des utilisateur) en fonction des valeurs MenuService.
Le sous titre par contre pourra être codé en dur dans la page ou être variable selon le contenu (informations utilisateur).

Quelques ressources de cette partie:
- [https://angular.fr/routing/location](https://angular.fr/routing/location)
- [https://angular.dev/api/common/Location](https://angular.dev/api/common/Location)


La mise en page globale est en place pour le header.

Je n'ai pas réussi à terminer complètement le traitement du path courant.
Je continuerais demain

## 2025-03-29 Travail pour le dynamisme des pages
Aujourd'hui on va essayer de faire passer la page courante dans le setTitle du header pour récupérer la première page qui correspond à la section (users/Fournisseurs, Data)

J'ai utilisé les snapshots de ActivatedRoute.
J'ai pu tester l'utilisation de la fonction de mise à jour du header au sein de page principale des utilisateurs.
Vu que cette page est lancée en lazy-loading, il est nécessaire de passer par pathFromRoot[].

L'idée maintenant est d'exporté les instructions de modification du header dans une fonction de service dédiée.
Je vais déporté ces instructions dans le service du header.

En définitive, je pense déporter toute l'execution de la mise à jour du header dans le header et laisser chaque module définir éventuellement un sous titre.
Je regarde cette documentation pour le moment
- [https://angular.fr/routing/input-binding](https://angular.fr/routing/input-binding)

Finalement, je passe par une subscription sur les évènements de router directement dans le TS du header.
Je récupère l'URL final après la fin des opérations de navigation.

A ce stade, les titres affichés dans le Header sont totalement autonomes.
Je laisse la modification du sous titre dans chaque composant.
Cette opération utilise les signaux.

> A faire un petit résumé des solutions mises en place.

## 2025-03-30 Rédaction d'un bilan d'étape
Voir [20250330_front.md](./progress_summary/20250330_front.md).

**Prochaine étape**: Préparer le POC pour la gestion des utilisateurs et des fournisseurs avant la mise en place d'un backend.


## 2025-03-31 Mise en place des utilisateurs
Début de l'implémentation des utilisateurs.
- Création d'une classe User pour définir les attributs utilisables.
- Création d'un service pour gérer la liste des utilisateurs
- Ajout de quelques utilisateurs en dur dans le service
- Mise en place d'une méthode pour la récupération par id ou par login

Les utilisateurs ont pour le moment les attributs suivants:
- id: version tronquée d'un UUID (généré à la création)
- createdAt: date de création (généré à la création)
- firstname: prénom
- lastname: nom de famille
- login: str
- email: information optionnelle

2 méthodes pour set l'email: setEmail & withEmail.

## 2025-04-01 Travail sur les utilisateurs
Ajout d'une méthode pour normaliser l'affichage du nom d'affichage.

L'affichage de la liste des utilisateurs sera fait sous forme de cartes.
Peut être en présentant une photo de profil.
Je prévois également de rajouter une barre de recherche et des filtres.

Chaque utilisateur aura également sa propre page avec les informations relatives à son profil.