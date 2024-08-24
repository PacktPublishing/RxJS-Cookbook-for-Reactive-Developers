import { Component } from '@angular/core';
import { RouterService } from './services/router.service';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
    this.routerService.paramMap.subscribe(params => {
      console.log('Route params:', params.get('id'));
    });
    setTimeout(() => {
      this.routerService.navigate('/home', { id: '123' });
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
        case '/':
          this.component = HomeComponent;
          break;
        default:
          this.component = NotFoundComponent;
          break;
      }
    });
  }
}
