import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  Subject,
  timer,
  fromEvent,
  map,
  merge,
  tap,
  startWith,
  takeWhile,
  catchError,
  of,
  shareReplay,
} from 'rxjs';

@Component({
  selector: 'app-pro-img',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './pro-img.component.html',
  styleUrl: './pro-img.component.scss',
})
export class ProImgComponent implements OnInit {
  placeholderSrc = 'blurry-image.jpeg';
  src = 'image.jpg';
  imageSrc$!: Observable<string>;
  loadingProgress$ = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    const placeholderImg = new Image();
    placeholderImg.src = !this.placeholderSrc.startsWith('http')
      ? `assets/images/${this.placeholderSrc}`
      : this.placeholderSrc;
    const img = new Image();
    img.src = !this.src.startsWith('http')
      ? `assets/images/${this.src}`
      : this.src;

    const loadProgress$ = timer(0, 100); // Emit 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...
    const loadComplete$ = fromEvent(img, 'load').pipe(map(() => 100)); // Emit 100 on load
    const loadError$ = fromEvent(img, 'error').pipe(map(() => -1)); // Emit -1 on error

    this.imageSrc$ = merge(loadProgress$, loadComplete$, loadError$).pipe(
      tap((progress) => this.loadingProgress$.next(progress)),
      map((progress) => (progress === 100 ? img.src : placeholderImg.src)),
      startWith(placeholderImg.src),
      takeWhile((src) => src === placeholderImg.src, true),
      catchError(() => of(placeholderImg.src)),
      shareReplay(1)
    );
  }
}
