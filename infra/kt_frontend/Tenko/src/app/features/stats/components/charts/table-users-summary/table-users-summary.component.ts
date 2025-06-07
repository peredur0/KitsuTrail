import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UsersSummary } from '../../../models/stats.model';

@Component({
  selector: 'app-table-users-summary',
  imports: [],
  templateUrl: './table-users-summary.component.html',
  styleUrl: './table-users-summary.component.scss'
})
export class TableUsersSummaryComponent implements OnChanges{
  @Input() data!: UsersSummary;

  ngOnChanges(changes: SimpleChanges): void {
    
  }
}
