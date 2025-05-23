import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator'

import { AuditService } from '../../services/audit.service';
import { AuditEntry, AuditReply } from '../../models/audit.model';
import { AuditFilter } from '../../models/filter.model';
import { AuditColumn } from '../../models/columns.model';

@Component({
  selector: 'app-audit-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './audit-table.component.html',
  styleUrl: './audit-table.component.scss'
})
export class AuditTableComponent implements OnChanges{
  private auditService = inject(AuditService);
  auditReply$!: Observable<AuditReply>;
  entries: AuditEntry[] = [];
  totalItems!: number;
  
  pageSize =  20;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 50];

  
  @Input() auditFilter!: AuditFilter;
  @Input() selectedColumns!: string[];

  columns: AuditColumn<AuditEntry>[] = [
    new AuditColumn('timestamp', 'Date/heure', (e) => new Date(e.timestamp).toLocaleString()),
    new AuditColumn('audit_id', 'Audit ID', 'audit_id'),
    new AuditColumn('user_id', 'ID Utilisateur', 'user_id'),
    new AuditColumn('user_login', 'Login', 'user_login'),
    new AuditColumn('provider_type', 'Type fournisseur', 'provider_type'),
    new AuditColumn('provider_id', 'ID Fournisseur', 'provider_id'),
    new AuditColumn('provider_name', 'Fournisseur', 'provider_name'),
    new AuditColumn('provider_protocol', 'Protocol', 'provider_protocol'),
    new AuditColumn('trace_id', 'Trace', 'trace_id'),
    new AuditColumn('source_ip', 'IP', 'source_ip'),
    new AuditColumn('source_admin', 'Initiateur', 'source_admin'),
    new AuditColumn('category', "Type d'évènement", 'category'),
    new AuditColumn('action', 'Action', 'action'),
    new AuditColumn('result', 'Résultat', 'result'),
    new AuditColumn('reason', 'Raison', 'reason'),
    new AuditColumn('info', "Plus d'info", 'info')
  ];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auditFilter'] && this.auditFilter) {
      this.loadData();
    }
  }

  loadData(): void {
    this.auditFilter.page = this.pageIndex + 1;
    this.auditFilter.per_page = this.pageSize;
    this.auditReply$ = this.auditService.getAuditLogs(this.auditFilter).pipe(
      tap((reply: AuditReply) => {
        this.entries = reply.items;
        this.totalItems = reply.metadata.total_items;
      })
    );
  }

  onPageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}
