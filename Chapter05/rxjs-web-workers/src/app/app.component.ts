import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { bufferCount, distinctUntilChanged, filter, fromEvent, map, share, throttleTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-web-workers';

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      worker.postMessage({ iterations: 1_000_000 });
      const message$ = fromEvent<MessageEvent>(worker, 'message').pipe(
        filter(( { data } ) => data !== null), 
        map(({ data }) => data),
        distinctUntilChanged(),
        bufferCount(1000),
        throttleTime(10),
        share() 
      );

      message$.subscribe((data) => {
        console.log('Received message from worker:', data);
      });
    }
  }
}
