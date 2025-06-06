import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartComponent } from "ng-apexcharts";

import { ChartData } from '../../../models/stats.model';
import { RadarChartOptions } from '../../../models/chart-options.model';


@Component({
  selector: 'app-radar-protocols',
  imports: [
    ChartComponent
  ],
  templateUrl: './radar-protocols.component.html',
  styleUrl: './radar-protocols.component.scss'
})
export class RadarProtocolsComponent implements OnChanges {
  @Input() data!: ChartData;

  public chartOptions: RadarChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "radar",
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1
      }
    },
    title: { text: "Utilisateur par protocol" },
    stroke: { width: 0 },
    fill: { opacity: 0.4 },
    colors: ["#4B0082", "#00008B"],
    markers: { size: 0 },
    xaxis: {
      categories: []
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartOptions.series = this.data.series;
      this.chartOptions.xaxis.categories = this.data.categories
    }
  }
}
