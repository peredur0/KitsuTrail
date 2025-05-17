import { Component, inject, OnInit } from '@angular/core';

import { HeaderService } from '../../../../core/services/header.service';
import { AuditFilter } from '../../models/filter.model';
import { AuditTableComponent } from '../audit-table/audit-table.component';

@Component({
  selector: 'app-audit-logbook',
  imports: [
    AuditTableComponent
  ],
  templateUrl: './audit-logbook.component.html',
  styleUrl: './audit-logbook.component.scss'
})
export class AuditLogBookComponent implements OnInit {
  private headerService = inject(HeaderService);

  auditFilter!: AuditFilter;
  selectedColumns!: string[];

  ngOnInit(): void {    
    this.headerService.setSubtitle("Journal d'audit")
    this.selectedColumns = ['timestamp', 'action', 'user_login', 'result'];
    this.auditFilter = {
      filter: {
        time_range: {
          start: '2025-05-01 00:00:00',
          end: '2025-05-10 00:00:00'
        }
      }
    };
  }
}
