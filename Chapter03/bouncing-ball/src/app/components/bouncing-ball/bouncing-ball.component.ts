import { Component, ElementRef, ViewChild } from '@angular/core';
import { interval, scan, map, takeWhile, timer, defer, delay } from 'rxjs';

@Component({
  selector: 'app-bouncing-ball',
  standalone: true,
  imports: [],
  templateUrl: './bouncing-ball.component.html',
  styleUrl: './bouncing-ball.component.scss'
})
export class BouncingBallComponent {
  @ViewChild('ball', { static: true }) ballRef!: ElementRef;

  ngAfterViewInit() {
    const ball = this.ballRef.nativeElement;
    const container = document.documentElement; // Or any specific container element

    // Initial ball properties
    const initialHeight = 100; // Starting height
    let y = initialHeight;
    let dy = 0; 
    let gravity = 0.5; // Adjust for stronger/weaker gravity
    let bounceCount = 0;
    let energyLoss = 0.7; // Energy loss on each bounce

    // Create an observable for the game loop
    const gameLoop$ = timer(0, 10).pipe(
      // Update ball position
      scan(() => {
        dy += gravity; // Apply gravity
        y += dy;

        // Bounce off the ground
        if (y + ball.offsetHeight > container.clientHeight) {
          y = container.clientHeight - ball.offsetHeight;
          dy = -dy * energyLoss; // Reverse direction and reduce energy
          bounceCount++;
        }

        return { y };
      }, { y }),
      // Apply position to the ball
      map(({ y }) => {
        ball.style.top = `${y}px`;
      }),
      // Stop after 5 bounces
      takeWhile(() => bounceCount <= 7) 
    );

    // Start the animation
    gameLoop$.subscribe();
  }
}
