import { ApplicationConfig } from '@angular/core';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService
  ]
};
