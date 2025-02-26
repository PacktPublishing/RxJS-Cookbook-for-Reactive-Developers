import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  interval,
  scan,
  takeWhile,
  animationFrameScheduler,
  tap,
  repeat,
  Subject,
  Observable,
} from 'rxjs';

@Component({
    selector: 'app-bouncing-ball',
    imports: [FormsModule],
    templateUrl: './bouncing-ball.component.html',
    styleUrl: './bouncing-ball.component.scss'
})
export class BouncingBallComponent {
  @ViewChild('ball', { static: true }) ballRef!: ElementRef;
  @ViewChild('shadow', { static: true }) shadow!: ElementRef;
  private bounceRepeat$ = new Subject<void>();
  container!: HTMLElement;
  ballLoop$!: Observable<{ y: number; dy: number; bounceCount: number }>;
  message = signal<string>('');

  ngAfterViewInit() {
    const ball = this.ballRef.nativeElement;
    this.container = document.documentElement;
    const initialHeight = 0;
    let gravity = 0.981;
    let energyLoss = 0.85;

    this.ballLoop$ = interval(0, animationFrameScheduler).pipe(
      scan(
        ({ y, dy, bounceCount, startTime }, currentTime) => {
          // Euler method
          dy += gravity; // Apply velocity
          y += dy; // Apply gravity
          // If you like old-school approach with h = v0 * t + 0.5 * g * t^2 formula
          // const time = currentTime / 125;
          // dy += gravity * time;
          // const isFalling = dy > 0;
          // y += isFalling
          //   ? dy * time + (gravity * time * time) / 2
          //   : dy * time - (gravity * time * time) / 2;

          if (y + ball.offsetHeight > this.container.clientHeight - 10) {
            y = this.container.clientHeight - ball.offsetHeight - 10;
            dy = -dy * energyLoss; // Reverse direction and reduce energy
            bounceCount++;
          }

          return { y, dy, bounceCount, startTime };
        },
        { y: initialHeight, dy: 0, bounceCount: 0, startTime: 0 }
      ),
      tap(({ y, bounceCount }) => {
        ball.style.top = `${y}px`;
        this.updateShadow(y);
        this.message.set(`Bounces count: ${bounceCount}`);
      }),
      takeWhile(
        ({ y, dy }) =>
          y < this.container.clientHeight - ball.offsetHeight - 10 ||
          Math.abs(dy) > 5
      ),
      repeat({ delay: () => this.bounceRepeat$ })
    );

    this.ballLoop$.subscribe();
  }

  startBouncing() {
    this.bounceRepeat$.next();
  }

  updateShadow(y: number) {
    const shadowScale = Math.max(1, 2 - y / this.container.clientHeight);
    this.shadow.nativeElement.style.transform = `translateY(-50%) scale(${shadowScale})`;
  }
}
