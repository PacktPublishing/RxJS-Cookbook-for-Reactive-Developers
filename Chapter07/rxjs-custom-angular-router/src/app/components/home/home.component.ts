import { Component } from '@angular/core';
import { RouterService } from '../../services/router.service';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private routerService: RouterService) { }

  goToAbout(): void {
    this.routerService.navigate('/about');
  }
}
