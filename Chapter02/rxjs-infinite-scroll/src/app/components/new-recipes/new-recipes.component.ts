import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-new-recipes',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './new-recipes.component.html',
  styleUrl: './new-recipes.component.scss'
})
export class NewRecipesComponent {
  number = 10;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.recipesService.checkNumberOfNewRecipes().subscribe((number) => {
      this.number = number;
    });
  }

}
