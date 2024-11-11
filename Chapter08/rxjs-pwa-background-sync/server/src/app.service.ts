import { Injectable, OnModuleInit } from '@nestjs/common';
import { BehaviorSubject, Observable, interval, map, of, takeWhile } from 'rxjs';

export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
}

@Injectable()
export class AppService implements OnModuleInit {
  private recipes$ = new BehaviorSubject<Recipe[]>([]);
  private index = -1;

  private generateRandomRecipe() {
    const recipes = [
      { id: 1, title: 'Spaghetti Carbonara', ingredients: ['spaghetti', 'eggs', 'cheese', 'bacon'], instructions: 'Boil pasta. Cook bacon. Mix eggs and cheese. Combine all.' },
      { id: 2, title: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'coconut milk', 'onions'], instructions: 'Cook chicken. Add onions and curry powder. Add coconut milk. Simmer.' },
      { id: 3, title: 'Beef Tacos', ingredients: ['beef', 'taco shells', 'lettuce', 'cheese', 'salsa'], instructions: 'Cook beef. Fill taco shells with beef and toppings.' },
      // Add more recipes as needed
    ];

    this.index++;
    return recipes[this.index];
  }

  onModuleInit() {
    interval(5000).pipe(
      map(() => this.generateRandomRecipe()),
      takeWhile(() => this.index < 3),
    ).subscribe((recipe) => {
      this.recipes$.next([...this.recipes$.getValue(), recipe]);
    });
  }

  getHello(): Observable<Recipe[]> {
    return this.recipes$.getValue().length ? of(this.recipes$.getValue()) : of([]);
  }
}
