import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderService } from '../../../../core/services/header.service';
import { AuditService } from '../../services/audit.service';
import { Observable } from 'rxjs';
import { AuditEntry } from '../../models/audit.model';

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

  ngOnInit(): void {
    this.headerService.setSubtitle("Journal d'audit")
    this.auditLogs$ = this.auditService.getAuditLogs()
  }
}
