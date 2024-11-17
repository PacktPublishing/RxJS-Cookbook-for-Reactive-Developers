import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ParticlesComponent } from './particles/particles.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ParticlesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-particles';
}
