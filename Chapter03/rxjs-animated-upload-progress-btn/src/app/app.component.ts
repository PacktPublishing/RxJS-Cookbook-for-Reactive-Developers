import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBtnComponent } from './progress-btn/progress-btn/progress-btn.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProgressBtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bouncing-ball';
}
