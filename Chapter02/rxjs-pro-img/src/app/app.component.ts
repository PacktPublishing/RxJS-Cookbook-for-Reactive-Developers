import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProImgComponent } from './components/pro-img/pro-img.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProImgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rxjs-pro-img';
}
