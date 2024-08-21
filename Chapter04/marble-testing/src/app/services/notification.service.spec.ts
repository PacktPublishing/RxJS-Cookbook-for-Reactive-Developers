import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { TestScheduler } from 'rxjs/testing';
import { Notification } from './notification.service';
import { skip } from 'rxjs/operators';

describe('NotificationService', () => {
  let service: NotificationService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    service = TestBed.inject(NotificationService);
  });

  it('should add and remove notifications', fakeAsync(() => {
    testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const notification1: Notification = { id: '1', message: 'First', type: 'success' };
      const notification2: Notification = { id: '2', message: 'Second', type: 'success' };
      const add1$ = cold('a', { a: notification1 });
      const add2$ = cold('--a', { a: notification2 });
      const expected$ = 'a-b'; 
      const expectedValues = { 
        a: [notification1],
        b: [notification1, notification2]
      };
  
      add1$.subscribe(notification => {
        service.addNotification(notification);
      });
      add2$.subscribe(notification => {
        service.addNotification(notification);
      });
      service.notifications.subscribe();
  
      // Delay the subscription to notifications$ to ensure addNotification has been called
      testScheduler.schedule(() => 
        expectObservable(service.notifications$).toBe(expected$, expectedValues));
    });
  }));
});
