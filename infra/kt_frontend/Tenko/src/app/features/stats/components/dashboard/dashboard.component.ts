import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderService } from '../../../../core/services/header.service';
import { StatsService } from '../../services/stats.service';

import { CurrentStateComponent } from '../current-state/current-state.component';
import { CurrentState } from '../../models/stats.model';
import { interval, startWith, Subject, takeUntil, tap, BehaviorSubject, switchMap} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    CurrentStateComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private headerService = inject(HeaderService);
  private statService = inject(StatsService);

  private destroy$ = new Subject<void>();
  private currentStateSubject = new BehaviorSubject<CurrentState | null>(null);
  
  currentState$ = this.currentStateSubject.asObservable();

  refreshIntervalMS = 30 * 60 * 1000;

  ngOnInit(): void {
    this.headerService.setSubtitle("Résumé d'activités")

    interval(this.refreshIntervalMS).pipe(
      startWith(0),
      takeUntil(this.destroy$),
      switchMap(() => this.statService.getCurrentState()),
      tap(state => this.currentStateSubject.next(state))
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRefresh(): void {
    this.statService.getCurrentState().subscribe(
      state => {
        this.currentStateSubject.next(state);
      }
    );
  }
}
