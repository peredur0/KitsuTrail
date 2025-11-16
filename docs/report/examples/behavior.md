
```ts
export class DashboardComponent implements OnInit, OnDestroy {
  private statService = inject(StatsService);
  private destroy$ = new Subject<void>();

  private refreshTrigger$ = new Subject<void>();

  dashboardDataSubject = new BehaviorSubject<DashBoardData | null>(null);
  dashboardData$ = this.dashboardDataSubject.asObservable(); 

  isLoading$ = new BehaviorSubject<boolean>(false);
  
  refreshIntervalMS = 30 * 60 * 1000;

  ngOnInit(): void {
    this.headerService.setSubtitle("Résumé d'activités")

    const autoRefresh$ = interval(this.refreshIntervalMS).pipe(startWith(0));
    const manualRefresh$ = this.refreshTrigger$.asObservable();

    this.dashboardData$ = merge(autoRefresh$, manualRefresh$).pipe(
      takeUntil(this.destroy$),
      tap(() => this.isLoading$.next(true)),
      switchMap(() => 
        forkJoin({
          currentState: this.statService.getCurrentState(),
          usersActivity: this.statService.getUsersActivity(),
          providersActivity: this.statService.getProvidersActivity(),
          protocolsActivity: this.statService.getProtocolActivity(),
          failureActivity: this.statService.getFailureActivity(),
          usersSummary: this.statService.getUsersSummary(),
        }).pipe(
          catchError(err => {
            console.error(`Error during dashboard loading: ${err}`);
            return of(null);
          })
        )
      ),
      tap(() => this.isLoading$.next(false))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRefresh(): void {
    this.refreshTrigger$.next();
  }
}
```

```html
<ng-container *ngIf="dashboardData$ | async as data">
    <div *ngIf="isLoading$ | async" class="loader">Chargement en cours...</div>
    <div class="dashboard-header">
        <button (click)="onRefresh()">Rafraîchir</button>
        <app-current-state [state]="data.currentState" />
    </div>
    <div class="dashboard-container">
        <app-dashboard-page 
            [usersActivity]="data.usersActivity"
            [providersActivity]="data.providersActivity"
            [protocolsActivity]="data.protocolsActivity"
            [failureActivity]="data.failureActivity"
            [usersSummary]="data.usersSummary"/> 
    </div>
</ng-container>

<ng-container *ngIf="(dashboardData$ | async) === null">
    <div class="error-message">Échec de chargement des données</div>
</ng-container>
```
