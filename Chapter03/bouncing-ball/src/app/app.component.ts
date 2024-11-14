import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BouncingBallComponent } from './components/bouncing-ball/bouncing-ball.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BouncingBallComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bouncing-ball';
}
