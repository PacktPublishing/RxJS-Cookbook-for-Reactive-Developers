import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TabsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-loading-tabs';
}
