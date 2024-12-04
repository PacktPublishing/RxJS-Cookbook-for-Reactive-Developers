import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChartOptions } from '../../types/chart.type';
import { Message, RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-recipes-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './recipes-chart.component.html',
  styleUrl: './recipes-chart.component.scss',
})
export class RecipesChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ChartComponent, { static: false }) chart!: ChartComponent;

  public chartOptions = {} as ChartOptions;
  public orders: number[] = [];

  constructor(private recipesService: RecipesService) {
    this.chartOptions = {
      series: [
        {
          name: 'Sales',
          data: [],
        },
      ],
      chart: {
        type: 'line',
        height: 350,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: 'Recipe Order Trends by Month',
        align: 'left',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    };
  }

  ngOnInit() {
    this.recipesService.connect();    
  }

  ngAfterViewInit(): void {
    this.recipesService.orders$.subscribe((message: Message) => {
      this.orders = [...this.orders, ...message.payload];
      this.chart.updateSeries([{
        name: 'Orders',
        data: this.orders,
      }]);
    });
  }

  ngOnDestroy() {
    this.recipesService.close();
  }
}
