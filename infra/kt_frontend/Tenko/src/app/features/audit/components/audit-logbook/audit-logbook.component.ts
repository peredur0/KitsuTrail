import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { HeaderService } from '../../../../core/services/header.service';
import { AuditFilter, FilterFormData } from '../../models/filter.model';
import { AuditTableComponent } from '../audit-table/audit-table.component';
import { AuditFilterComponent } from '../audit-filter/audit-filter.component';
import { ColumnsFilterComponent } from '../columns-filter/columns-filter.component';

@Component({
  selector: 'app-audit-logbook',
  imports: [
    AuditTableComponent,
    MatButtonModule
  ],
  templateUrl: './audit-logbook.component.html',
  styleUrl: './audit-logbook.component.scss'
})
export class AuditLogBookComponent implements OnInit{
  private headerService = inject(HeaderService);
  readonly dialog = inject(MatDialog);

  auditFilter!: AuditFilter;

  currentFilter: FilterFormData = {
    actions: [],
    categories: [],
    results: [],
    trace_id: [],
    user_login: [],
    user_id: [],
    provider_name: [],
    provider_type: [],
    provider_protocol: []
  }

  selectedColumns!: string[];
  currentColumns: string[] = ['timestamp', 'action', 'user_login', 'result']

  ngOnInit(): void {    
    this.headerService.setSubtitle("Journal d'audit");
    this.buildColumnsSelection();
    this.buildAuditFilter();
  }

  private buildAuditFilter() {
    const filterData = this.currentFilter;
    this.auditFilter = {
      filter: {
        time_range: {
          start: '2025-05-01 00:00:00',
          end: '2025-05-10 00:00:00'
        },
        action: filterData.actions,
        category: filterData.categories,
        result: filterData.results,
        trace_id: filterData.trace_id,
        user_login: filterData.user_login,
        user_id: filterData.user_id,
        provider_name: filterData.provider_name,
        provider_type: filterData.provider_type,
        provider_protocol: filterData.provider_protocol
      }
    }
  }

  openFilter(): void {
    const dialogRef = this.dialog.open(AuditFilterComponent, {
      data: this.currentFilter
    });

    dialogRef.afterClosed().subscribe((result: FilterFormData | undefined) => {
      if (result) {
        this.currentFilter = result;
        this.buildAuditFilter();
      }
    })
  }

  private buildColumnsSelection () {
    this.selectedColumns = this.currentColumns;
  }

  openColumns(): void {
    const dialogRef = this.dialog.open(ColumnsFilterComponent, {
      data: this.currentColumns
    });

    dialogRef.afterClosed().subscribe((result: string[] | undefined) => {
      if (result) {
        this.currentColumns = result;
        this.buildColumnsSelection();
      }
    })
  }

}
