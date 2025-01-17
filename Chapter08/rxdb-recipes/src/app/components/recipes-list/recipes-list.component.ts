import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RxDBService } from '../../services/rxdb.service';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.scss'
})
export class RecipesListComponent implements OnInit {
  newRecipeName = '';

  constructor(private rxdbService: RxDBService) { }

  ngOnInit(): void {
    this.rxdbService.recipes$.subscribe((recipes) => {
      console.log('Recipes:', recipes);
    });
  }

  addRecipe(): void {
    this.rxdbService.addRecipe({
      title: 'New Recipe 3',
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Instructions'
    });
  }

  findRecipe(): void {
    this.rxdbService.findRecipe(this.newRecipeName);
  }
}
