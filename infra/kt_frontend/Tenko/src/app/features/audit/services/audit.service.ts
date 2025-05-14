import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AuditEntry } from "../models/audit.model";
import { AuditFilter } from "../models/filter.model";

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private http = inject(HttpClient)

    getAuditLogs(filter: AuditFilter): Observable<AuditEntry[]> {
        return this.http.post<AuditEntry[]>('http://localhost:8000/api/v1/audit', filter)
    }
}