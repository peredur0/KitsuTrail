import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartComponent } from "ng-apexcharts";

import { ChartData } from '../../../models/stats.model';
import { PieChartOptions } from '../../../models/chart-options.model';

@Component({
  selector: 'app-pie-failure-reasons',
  imports: [
    ChartComponent
  ],
  templateUrl: './pie-failure-reasons.component.html',
  styleUrl: './pie-failure-reasons.component.scss'
})
export class PieFailureReasonsComponent implements OnChanges {
  @Input() data!: ChartData;

  public chartOptions: PieChartOptions = {
    series: [],
    labels: [],
    title: { text: 'Raison des échecs' },
    chart: {
      height: 320,
      type: 'pie'
    },
    colors: ['#8B0000', '#DC143C', '#FF8C00', '#FFA500']
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartOptions.series = this.data.series[0].data;
      this.chartOptions.labels = this.data.categories;
    }
  }
}
