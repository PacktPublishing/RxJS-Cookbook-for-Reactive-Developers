import { Injectable } from '@nestjs/common';
import { of } from 'rxjs';

@Injectable()
export class OrdersService {
  getRandomRecipe$() {
    return of('random recipe');
  }
}
