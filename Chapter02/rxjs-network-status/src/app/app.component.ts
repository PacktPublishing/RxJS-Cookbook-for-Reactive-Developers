import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkStatusIndicatorComponent } from './components/network-status-indicator/network-status-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NetworkStatusIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-network-status';
}
