import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

async function enableMocking() {
  if (environment.configuration !== 'development') {
    return
  }
 
  const { worker } = await import('./mocks/browser')
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  if (navigator.onLine) {
    return worker.start({
      onUnhandledRequest: "bypass", // Optional: Let real requests pass through if not mocked
    });
  } 
  
  return Promise.resolve();
}

enableMocking().then(() => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
});
