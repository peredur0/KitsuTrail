import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";

import { AuditReply } from "../models/audit.model";
import { AuditFilter } from "../models/filter.model";
import { ConfigService } from "../../../core/services/config.service";

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private http = inject(HttpClient)
    private configService = inject(ConfigService);

    getAuditLogs(filter: AuditFilter): Observable<AuditReply> {
        return this.configService.getConfig().pipe(
            switchMap(config => 
                this.http.post<AuditReply>(`${config.apiUrl}/api/v1/audit/`, filter)
            )
        );
    }
}