import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  fromEvent,
  map,
  startWith,
  catchError,
  of,
  shareReplay,
  Observable,
  tap,
  BehaviorSubject,
  merge,
  timer,
  takeWhile,
  Subject,
} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'rxjs-pro-img';
  src = '';
  placeholderSrc = '';
  imageSrc$!: Observable<string>;
  loadingProgress$ = new BehaviorSubject<number>(0);
  loaded$ = new Subject<boolean>();

  ngOnInit(): void {
    const img = new Image();
    img.src = !this.src.startsWith('http')
      ? `assets/images/${this.src}`
      : this.src;

    this.loadingProgress$.subscribe((progress) => console.log(progress));

    const loadProgress$ = timer(0, 100); // Emit 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...
    const loadComplete$ = fromEvent(img, 'load').pipe(map(() => 100)); // Emit 100 on load
    const loadError$ = fromEvent(img, 'error').pipe(map(() => -1)); // Emit -1 on error

    this.imageSrc$ = merge(loadProgress$, loadComplete$, loadError$).pipe(
      map((progress) => (progress === 100 ? this.src : this.placeholderSrc)),
      tap((progress) => console.log(progress)),
      startWith(this.placeholderSrc),
      takeWhile((src) => src === this.placeholderSrc, true),
      catchError(() => of(this.placeholderSrc)),
      shareReplay(1)
    );
  }
}
