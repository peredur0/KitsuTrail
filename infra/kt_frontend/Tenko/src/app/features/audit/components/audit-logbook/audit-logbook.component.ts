import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table' 

import { HeaderService } from '../../../../core/services/header.service';
import { AuditService } from '../../services/audit.service';
import { Observable } from 'rxjs';
import { AuditEntry } from '../../models/audit.model';
import { AuditFilter } from '../../models/filter.model';

@Component({
  selector: 'app-audit-logbook',
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './audit-logbook.component.html',
  styleUrl: './audit-logbook.component.scss'
})
export class AuditLogListComponent implements OnInit {
  private headerService = inject(HeaderService);
  private auditService = inject(AuditService);

  auditLogs$!: Observable<AuditEntry[]>;
  auditFilter?: AuditFilter;

  displayColumns: string[] = [
    'timestamp', 'audit_id', 'action', 'user_login', 'result'
  ];

  ngOnInit(): void {    
    this.headerService.setSubtitle("Journal d'audit")

    this.auditFilter = {
      filter: {
        time_range: {
          start: '2025-05-01 00:00:00',
          end: '2025-05-10 00:00:00'
        }
      }
    }
    this.auditLogs$ = this.auditService.getAuditLogs(this.auditFilter)
  }
}
