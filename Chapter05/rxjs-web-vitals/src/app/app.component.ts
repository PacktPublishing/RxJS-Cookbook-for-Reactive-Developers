import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { merge } from 'rxjs';
import { WebVitalsObserverService } from './services/web-vitals-observer/web-vitals-observer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private firstInputPaint$ = this.webVitalsObserverService.observePerformanceEntry('paint');
  private firstContentfulPaint$ = this.webVitalsObserverService.observePerformanceEntry('first-input');
  private cumulativeLayoutShift$ = this.webVitalsObserverService.observePerformanceEntry('layout-shift');
  private largestContentfulPaint$ = this.webVitalsObserverService.observePerformanceEntry('largest-contentful-paint');
  loading = true;

  constructor(private webVitalsObserverService: WebVitalsObserverService) { }

  ngOnInit(): void {
    setTimeout(() => {
      // Simulate Cummulative Layout Shift
      this.loading = false;
    }, 2000);
    merge(
      this.firstInputPaint$,
      this.largestContentfulPaint$,
      this.firstContentfulPaint$,
      this.cumulativeLayoutShift$
    ).subscribe((entry) => {
      console.log(entry);
    });
  }
}
