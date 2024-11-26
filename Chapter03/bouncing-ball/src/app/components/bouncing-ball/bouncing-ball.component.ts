import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval, scan, map, takeWhile, animationFrameScheduler, withLatestFrom, tap, finalize, repeat, Subject, Observable, skip } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-bouncing-ball',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './bouncing-ball.component.html',
  styleUrl: './bouncing-ball.component.scss'
})
export class BouncingBallComponent {
  @ViewChild('ball', { static: true }) ballRef!: ElementRef;
  @ViewChild('shadow', { static: true }) shadow!: ElementRef;
  private bounceRepeat$ = new Subject<void>();
  message = signal<string>('');
  buttonWidth = signal<string>('');
  maxBounces = 7;
  bounceCount = 0;
  container!: HTMLElement;
  ballLoop$!: Observable<{ y: number, dy: number }>;

  ngAfterViewInit() {
    const ball = this.ballRef.nativeElement;
    this.container = document.documentElement; 
    const initialHeight = 0; 
    let gravity = 0.981;
    let energyLoss = 0.9; 
    const initialVelocity = 0; 
    const time$ = interval(30);

    const velocity$ = time$.pipe(
      map(time => time / 1000),
      scan((velocity, time) => velocity + gravity * time, initialVelocity),
    );

    this.ballLoop$ = interval(0, animationFrameScheduler).pipe(
      withLatestFrom(velocity$),
      map(([_, velocity]) => velocity),
      scan(({ y, dy }, velocity) => {
        dy += velocity; // Apply gravity
        y += dy;
        // Bounce off the ground
        if (y + ball.offsetHeight > this.container.clientHeight - 10) {
          y = this.container.clientHeight - ball.offsetHeight - 10;
          dy = -dy * energyLoss; // Reverse direction and reduce energy
          this.bounceCount++;
        }

        return { y, dy };
      }, { y: initialHeight, dy: 0 }),
      tap(({ y }) => {
        ball.style.top = `${y}px`;
        this.updateShadow(y);
      }),
      takeWhile(() => this.bounceCount < this.maxBounces),
      finalize(() => {
        this.message.set(`Bouncing stopped after ${this.bounceCount} bounces`);
      }),
      repeat({ delay: () => this.bounceRepeat$ }),
    );

    this.ballLoop$.subscribe();
  }

  startBouncing() {
    this.message.set('');
    this.bounceCount = 0;
    this.bounceRepeat$.next();
  }

  updateShadow(y: number) {
    const shadowScale = Math.max(1, 2 - y / this.container.clientHeight);
    this.shadow.nativeElement.style.transform = `translateY(-50%) scale(${shadowScale})`;
  }

}
