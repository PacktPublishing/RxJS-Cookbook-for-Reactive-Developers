import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { RecipeItemComponent } from '../recipe-item/recipe-item.component';
import { RecipesService } from '../../services/recipes.service';


@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RecipeItemComponent, AsyncPipe, MatButtonModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent {
  recipe$: Subject<any> = new Subject();

  constructor(private recipesService: RecipesService) { }

  ngOnInit(): void {
    this.recipe$ = this.recipesService.recipes$;
  }

  postRecipe(): void {
    this.recipesService.postRecipe();
  }

}
