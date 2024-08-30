import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterService } from '../../services/router.service';
import { AboutComponent } from '../about/about.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-router-outlet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './router-outlet.component.html',
  styleUrl: './router-outlet.component.scss'
})
export class RouterOutletComponent {
  component: any;

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.getCurrentRoute().subscribe(route => {
      this.component = routes.find(r => r.path === route?.path)?.component || NotFoundComponent;
    });
  }
}
