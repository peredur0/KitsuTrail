import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AuditEntry } from "../models/audit.model";

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private http = inject(HttpClient)

    getAuditLogs(): Observable<AuditEntry[]> {
        const filter = {
            filter: {
                time_range: {
                    start: '2025-05-01T00:00:00',
                    end: '2025-05-05T00:00:00'
                },
            },
            page: 1,
            per_page: 20
        };

        return this.http.post<AuditEntry[]>('http://localhost:8000/api/v1/audit', filter)
    }
}