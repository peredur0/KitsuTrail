import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Provider } from "../models/providers.model";

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {
    private http = inject(HttpClient);

    getProviders(type: 'idp'|'sp'): Observable<Provider[]> {
        return this.http.get<Provider[]>(`http://localhost:8000/api/v1/providers/${type}`)
    }
}
