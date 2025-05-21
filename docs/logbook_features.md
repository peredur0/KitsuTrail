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
| nom         | type      | nullable | valeurs possibles          | description                      |
|-------------|-----------|----------|----------------------------|----------------------------------|
| audit_id    | STRING    | required | (uuid.uuid4())[:8]         | identifiant de l'évènement       |
| timestamp   | TIMESTAMP | required | 2025-05-04 15:35:10:000000 | date heure de l'évènement        |
| categorie   | STRING    | required | management, autorisation   | type d'évènement                 |
| trace_id    | STRING    | required | (uuid.uuid4())[:8]         | relation entre plusieurs actions |
| action      | STRING    | required | (cf actions)               | évènement logger                 |
| user_id     | STRING    | nullable | e0e150a4                   | utilisateur concerné             |
| result      | STRING    | required | success, fail              | résultat de l'action             |
| reason      | STRING    | nullable | (cf raisons)               | raison d'un échec                |
| details     | STRING    | nullable | (cf details)               | informations complémentaires     |
| provider_id | INTEGER   | nullable | 1                          | identifiant du provider          |

Lors de récupération des logs il devrait être possible de faire la liaison avec les infos IDP et SP.
Finalement je pense que la mise en place des provider en base va arriver plus vite que prévue.

Les providers sont maintenant gérés directement depuis la base de données.
On a simplement ajouter des requêtes GET niveau API pour gérer la récupération des providers.

J'ai également préparé la table d'audit.
En utilisant les utilisateurs actuellement créé, on a commencé à remplir la base d'audit.
Maintenant je dois trouver un moyen de remplir cette table avec des activités.

Avec le schéma actuel, je vois les éléments suivant:
- les events `access_request` seront toujours en success
- les events `access_reply` peuvent échouer dans les cas suivants:
    * unknown_user              (inconnu dans KT)
    * account_locked            (bloqué dans KT)
    * missing_rights            (manquant dans KT)
    * (authentication_failed)   (échec avec IDP => découle d'`authentication_reply`)
    * authentication_timeout    (absence de `authentication_reply`)
- les events `authentication_request` seront toujours en success
- les events `authentication_reply peuvent échouer dans les cas suivants:
    * unknown_user              (inconnu coté IDP)
    * account_locked            (bloquer coté IDP)
    * wrong_credentials         (mauvais password)
    * missing_rights            (configuration IDP)
    * timeout                   (pas de réponse de l'utilisateur)

> Il faut maintenant faire un script qui va prendre en compte ces cas et les users/providers présent en base pour avoir quelque chose de cohérent.

## 2025-05-05 Réflexion sur le format des audit logs
Je pense que le format de l'audit log de management est bon.
Cependant, le niveau de détail pour la phase d'accès est trop important.
Les logs que j'ai proposé ressemblent plus à des logs applicatifs qu'à des logs d'audit.

Il faudrait aussi que toutes les informations soient présentes même si un IDP ou un utilisateur sont supprimé.
Par exemple on doit être en mesure de connaître l'utilisation d'un login, même si l'utilisateur a été créé puis supprimé.

Après réflexion, je pense partir sur les champs suivants:

| nom               | type      | nullable | valeurs possibles          | description                      |
|-------------------|-----------|----------|----------------------------|----------------------------------|
| timestamp         | TIMESTAMP | required | 2025-05-04 15:35:10:000000 | date heure de l'évènement        |
| audit_id          | STRING    | required | (uuid.uuid4())[:8]         | identifiant de l'évènement       |
| user_id           | STRING    | nullable | e0e150a4                   | utilisateur concerné             |
| user_login        | STRING    | nullable | triss.merigold             | login de l'utilisateur           |
| provider_type     | STRING    | nullable | idp, sp                    | type de provider                 |
| provider_id       | INTEGER   | nullable | 1                          | identifiant du provider          |
| provider_name     | STRING    | nullable | Kitsu SSO                  | nom d'affichage du provider      |
| provider_protocol | STRING    | nullable | SAML, OIDC, ...            | protocol utilisé                 |
| trace_id          | STRING    | required | (uuid.uuid4())[:8]         | relation entre plusieurs actions |
| source_ip         | STRING    | nullable | 145.168.154.1              | source de la requête             |
| source_admin      | STRING    | nullable | system                     | admin à la source de l'event     |
| category          | STRING    | required | management, autorisation   | type d'évènement                 |
| action            | STRING    | required | (cf actions)               | évènement journalisé             |
| result            | STRING    | required | success, fail              | résultat de l'action             |
| reason            | STRING    | nullable | (cf raisons)               | raison d'un échec                |
| info              | STRING    | nullable | (cf info )                 | informations complémentaires     |

**catégories/actions**:
- management
    * create_user, update_user, delete_user
- autorisation:
    * authentification - action auprès d'un IDP
    * access - action auprès d'un SP
    * logout - action auprès d'un IDP ou d'un SP

**results/reasons**:
- success
- fail:
    * unknown_user
    * account_locked
    * permission_denied
    * timeout
    * wrong_credentials

Il va falloir reprendre la table avec ces inputs

La table a été reprise, j'ai également ajouté la création des IDP et SP dans les logs d'audit. 
Maintenant je dois ajouter des activités à ces utilisateurs.

## 2025-05-06 Préparation des cas utilisateurs
La préparation des audits log pour l'activité des utilisateurs va comprendre plusieurs scenarii.

Rappel des `action` de la catégorie `autorisation`:
* *authentication* - action sur un IDP
* *access* - action sur un SP

`result`: *success* | *fail*

`reason` quand l'action fail:
* *unknown_user*
    * access seul > info = user inconnu dans KT
    * authentication (F) + access (F) > info = user unknown dans l'IDP
    * authentication (T) + access (F) > info = user unknown dans le SP

* *locked*
    * access seul > info = locked dans KT
    * authentication (F) + access (F) > info = user locked dans l'IDP
    * authentication (T) + access (F) > info = user locked dans le SP

* *timeout*
    * authentication (F) + access(F) > info = no user did not authenticate

* *permission_denied*
    * authentication (F) + access (F) > blocage IDP > info = IDP: detail dans info
        * *details*
            * role_missing
            * group_missing
            * attribut_mismatch
            * wrong_credentials
    * authentication (T) + access (F) > blocage SP > info = SP: detail dans info
        * *details*
            * role_missing
            * group_missing
            * attribut_mismatch


Voici les spécifications:
- Les premières actions commencent après la création de l'utilisateur ou du provider
- L'échec de l'authentification entraîne l'échec de l'accès, la reason et l'info ruissellent sur le logs d'accès
- Le trace_id lie une authentification avec plus demande d'accès (simulation de session)
- Si un access log est seul c'est que le blocage ou l'erreur est intervenue sur KT
- Même si une authentification est réussie, l'accès au SP peut échouer
- Pic de connexion à 8h et 13h
- Activité majoritaire entre 7h et 18 les jours de semaine
- Activité limitée le week end

Cas à générer:
1. auth OK - access_1 OK
2. auth OK - access_1 OK, access_2 NOK, ..., access_x OK (timeframe 5 minutes)
3. auth OK - access_1 NOK
5. access NOK
6. auth NOK - access_1 NOK

Pour faciliter la génération des logs j'ai organisé un peu mieux les modules dans la parte bdd sqlite.

Il me reste à traiter uniquement le cas ou l'accès échoue directement parce que l'utilisateur n'existe pas ou est bloqué sur la plateforme.

## 2025-05-09 Fin de la génération d'activité
Au bout de plusieurs jours de réflexion, j'ai enfin terminer le travail sur la génération automatique d'activité pour les traces d'audit.

Dans une premier temps, j'ai rapproché les créations d'utilisateurs, de plusieurs années à quelques mois.
Pour la partie développement c'est amplement suffisant.

L'initialisation de la table d'audit se déroule en plusieurs temps:
1. Génération des logs de création des utilisateurs, avec la date created_at dans la table user
2. Génération des logs de création de providers
    Le premier provider est systématiquement créé à minuit la veille de la création du premier utilisateur.
    Cela permet d'éviter des incohérences avec un SP utilisé avant sa création.
    J'ai ajouté un delta de 30 minutes entre chaque nouvelle création. Techniquement aucun provider ne sera créé après le premier utilisateur
3. Génération des logs d'activité par utilisateur
    - L'activité de chaque utilisateur commencera 1 minute après sa création (created_at)
    - La fréquence d'activité devrait être plus forte en jours de semaine entre 6h et 10h et entre 13h et 15h. Une activité toutes les 1 à 5 minutes contre toutes les 1 à 3 heures hors de ces période. Cela devrait simuler une activité de travail journalière et hebdomadaire.
    - Il y a 3 chances sur 5 que l'authentification se passe bien.
4. Génération de logs de monitoring
    - Il arrive parfois que des clients souhaitent monitoring la présence du service d'authentification en utilisant des comptes inconnu à interval régulier. Il y a donc 3 user_inconnu de la plateforme que tentent une authentification toutes les 5 minutes

Dans tous les cas, la génération d'activité ne va pas plus loin que le moment où le processus a été lancé.

> Prochaine étape, développer la partie API pour la récupération des données d'audit. Je peux éventuellement penser à ajouter un module de stats dans l'API

## 2025-05-12 Accès aux audit long depuis l'API
Pour pouvoir accéder aux log d'audit depuis l'interface graphique il va falloir développer le endpoint correspondant.

La recherche doit être possible selon les index mis en place dans la base. On pourra alors chercher sur les champs suivants:
- timestamp: entre 2 dates heures
- *Valeurs dans une liste*:
    - category
    - trace_id
    - action
    - result
    - user_id
    - provider_id
    - provider_name
    - provider_type
    - provider_protocol
Si présent chaque field sera ajouter avec un AND dans le WHERE de la requête SQL. Afin de limiter également les résultats je pense ajouter les informations limit et offset pour tenter de gérer la pagination mais en optionnel.

Pour celui là, je pense utiliser des informations de requêtes dans le body en json, qui aura a peut près cette forme
```json
{
    "filter": {
        "time_range": {
            "start": "YYYY-MM-DD HH:MM:SS",
            "end": "YYYY-MM-DD HH:MM:SS",
        },
        "category": ["autorisation"],
        "provider_protocol": ["SAML", "OIDC"]
    },
    "per_page": 50,
    "page": 2,
} 
``` 
Cela va donner la requête SQL suivante
```sql
SELECT
    *
FROM 
    audit_logs
WHERE
    timestamp >= "YYYY-MM-DD HH:MM:SS" AND  -- start
    timestamp <= "YYYY-MM-DD HH:MM:SS" AND  -- end
    category in ("autorisation") AND
    provider_type in ("SAML", "OIDC")
LIMIT 50
OFFSET 100 -- per_page * page
```

Notes:
- Il faudra que je fasse attention à la gestion de la casse.

Petit détail pour l'utilisation d'un ORM via SQLAlchemy, il faut obligatoirement une clé primaire, le grand gagnant est audit_id.

La partie récupération des audits backend est terminée.
J'ai majoritairement utilisé le BaseModel de `pydantic` pour construire les objets.
Cet outil semble assez puissant pour ajouter une vérification de type et la construction d'objet avec des schéma de données bien définissable.

Prochaine étape récupérer la liste des audit log dans l'interface graphique.

## 2025-05-13 Affichage des logs dans le Tenko (front)
La récupération des logs d'audit reprend les principes déjà mis en place pour la récupération des users et des providers.

Pas de nouveauté de ce point de vue.

Pour le moment le filtre est complètement intégrer dans la requête de base.
La prochaine étape sera de faire en sorte que ce filtre soit plus personnalisable.

## 2025-05-14 Généralisation du filtre des log d'audit
Pour le filtre, j'ai pu convertir les modèles du backend en interface pour le front.

Prochaine étape faire le tableau, je pense que je vais utiliser le composant table de material/@angular
[https://material.angular.dev/components/table/overview](https://material.angular.dev/components/table/overview)

Le tableau a été réalisé de manière complètement statique.
J'ai eu un peu de mal à utiliser mon observable comme source de données pour le tableau.
`[dataSource]` de `mat-table` n'accepte pas les tableaux vides. Par définition un observable est d'abord vide.
La solution est de s'abonner à l'observable dans le html avec async et un as le tout encapsuler avec un ngIf.
```     
<ng-container *ngIf="auditLogs$ | async as auditLogs">
```     

J'ai pu uniformiser le format d'affichage des timestamp avec DatePipe.

## 2025-05-15 Réflexion sur les tableaux
Techniquement, j'aimerais pouvoir ajouter un tableau d'activités dans la page de chaque utilisateur et de chaque provider.
Pour le tableau dans le Journal d'audit, j'aurais besoin d'ajouter:
- une gestion des dates/heures
- la définition des filtres
- contrôle de la pagination
- affichage de certaines colonnes

De base, `@angular/material` permet d'utiliser une source `MatTableDataSource` qui pour permettre de gérer facilement les filtres, et la pagination.
Mais pour ce faire il faut charger l'ensemble des données. Dans notre cas, on gère ces éléments dans le backend. 
Ca ne marche dont pas pour nous ici.

J'ai vu qu'il est possible de gérer dynamiquement l'affichage des colonnes via une boucle for.
A ce stade, je réfléchis comment déléguer les opérations du tableau à un module dédié et réutilisable.
Je peux éventuellement utiliser les services et les signaux pour faire passer les informations des modules vers le tableau.

##  2025-05-17 Travail sur le tableau
Le tableau d'audit a été déplacé dans son propre composant.
En argument il va prendre le filtre à appliquer ainsi que les colonnes à afficher. Ces éléments seront géré directement dans les composants appelant le tableau.

Autre modification majeure. Maintenant le tableau contient toutes les colonnes retournées par l'appel API. Elles sont toutes initialisées via une boucle for mais seules celles dont l'id est dans selectedColumns sera affichée.

Dans le cas de changement de champs cela implique de modifier `columns` dans `audit-table.component.ts`.

## 2025-05-20 Mise en place de la sélection du filtre (journal d'audit)
La session de travail a porté sur la mise en place d'un filtre coté frontend dans la page du journal d'audit.
Le but était de permettre à un utilisateur de sélectionner des filtres via l'interface et de mettre à jour le tableau des logs en fonction.

La page parente est dans `audit-logbook.component.ts` où on avait déjà ajouté 2 boutons (Filtres & Colonnes).
Ici les actions se portent que sur Filtres. Mais le même principe sera appliquer pour Colonnes.

Le bouton Filter déclenche l'ouverture d'un `dialog` contenant le formulaire `audit-filter.component.ts`.
A la fermeture du formulaire on récupère les nouvelles valeurs et on met à jour le filtre.
Le filtre est passé en input au composant dans `audit-table.component.ts`. Ce composant écoute les changement du filtre pour refaire si besoin la requête au backend.
Temps que l'utilisateur est sur le journal d'audit, on conserve la valeur du filtre appliqué et on le redonne au formulaire pour afficher les paramètres courants.

Au niveau du code ça donne les éléments suivants.

Dans `audit-logbook.component.ts`:
```typescript
export class AuditLogBookComponent implements OnInit{
  //...
  readonly dialog = inject(MatDialog);

  auditFilter!: AuditFilter;

  currentFilter: FilterFormData = {     // Interface FilterFormData dédiée pour les valeurs du formulaire
    actions: [],                        // filtre vide
    categories: []                      // ajouter dessous les nouveaux champs à filtrer
  }
  //...
  ngOnInit(): void {    
    //...
    this.buildAuditFilter();    // Initialisation du filtre vide au démarrage
  }

  private buildAuditFilter() { // Fonction pour la construction du filtre
    const filterData = this.currentFilter;
    this.auditFilter = {
      filter: {
        time_range: {
          start: '2025-05-01 00:00:00',
          end: '2025-05-10 00:00:00'
        },
        action: filterData.actions,
        category: filterData.categories
      }
    }
  }

  openFilter(): void {
    const dialogRef = this.dialog.open(AuditFilterComponent, {
      data: this.currentFilter  // Envoi des paramètres du filtres présent à dialog
    });

    dialogRef.afterClosed().subscribe((result: FilterFormData | undefined) => {
      if (result) {     // Récupération des résultat à la fermeture du formulaire
        this.currentFilter = result;
        this.buildAuditFilter()
      }
    })
  }
}
```

Dans `filter.model.ts`:
```typescript
export interface FilterFormData {
    actions: string[];
    categories: string[]; // ajouter dessous les nouveaux champs à filtrer
}
```

Dans `audit-filter.component.ts`:
```typescript
export class AuditFilterComponent implements OnInit{
  filterForm!: FormGroup;
  availableActions = ['access', 'authentication', 'create_user'];
  availableCategories = ['autorisation', 'management'];
  
  readonly dialogRef = inject(MatDialogRef<AuditFilterComponent>);
  private formBuilder = inject(FormBuilder);
  private filterData: FilterFormData | null = inject(MAT_DIALOG_DATA); // Récupération du currentFilter

  ngOnInit(): void {
    this. filterForm = this.formBuilder.group({
      actions: [this.filterData?.actions ?? []],        // Initialisation des valeurs (currentFilter)
      categories: [this.filterData?.categories ?? []]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFilter(): void {
    const actions = this.filterForm.get('actions')?.value;
    const categories = this.filterForm.get('categories')?.value;
    this.dialogRef.close({      // Retourner les données à la page parente
      actions: actions,
      categories: categories
    });
  }

  onReset(): void {
    this.filterData = null;     // vider filter data
    this.filterForm.reset();    // Reset le formulaire
    this.dialogRef.close({      // Retourner les données à l'appelant
      actions: [],
      categories: []
    });
  }
}
```

Pour rappel, le filtre dans `audit-table.component.ts` est utilisé dans un `ngOnChanges` qui va réagir aux changements de la valeur d'auditFilter
```typescript
export class AuditTableComponent implements OnChanges{
  private auditService = inject(AuditService);
  auditLogs$!: Observable<AuditEntry[]>;
  
  @Input() auditFilter!: AuditFilter
  //...
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auditFilter'] && this.auditFilter) {
      this.auditLogs$ = this.auditService.getAuditLogs(this.auditFilter)
    }
  }
}
```

Initialement, je n'avais pas prévu de mettre en place un filtre sur les catégories, mais l'ajouter m'a permis de me rendre compte de toutes les modifications à mettre en oeuvre dans ce cas.
- Frontend - `audit-filter`:
    - hmtl: `form-field`
    - ts: `filterForm`
    - ts: fonctions appelées par les boutons
- Frontend - `audit-logbook`:
    - ts: `currentFilter`
    - ts: `buildFilter`
- Frontend - `filter.models`:
    - ts: `FilterFormData`
- Backend - `models`:
    - py: `QueryFilter`
- Backend - `audit`:
    - py: `FILTER_FIELDS`


Prochaines étapes: 
1. Mettre en place le filtering pour tous les champs avec index
2. Permettre la sélection des colonnes
3. Gérer la pagination
