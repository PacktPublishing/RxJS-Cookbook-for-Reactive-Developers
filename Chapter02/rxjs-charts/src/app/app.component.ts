import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipesChartComponent } from './components/recipes-chart/recipes-chart.component';
import { Subscription } from 'rxjs';
import { Message, RecipesService } from './services/recipes.service';
import { Recipe } from './types/recipes.type';

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
