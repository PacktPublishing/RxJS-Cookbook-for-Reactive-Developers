import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { Recipe, RecipeDetails } from '../../types/recipes.type';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, CommonModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent implements OnInit {
  private id = '';
  public recipe: Recipe | null = null;
  public details: RecipeDetails | null = null;

  constructor(private route: ActivatedRoute, private recipesService: RecipesService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.recipesService.getRecipeDetails$(+this.id).subscribe({
      next: ({ recipe, details }) => {
        this.recipe = recipe;
        this.details = details;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
