import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { CustomRoute } from './services/router.service';

export const customRoutes: CustomRoute[] = [
    { path: '/home', component: HomeComponent },
    { path: '/about', component: AboutComponent },
];
