import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { UsersSummary } from '../../../models/stats.model';

@Component({
  selector: 'app-table-users-summary',
  imports: [
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './table-users-summary.component.html',
  styleUrl: './table-users-summary.component.scss'
})
export class TableUsersSummaryComponent implements OnChanges{
  @Input() data!: UsersSummary[];

  displayColumns: string[] = ['login', 'authentication', 'access', 'failure', 'events'];
  dataSource = new MatTableDataSource<UsersSummary>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.dataSource.data = this.data;
    }
  }
}
