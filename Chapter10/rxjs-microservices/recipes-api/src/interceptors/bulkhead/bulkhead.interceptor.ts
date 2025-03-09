// Approach 1: Using a queue and processing it manually
// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable, of } from 'rxjs';
// import { catchError, finalize, map } from 'rxjs/operators';

// @Injectable()
// export class BulkheadInterceptor implements NestInterceptor {
//   private readonly MAX_CONCURRENT_REQUESTS = 3;
//   private activeRequests = 0;
//   private requestQueue: (() => Observable<any>)[] = [];

//   private processQueue() {
//     if (
//       this.requestQueue.length > 0 &&
//       this.activeRequests < this.MAX_CONCURRENT_REQUESTS
//     ) {
//       const task = this.requestQueue.shift()!;
//       this.activeRequests++;

//       task().subscribe({
//         complete: () => {
//           this.activeRequests--;
//           this.processQueue();
//         },
//       });
//     }
//   }

//   intercept<T>(context: ExecutionContext, next: CallHandler): Observable<T> {
//     const request$ = next.handle().pipe(
//       catchError((err) => of(err)),
//       finalize(() => {
//         this.activeRequests--;
//         this.processQueue();
//       }),
//     );

//     if (this.activeRequests < this.MAX_CONCURRENT_REQUESTS) {
//       this.activeRequests++;

//       return request$;
//     }

//     const queueRequest$: Observable<T> = new Observable((observer) => {
//       this.requestQueue.push(() => {
//         return next.handle().pipe(
//           catchError((err) => {
//             observer.error(err);

//             return of(err);
//           }),
//           map((result) => {
//             observer.next(result);

//             return result;
//           }),
//         );
//       });

//       // try to process the queue right away
//       this.processQueue();
//     });

//     return queueRequest$;
//   }
// }

// Approach 2: Using RxJS Subjects and mergeMap
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, Subject, mergeMap } from 'rxjs';

@Injectable()
export class BulkheadInterceptor implements NestInterceptor {
  private readonly MAX_CONCURRENT_REQUESTS = 3;
  private requestQueue = new Subject<Observable<any>>();

  constructor() {
    this.requestQueue
      .pipe(mergeMap((task) => task, this.MAX_CONCURRENT_REQUESTS))
      .subscribe();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.requestQueue.next(next.handle());

    return this.requestQueue.asObservable();
  }
}
