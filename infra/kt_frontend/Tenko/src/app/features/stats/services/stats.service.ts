import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { ChartData, CurrentState, ProvidersActivities, UsersActivities, UsersSummary } from "../models/stats.model";

const HOST = 'http://localhost:8000';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private http = inject(HttpClient);

    getCurrentState(): Observable<CurrentState> {
        return this.http.get<CurrentState>(`${HOST}/api/v1/stats/current`);
    }

    getUsersActivity(): Observable<UsersActivities> {
        return this.http.get<UsersActivities>(`${HOST}/api/v1/stats/activity/users`);
    }

    getProvidersActivity(): Observable<ProvidersActivities> {
        return this.http.get<ProvidersActivities>(`${HOST}/api/v1/stats/activity/providers`);
    }

    getProtocolActivity(): Observable<ChartData> {
        return this.http.get<ChartData>(`${HOST}/api/v1/stats/activity/protocols`);
    }

    getFailureActivity(): Observable<ChartData> {
        return this.http.get<ChartData>(`${HOST}/api/v1/stats/activity/failure-reasons`)
    }
    
    getUsersSummary(): Observable<UsersSummary[]> {
        return this.http.get<UsersSummary[]>(`${HOST}/api/v1/stats/activity/users-summary`)
    }
}