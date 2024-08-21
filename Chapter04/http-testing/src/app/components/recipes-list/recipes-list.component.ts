import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { Recipe } from '../../types/recipes.type';
import { RecipesService } from '../../services/recipes.service';


@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  private recipesSubscription: Subscription | undefined;
  recipes: Recipe[] = [];
  images: any[] = [];
  error: Error | undefined;

  constructor(private recipesService: RecipesService, private router: Router) { }

  ngOnInit() {
    this.recipesService.recipes.subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (error) => {
        this.error = error;
      }
    });

    // Parallel requests recipe

    this.recipesSubscription = this.recipesService.getRecipesWithImageInParallel$().subscribe({
      next: (images) => {
        if (Array.isArray(images)) {
          this.images = images
        } else {
          this.images.push(images)
        }
      },
      error: (error) => {
        this.error = error;
      }
    });
    
    // Concurrent requests recipe

    // this.recipesSubscription = this.recipesService.getRecipesWithConcurrentImage$().subscribe({
    //   next: (images) => {
    //     if (Array.isArray(images)) {
    //       this.images = images
    //     } else {
    //       this.images.push(images)
    //     }
    //   },
    //   error: (error) => {
    //     this.error = error;
    //   }
    // });
  }

  ngOnDestroy() {
    this.recipesSubscription?.unsubscribe();
  }

  goToDetailsPage(id: number) {
    this.router.navigate(['recipes', id]);
  }

  findRecipeImage(recipeId: number) {
    const image = this.images.find((image) => image.id === recipeId);

    return image ? image.url : '';
  }

}
