import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderService } from '../../../../core/services/header.service';
import { AuditService } from '../../services/audit.service';
import { Observable } from 'rxjs';
import { AuditEntry } from '../../models/audit.model';
import { AuditFilter } from '../../models/filter.model';

@Component({
  selector: 'app-audit-log-list',
  imports: [
    CommonModule
  ],
  templateUrl: './audit-log-list.component.html',
  styleUrl: './audit-log-list.component.scss'
})
export class AuditLogListComponent implements OnInit {
  private headerService = inject(HeaderService);
  private auditService = inject(AuditService)

  auditLogs$!: Observable<AuditEntry[]>
  auditFilter?: AuditFilter

  ngOnInit(): void {    
    this.headerService.setSubtitle("Journal d'audit")

    this.auditFilter = {
      filter: {
        time_range: {
          start: '2025-05-01 00:00:00',
          end: '2025-05-10 00:00:00'
        },
        provider_protocol: ['SAML']
      }
    }
    this.auditLogs$ = this.auditService.getAuditLogs(this.auditFilter)
  }
}
