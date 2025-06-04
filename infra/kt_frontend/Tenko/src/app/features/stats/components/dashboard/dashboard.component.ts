import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, startWith, Subject, takeUntil, tap, BehaviorSubject, switchMap, forkJoin, merge, catchError, of} from 'rxjs';

import { HeaderService } from '../../../../core/services/header.service';
import { StatsService } from '../../services/stats.service';

import { CurrentStateComponent } from '../current-state/current-state.component';
import { DashboardPageComponent } from '../dashboard-page/dashboard-page.component';
import { DashBoardData } from '../../models/dashboard-data.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CurrentStateComponent,
    DashboardPageComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private headerService = inject(HeaderService);
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
          providersActivity: this.statService.getProvidersActivity()
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
