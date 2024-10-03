import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { RecipesService } from './services/recipes.service';
import { Observable } from 'rxjs';
import { Recipe } from './types/recipes.type';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RecipesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-optimistic-update';
  
}
