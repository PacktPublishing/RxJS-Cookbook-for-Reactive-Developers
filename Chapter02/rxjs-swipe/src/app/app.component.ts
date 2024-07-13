import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwipeUnlockComponent } from './components/swipe-unlock/swipe-unlock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SwipeUnlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-swipe';
}
