import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { liveQuery } from 'dexie';
import { RecipesService } from './services/recipes.service';
import { db } from './db/dexie.db';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  recipes$ = liveQuery(() => db.recipes.toArray());

  constructor(private recipesService: RecipesService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.recipesService.getRecipes().subscribe((recipes) => {
      console.log(recipes);
    });
  }
}
