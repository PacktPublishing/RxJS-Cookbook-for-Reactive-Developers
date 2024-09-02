import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { CustomRoute } from './types/route.types';

export const routes: CustomRoute[] = [
    { path: '/login', component: LoginComponent, canActivate: authGuard },
    { path: '/home', component: HomeComponent, canActivate: authGuard },
    { path: '/about', component: AboutComponent, canActivate: authGuard }
];
