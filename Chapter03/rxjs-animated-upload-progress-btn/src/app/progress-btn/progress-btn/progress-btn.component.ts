import {
  animationFrames, distinctUntilChanged, endWith,
  interval,
  range,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  zip,
  zipWith
} from 'rxjs';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import {
  scan,
  map,
  takeWhile,
  timer, withLatestFrom, finalize, Subject, fromEvent
} from 'rxjs';

@Component({
  selector: 'app-progress-btn',
  standalone: true,
  imports: [],
  templateUrl: './progress-btn.component.html',
  styleUrl: './progress-btn.component.scss',
})
export class ProgressBtnComponent {
  @ViewChild('button', { static: false }) buttonRef!: ElementRef;
  buttonWidth = signal<string>('');

  ngAfterViewInit() {
    const btnState$ = new Subject<string>();
    let buttonState$ = btnState$.pipe(startWith('idle'));

    const uploadProgress$ = range(0, 101).pipe(
      zipWith(interval(50)),
      map(([value, _]) => value),
      take(101) 
    );

    const clickStream$ = fromEvent(this.buttonRef.nativeElement, 'click').pipe(
      switchMap(() => {
        btnState$.next('loading');

        return animationFrames().pipe(
          withLatestFrom(buttonState$),
          map(([_, state]) => state),
          takeWhile((state) => state !== 'done')
        );
      }),
      withLatestFrom(uploadProgress$),
      map(([_, progress]) => progress),
      distinctUntilChanged(),
      tap((progress) => {
        if (progress === 100) {
          btnState$.next('done');
        }
      }),
      takeWhile((progress) => progress <= 100),
    );

    clickStream$.subscribe((progress) => {
      const progressWidth =
        (this.buttonRef.nativeElement.clientWidth / 100) * progress;
      this.buttonWidth.set(`${progressWidth}`);
      console.log(progress)
    });
  }

  startBouncing() {}
}
