import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  scan,
  Observable,
  merge,
  tap,
  animationFrames,
  fromEvent,
  map,
  throttleTime,
  takeUntil,
} from 'rxjs';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

interface IAnimationFrame {
  timestamp: number;
  elapsed: number;
}

@Component({
    selector: 'app-particles',
    imports: [],
    templateUrl: './particles.component.html',
    styleUrl: './particles.component.scss'
})
export class ParticlesComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private mouseX = 0;
  private mouseY = 0;
  private particles$!: Observable<Particle[]>;

  private generateParticle(): Particle {
    return {
      x: Math.random() * this.canvas.nativeElement.width,
      y: Math.random() * this.canvas.nativeElement.height,
      radius: Math.random() * 0.5 + 2.5,
      vx: Math.random() < 0.5 ? Math.random() + 0.8 : -(Math.random() + 0.8),
      vy: Math.random() < 0.5 ? Math.random() + 0.8 : -(Math.random() + 0.8),
      color: `rgba(255,255,255,0.5)`,
    };
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;

    const initialParticles: Particle[] = Array.from(
      { length: 123 },
      this.generateParticle,
      this
    );

    if (!initialParticles.length) return;

    const mouseMove$ = fromEvent<MouseEvent>(
      this.canvas.nativeElement,
      'mousemove'
    ).pipe(
      throttleTime(5),
      map((event: MouseEvent) => {
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        return {
          x:
            (event.clientX - rect.left) *
            (this.canvas.nativeElement.width / rect.width),
          y:
            (event.clientY - rect.top) *
            (this.canvas.nativeElement.height / rect.height),
        };
      }),
      takeUntil(
        merge(
          fromEvent(this.canvas.nativeElement, 'mouseout'),
          fromEvent(this.canvas.nativeElement, 'mouseleave')
        )
      ) // Stop updating on mouseout/mouseleave
    );

    const animationFrame$ = animationFrames();

    this.particles$ = merge(mouseMove$, animationFrame$).pipe(
      scan(
        (
          particles: Particle[],
          event: { x: number; y: number } | IAnimationFrame
        ) => {
          // mousemove event
          if ('x' in event && 'y' in event) {
            this.mouseX = event.x;
            this.mouseY = event.y;

            return particles;
          }

          // animation frame event
          return particles.map((particle) => {
            const mouseMoveCoordinates = this.handleMouseInteraction(particle);
            let newX = mouseMoveCoordinates?.newX || particle.x + particle.vx;
            let newY = mouseMoveCoordinates?.newY || particle.y + particle.vy;

            return {
              ...particle,
              x: newX,
              y: newY,
              vx: particle.vx,
              vy: particle.vy,
            };
          });
        },
        initialParticles
      ),
      map((particles) =>
        particles.map((particle) =>
          this.detectWallCollision(
            particle,
            particle.x + particle.vx,
            particle.y + particle.vy
          )
        )
      ),
      tap((particles) => this.drawParticles(particles)),
      tap((particles) => this.drawConnections(particles))
    );

    this.particles$.subscribe();
  }

  detectWallCollision(
    particle: Particle,
    newX: number,
    newY: number
  ): Particle {
    if (
      newX + particle.radius > this.canvas.nativeElement.width ||
      newX - particle.radius < 0
    ) {
      particle.vx = -particle.vx;
      particle.x =
        newX + particle.radius > this.canvas.nativeElement.width
          ? this.canvas.nativeElement.width - particle.radius
          : particle.radius;
    }

    if (
      newY + particle.radius > this.canvas.nativeElement.height ||
      newY - particle.radius < 0
    ) {
      particle.vy = -particle.vy;
      particle.y =
        newY + particle.radius > this.canvas.nativeElement.height
          ? this.canvas.nativeElement.height - particle.radius
          : particle.radius;
    }

    return particle;
  }

  drawParticles(particles: Particle[]) {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    particles.forEach((particle) => this.drawParticle(particle));
  }

  drawConnections(particles: Particle[]) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const particle1 = particles[i];
        const particle2 = particles[j];
        const distance = Math.sqrt(
          (particle1.x - particle2.x) ** 2 + (particle1.y - particle2.y) ** 2
        );

        if (distance <= 250) {
          const opacity = 1 - distance / 250;
          this.drawLine(particle1, particle2, opacity);
        }
      }
    }
  }

  drawLine(particle1: Particle, particle2: Particle, opacity: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(particle1.x, particle1.y);
    this.ctx.lineTo(particle2.x, particle2.y);
    this.ctx.strokeStyle = `rgba(255,255,255, ${opacity})`;
    this.ctx.lineWidth = 0.45;
    this.ctx.stroke();
  }

  drawParticle(particle: Particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = particle.color;
    this.ctx.fill();
  }

  handleMouseInteraction(
    particle: Particle
  ): { newX: number; newY: number } | undefined {
    // Mouse hover radius avoidance
    const distanceToMouse = Math.sqrt(
      (this.mouseX - particle.x) ** 2 + (this.mouseY - particle.y) ** 2
    );

    if (distanceToMouse > 200) return;
    // Calculate angle between particle and mouse
    const angle = Math.atan2(
      particle.y - this.mouseY,
      particle.x - this.mouseX
    );
    const normalX = Math.cos(angle);
    const normalY = Math.sin(angle);
    const influenceFactor = Math.max(0, 1 - distanceToMouse / 200);
    particle.vx += normalX * influenceFactor * 2; // Adjust the factor as needed
    particle.vy += normalY * influenceFactor * 2; // Adjust the factor as needed
    particle.x = this.mouseX + 200 * normalX + particle.vx;
    particle.y = this.mouseY + 200 * normalY + particle.vy;

    return { 
      newX: particle.x,
      newY: particle.y
    };
  }
}
