import { Component } from '@angular/core';
import { RouterService } from './services/router.service';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-custom-router';
  component: any;

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.routerService.navigate('/home');
    }, 5000);
    setTimeout(() => {
      this.routerService.navigate('/about');
    }, 15000);
    this.routerService.getCurrentRoute().subscribe(route => {
      console.log('Current route:', route);
      switch (route?.path) {
        case '/home':
          this.component = HomeComponent;
          break;
        case '/about':
          this.component = AboutComponent;
          break;
        // ... more routes here ...
      }
    });
  }
}
