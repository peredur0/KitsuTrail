import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartComponent } from "ng-apexcharts";

import { ActivitiesResults } from '../../../models/stats.model';
import { BarChartOptions } from '../../../models/chart-options.model';

@Component({
  selector: 'app-bar-providers-success-fail',
  imports: [
    ChartComponent
  ],
  templateUrl: './bar-providers-success-fail.component.html',
  styleUrl: './bar-providers-success-fail.component.scss'
})
export class BarProvidersSuccessFailComponent implements OnChanges {
  @Input() title!: string;
  @Input() data!: ActivitiesResults;

  public chartOptions: BarChartOptions = {
    title: {
      text: '',
      align: "left"
    },
    series: [],
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: { position: "top" }
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -15,
      style: {
        fontSize: "12px",
        colors: ["#fff"]
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"]
    },
    xaxis: {
      categories: []
    },
    colors: ["#006400", "#8B0000"]
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title'] && this.title) {
      this.chartOptions.title.text = `Success/Fail: ${this.title}`;
    }
    if (changes['data'] && this.data){
      this.chartOptions.series = [
        {
          name: "Success",
          data: this.data.success.data
        },
        {
          name: "Failure",
          data: this.data.failure.data
        }
      ];

      this.chartOptions.xaxis = {
        categories: this.data.labels.data
      }
    }
  }
}
