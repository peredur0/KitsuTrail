import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { CurrentState, ProvidersActivities, UsersActivities } from "../models/stats.model";

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private http = inject(HttpClient);

    getCurrentState(): Observable<CurrentState> {
        return this.http.get<CurrentState>('http://localhost:8000/api/v1/stats/current');
    }

    getUsersActivity(): Observable<UsersActivities> {
        return this.http.get<UsersActivities>('http://localhost:8000/api/v1/stats/activity/users');
    }

    getProvidersActivity(): Observable<ProvidersActivities> {
        return this.http.get<ProvidersActivities>('http://localhost:8000/api/v1/stats/activity/providers');
    }
}