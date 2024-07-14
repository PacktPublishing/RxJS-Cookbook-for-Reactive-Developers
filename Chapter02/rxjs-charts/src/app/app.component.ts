import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipesChartComponent } from './components/recipes-chart/recipes-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RecipesChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-charts';
}
