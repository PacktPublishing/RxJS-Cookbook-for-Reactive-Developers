import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RecipesService } from './services/recipes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-progress-bar';
  progress = 0;

  constructor(private recipeService: RecipesService) {}

  start(): void {
    this.recipeService.postRecipe({ 
      id: 1,
      name: 'Brand New World',
      description: '...',
      ingredients: [],
      image: '...'
    }).subscribe({
      next: (value) => {
        this.progress = value;
      },
      complete: () => {
        this.progress = 100;
      }
    });
  }
}
