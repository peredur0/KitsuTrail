import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AuditReply } from "../models/audit.model";
import { AuditFilter } from "../models/filter.model";

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private http = inject(HttpClient)

    getAuditLogs(filter: AuditFilter): Observable<AuditReply> {
        return this.http.post<AuditReply>('http://localhost:8000/api/v1/audit/', filter)
    }
}