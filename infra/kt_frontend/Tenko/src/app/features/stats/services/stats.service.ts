import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";

import { ConfigService } from "../../../core/services/config.service";
import { ChartData, CurrentState, ProvidersActivities, UsersActivities, UsersSummary } from "../models/stats.model";

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);

    getCurrentState(): Observable<CurrentState> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<CurrentState>(`${config.apiUrl}/api/v1/stats/current`)
            )
        );
    }

    getUsersActivity(): Observable<UsersActivities> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<UsersActivities>(`${config.apiUrl}/api/v1/stats/activity/users`)
            )
        );
    }

    getProvidersActivity(): Observable<ProvidersActivities> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<ProvidersActivities>(`${config.apiUrl}/api/v1/stats/activity/providers`)
            )
        );
    }

    getProtocolActivity(): Observable<ChartData> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<ChartData>(`${config.apiUrl}/api/v1/stats/activity/protocols`)
            )
        );
    }

    getFailureActivity(): Observable<ChartData> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<ChartData>(`${config.apiUrl}/api/v1/stats/activity/failure-reasons`)
            )
        );
    }
    
    getUsersSummary(): Observable<UsersSummary[]> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<UsersSummary[]>(`${config.apiUrl}/api/v1/stats/activity/users-summary`)
            )
        );
    }
}