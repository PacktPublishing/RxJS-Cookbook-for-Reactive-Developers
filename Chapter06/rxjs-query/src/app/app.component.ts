import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

import { QueryClientService, QueryState } from './rxjs-query/query-client.service';
import { RecipesService } from './services/recipes.service';
import { Recipe } from './types/recipes.types';
import { tapError } from './operators/tapError';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RecipesListComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'rxjs-query';
  recipes$!: Observable<QueryState<Recipe[]>>;

  constructor(private queryClient: QueryClientService) {}

  ngOnInit(): void {
  }

  handleRefetch(): void {
    this.queryClient.refetch(['recipes']);
  } 

  invalidateQuery(): void {
    this.queryClient.invalidateQuery(['recipes']);
  } 

  removeQuery(): void {
    this.queryClient.removeQuery(['recipes']);
  } 

  // mutation = injectMutation((client) => ({
  //   mutationFn: (todo: Todo) => this.todoService.addTodo(todo),
  //   onSuccess: () => {
  //     // Invalidate and refetch by using the client directly
  //     client.invalidateQueries({ queryKey: ['todos'] })

  //     // OR use the queryClient that is injected into the component
  //     // this.queryClient.invalidateQueries({ queryKey: ['todos'] })
  //   },
  // }))
}
