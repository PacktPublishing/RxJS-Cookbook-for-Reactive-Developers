import { MatButtonModule } from '@angular/material/button';
import { Component, EventEmitter, Output } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-new-recipes',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './new-recipes.component.html',
  styleUrl: './new-recipes.component.scss'
})
export class NewRecipesComponent {
  @Output() refresh = new EventEmitter<void>();
  
  number = 0;
  
  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.recipesService.checkNumberOfNewRecipes().subscribe((number) => {
      this.number = number;
    });
  }

  refreshList(): void {
    this.refresh.emit();
    this.number = 0;
  }

}
