import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { UsersActivities } from '../../../models/stats.model';

@Component({
  selector: 'app-line-timestamp-auth-access',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './line-timestamp-auth-access.component.html',
  styleUrl: './line-timestamp-auth-access.component.scss'
})
export class LineTimestampAuthAccessComponent implements OnChanges {
  @Input() data!: UsersActivities
  
  public lineChartData!: ChartConfiguration['data']
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: { line: { tension: 0.5 }},
    scales: { y: { position: 'left' }},
    plugins: { legend: { display: true }}
  };

  ngOnChanges(): void {
    if (!this.data) return;
    
    this.lineChartData = {
      datasets: [
        {
          data: this.data.authentications.data,
          label: "Authentifications",
          borderColor: 'rgba(0, 100, 0, 1)',
          backgroundColor: 'rgba(0, 100, 0, 0.2)',
          fill: 'origin'
        },
        {
          data: this.data.access.data,
          label: "Accès",
          borderColor: 'rgba(0, 0, 139, 1)',
          backgroundColor: 'rgba(0, 0, 139, 0.2)',
          fill: 'origin'
        }
      ],
      labels: this.data.labels.data
    };
  }



}
