import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EMPTY, Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): Observable<string> {
    return this.httpService.get<string>('http://localhost:3000/orders')
      .pipe(
        map(response => {
          console.log(response.data)
          return response.data;
        }),
        catchError(error => {
          return of(error);
        })
      );
  }
}