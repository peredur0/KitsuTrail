import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartComponent } from "ng-apexcharts";
import { LineChartOptions } from '../../../models/chart-options.model';

import { UsersActivities } from '../../../models/stats.model';

@Component({
  selector: 'app-line-timestamp-auth-access',
  imports: [
    ChartComponent
  ],
  templateUrl: './line-timestamp-auth-access.component.html',
  styleUrl: './line-timestamp-auth-access.component.scss'
})
export class LineTimestampAuthAccessComponent implements OnChanges {
  @Input() data!: UsersActivities;

  public chartOptions: LineChartOptions = {
      series: [],
      chart: {
        height: 400,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: { show: false}
      },
      colors: ["#4B0082", "#00008B"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth"},
      title: {
        text: "Activités utilisateurs des 24 dernières heures",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      markers: { size: 0 },
      xaxis: { categories: [] },
      yaxis: { title: { text: "Évènements" } },
      legend: {
        position: "top",
        horizontalAlign: "center",
        floating: true,
        offsetY: 0,
        offsetX: 0,
      }
    };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartOptions.series = [
        {
          name: "Authentifications",
          data: this.data.authentications.data
        },
        {
          name: "Accès",
          data: this.data.access.data
        }
      ];

      this.chartOptions.xaxis = {
        categories: this.data.labels.data,
        title: { text: 'Date/heure'}
      }
    }
  }
}
