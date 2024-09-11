import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  fromEvent,
  switchMap,
  takeUntil,
  map,
  of,
  tap,
  finalize,
  delay,
  mergeMap,
  bufferCount, Observable
} from 'rxjs';
import { PixelCoordinates } from '../../types/pixel-coordinates.type';
import { arraysHaveSameElements } from '../../utils/array.util';

@Component({
  selector: 'app-swipe-unlock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipe-unlock.component.html',
  styleUrl: './swipe-unlock.component.scss',
})
export class SwipeUnlockComponent {
  @ViewChild('swipeArea') swipeArea!: ElementRef;
  @ViewChildren('one, two, three, four, five, six, seven, eight, nine, zero')
  numbers!: QueryList<ElementRef>;

  numbersElement: HTMLDivElement[] = [];
  patternAttempt: number[] = [];
  pattern = [1, 2, 5, 8, 7];
  startMessage = {
    type: 'idle',
    content: '',
  };
  message = this.startMessage;

  ngAfterViewInit() {
    this.numbersElement = this.numbers
      .toArray()
      .map((num) => num.nativeElement);
    const touchStart$ = fromEvent<TouchEvent>(
      this.swipeArea.nativeElement,
      'touchstart'
    );
    const touchMove$ = fromEvent<TouchEvent>(
      this.swipeArea.nativeElement,
      'touchmove'
    );
    const touchEnd$ = fromEvent<TouchEvent>(
      this.swipeArea.nativeElement,
      'touchend'
    );

    const swipe$ = touchStart$.pipe(
      tap((dot) => this.cleanup()),
      switchMap(() =>
        touchMove$.pipe(
          takeUntil(touchEnd$),
          map((touchMove) => ({
            x: touchMove.touches[0].clientX,
            y: touchMove.touches[0].clientY,
          }))
        )
      ),
    );

    swipe$
      .pipe(
        tap((dot) => this.selectNumber(dot)),
        mergeMap((dot) => this.createTrailDot(dot)),
        delay(1000),
        tap(() => this.showMessage())
      )
      .subscribe();
  }

  private showMessage(): void {
    const isSuccess = arraysHaveSameElements(this.patternAttempt, this.pattern);
    this.message = isSuccess ? {
      type: 'success',
      content: 'Unlocked',
    } : {
      type: 'error',
      content: 'Try again',
    };
  }

  private cleanup(): void {
    this.patternAttempt = [];
    this.message = this.startMessage;
    this.numbersElement.forEach((number) =>
      number.classList.remove('selected')
    );
  }

  private selectNumber(dot: PixelCoordinates): void {
    this.numbersElement.forEach((number) => {
      if (this.patternAttempt.includes(parseInt(number.innerText))) return;

      if (
        dot.y > number.getBoundingClientRect().top &&
        dot.y < number.getBoundingClientRect().bottom &&
        dot.x > number.getBoundingClientRect().left &&
        dot.x < number.getBoundingClientRect().right
      ) {
        number.classList.add('selected');
        this.patternAttempt.push(parseInt(number.innerText));
      }
    });
  }

  private createTrailDot(
    dotCoordinates: PixelCoordinates
  ): Observable<string[]> {
    const dot = document.createElement('div');
    dot.classList.add('trail-dot');
    dot.style.left = `${dotCoordinates.x}px`;
    dot.style.top = `${dotCoordinates.y}px`;
    this.swipeArea.nativeElement.appendChild(dot);

    return of('').pipe(
      delay(1000),
      bufferCount(100, 50),
      finalize(() => dot.remove())
    );
  }
}
