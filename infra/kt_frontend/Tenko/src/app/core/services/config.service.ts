import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, catchError, shareReplay } from "rxjs";

export interface AppConfig {
    apiUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config$: Observable<AppConfig> | null = null;
    private http = inject(HttpClient);

    loadConfig(): Observable<AppConfig> {
        if (!this.config$) {
            this.config$ = this.http.get<AppConfig>('/assets/config.json').pipe(
                shareReplay(1),
                catchError(() => of({ apiUrl: 'http://localhost:8000 '}))
            );
        }
        return this.config$
    }

    getConfig(): Observable<AppConfig> {
        return this.loadConfig();
    }

}