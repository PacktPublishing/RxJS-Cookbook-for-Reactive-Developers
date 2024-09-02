import { Component } from '@angular/core';
import { RouterService } from './services/router.service';
import { CommonModule } from '@angular/common';
import { RouterOutletComponent } from './components/router-outlet/router-outlet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutletComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-custom-router';

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.queryParamMap.subscribe(params => {
      console.log('Route query params:', params.get('id'));
    });
    setTimeout(() => {
      this.routerService.navigate('/home', { id: '123' });
    }, 5000);
    // setTimeout(() => {
    //   this.routerService.navigate('/about');
    // }, 15000);
    
  }
}
