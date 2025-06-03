import { Component } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-providers-success-fail',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './bar-providers-success-fail.component.html',
  styleUrl: './bar-providers-success-fail.component.scss'
})
export class BarProvidersSuccessFailComponent {
  // @Input() data!: ???;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['prov1', 'prov2', 'prov3'],
    datasets: [
      { data: [3, 5, 8], label: 'Success'},
      { data: [4, 2, 0], label: 'Fail'}
    ]
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: true }},
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };
}
