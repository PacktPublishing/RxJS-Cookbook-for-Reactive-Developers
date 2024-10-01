import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterService } from '../../services/router.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { routes } from '../../app.routes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-router-outlet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './router-outlet.component.html',
  styleUrl: './router-outlet.component.scss'
})
export class RouterOutletComponent {
  component: any;
  private routeSubscription: Subscription = new Subscription();

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
    this.routeSubscription = this.routerService.getCurrentRoute().subscribe(route => {
      this.component = routes.find(r => r.path === route?.path)?.component || NotFoundComponent;
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
