import { Observable, skipUntil, startWith, tap } from 'rxjs';

export function startMeasurePerformance<T>() {
  return (source$: Observable<T>) => new Observable<T>(observer => {
    const subscription = source$.pipe(
      skipUntil(source$)
    ).subscribe({
      next(value) {
        performance.mark('start')
        observer.next(value);
      },
      error(err) { observer.error(err); },
      complete() { 
        observer.complete(); 
      }
    });

    return subscription;
  });
}

export function measurePerformance<T>() {
  return (source$: Observable<T>) => new Observable<T>(observer => {
    const subscription = source$.subscribe({
      next(value) {
        observer.next(value);
        performance.mark('end');

        performance.measure('Measure between start and end', 'start', 'end');
        const measure = performance.getEntriesByName('Measure between start and end')[0];
        console.log(`Duration between start and end: ${measure.duration} milliseconds.`);

        performance.clearMarks();
        performance.clearMeasures();
      },
      error(err) { observer.error(err); },
      complete() { 
        observer.complete(); 
      }
    });

    return subscription;
  });
}