import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent implements OnInit {
  constructor(private recipesService: RecipesService) { }

  ngOnInit(): void {
    this.recipesService.addRecipe({
      title: 'Spaghetti Carbonara',
      ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese'],
      instructions: 'Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all ingredients.'
    })
  }
}
