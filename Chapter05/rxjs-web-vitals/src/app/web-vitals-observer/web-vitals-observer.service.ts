import { Injectable } from '@angular/core';
import { Observable, fromEventPattern } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebVitalsObserverService {

  private performanceObserver$: Observable<PerformanceObserverEntryList> = new Observable<PerformanceObserverEntryList>();

  constructor() { }

  public observePerformanceEntry(entryType: string): Observable<PerformanceObserverEntryList> {
    this.performanceObserver$ = fromEventPattern<PerformanceObserverEntryList>(
      (handler) => {
        const observer = new PerformanceObserver((list) =>
          handler(list.getEntries())
        );
        observer.observe({ entryTypes: [entryType], buffered: true });
        return observer;
      },
      (handler, observer) => observer.disconnect()
    );

    return this.performanceObserver$;
  }

}
