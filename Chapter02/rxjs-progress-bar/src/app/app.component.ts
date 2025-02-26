import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ProgressBarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-progress-bar';
  
}
