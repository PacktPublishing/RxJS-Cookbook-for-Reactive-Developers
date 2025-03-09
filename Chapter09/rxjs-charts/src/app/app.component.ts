import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipesChartComponent } from './components/recipes-chart/recipes-chart.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RecipesChartComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-charts';
}
