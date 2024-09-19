import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent implements OnInit {
  progress = 0;

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.recipeService.postRecipe({ 
      id: 1,
      name: 'Brand New World',
      description: '...',
      ingredients: [],
      image: '...'
    }).subscribe({
      next: (value: number) => {
        this.progress = value;
      }
    });
  }

}
