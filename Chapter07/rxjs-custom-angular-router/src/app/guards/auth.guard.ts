import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export type CanActivateFn = (path: string) => Observable<boolean | URL>;
let authService: AuthService | null = null;

export const authGuard: CanActivateFn = (path: string) => {
  if (!authService) {
    authService = inject(AuthService);
  }

  if (path === '/login') {
    if (authService.isAuthenticated()) {
        const url = new URL('/home', window.location.origin);

        return of(url);
    } 
    
    return of(true);
  } else {
    if (authService.isAuthenticated()) {
        return of(true);
    } 

    const url = new URL('/login', window.location.origin);

    return of(url);
  }
};
