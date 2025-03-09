import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getOrder(): Observable<string> {
    return this.httpService.get<string>('http://localhost:3000/orders').pipe(
      map((response) => {
        return response.data;
      }),
      catchError((error) => {
        return of(error);
      }),
    );
  }
}
