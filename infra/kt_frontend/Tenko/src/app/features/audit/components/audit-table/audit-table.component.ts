import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';

import { AuditService } from '../../services/audit.service';
import { AuditEntry } from '../../models/audit.model';
import { AuditFilter } from '../../models/filter.model';
import { AuditColumn } from '../../models/columns.model';

@Component({
  selector: 'app-audit-table',
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './audit-table.component.html',
  styleUrl: './audit-table.component.scss'
})
export class AuditTableComponent implements OnChanges{
  private auditService = inject(AuditService);
  auditLogs$!: Observable<AuditEntry[]>;
  
  @Input() auditFilter!: AuditFilter
  @Input() selectedColumns?: string[] = [
    'timestamp', 'audit_id', 'action', 'user_login', 'result'
  ];

  columns: AuditColumn<AuditEntry>[] = [
    new AuditColumn('timestamp', 'Date', (e) => new Date(e.timestamp).toLocaleString()),
    new AuditColumn('audit_id', 'Audit ID', 'audit_id'),
    new AuditColumn('user_id', 'User ID', 'user_id'),
    new AuditColumn('user_login', 'Login', 'user_login'),
    new AuditColumn('provider_type', 'Provider type', 'provider_type'),
    new AuditColumn('provider_id', 'Provider id', 'provider_id'),
    new AuditColumn('provider_name', 'Provider name', 'provider_name'),
    new AuditColumn('provider_protocol', 'Protocol', 'provider_protocol'),
    new AuditColumn('trace_id', 'Trace', 'trace_id'),
    new AuditColumn('source_ip', 'IP', 'source_ip'),
    new AuditColumn('source_admin', 'Requester', 'source_admin'),
    new AuditColumn('category', 'Event category', 'category'),
    new AuditColumn('action', 'Action', 'action'),
    new AuditColumn('result', 'Result', 'result'),
    new AuditColumn('reason', 'Reason', 'reason'),
    new AuditColumn('info', 'More info', 'info')
  ];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auditFilter'] && this.auditFilter) {
      this.auditLogs$ = this.auditService.getAuditLogs(this.auditFilter)
    }
  }
}
