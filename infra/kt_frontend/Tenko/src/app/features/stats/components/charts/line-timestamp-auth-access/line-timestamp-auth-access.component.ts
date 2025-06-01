import { Component } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-timestamp-auth-access',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './line-timestamp-auth-access.component.html',
  styleUrl: './line-timestamp-auth-access.component.scss'
})
export class LineTimestampAuthAccessComponent {

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [1, 2, 3, 4, 5],
        label: "Authentifications",
      },
      {
        data: [5, 4, 3, 2, 1],
        label: "Accès",
      }
    ],
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: { tension: 0.5 }
    },
    scales: {
      y: {position: 'left'}
    },
    plugins: {
      legend: { display: true }
    }
  };


}
