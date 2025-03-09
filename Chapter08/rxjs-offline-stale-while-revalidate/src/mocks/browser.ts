import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// if (!navigator.onLine) {
//     worker.stop();
//   }

// window.addEventListener('online', () => {
//     worker.start();
// });
  
// window.addEventListener('offline', () => {
//     worker.stop();
// });