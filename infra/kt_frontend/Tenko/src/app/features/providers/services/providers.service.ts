import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";

import { Provider } from "../models/providers.model";
import { ConfigService } from "../../../core/services/config.service";

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);

    getProviders(type: 'idp'|'sp'): Observable<Provider[]> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.get<Provider[]>(`${config.apiUrl}/api/v1/providers/${type}`)
            )
        );
    }
}
