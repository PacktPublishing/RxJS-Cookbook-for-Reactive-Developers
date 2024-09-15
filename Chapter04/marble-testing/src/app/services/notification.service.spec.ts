import { TestBed, fakeAsync } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { TestScheduler } from 'rxjs/testing';
import { Notification } from './notification.service';
import { delay, switchMap, throwError } from 'rxjs';

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

  // it('should add notifications (comment out 40-42 lines in notification.service.ts)', fakeAsync(() => {
  //   testScheduler.run(({ cold, expectObservable }) => {
  //     const notification1: Notification = { id: '1', message: 'Recipe added successfully.', type: 'success' };
  //     const notification2: Notification = { id: '2', message: 'Recipe added successfully.', type: 'success' };
  //     const add1$ = cold('a', { a: notification1 });
  //     const add2$ = cold('--a', { a: notification2 });
  //     const expected$ = 'a-b'; 
  //     const expectedValues = { 
  //       a: [notification1],
  //       b: [notification1, notification2]
  //     };
  
  //     add1$.subscribe(notification => {
  //       service.addNotification(notification);
  //     });
  //     add2$.subscribe(notification => {
  //       service.addNotification(notification);
  //     });
  //     service.notifications.subscribe();
  
  //     // Delay the subscription to notifications$ to ensure addNotification has been called
  //     testScheduler.schedule(() => 
  //       expectObservable(service.notifications$).toBe(expected$, expectedValues));
  //   });
  // }));

  it('should add notifications and remove each notification after 5 seconds', fakeAsync(() => {
    testScheduler.run(({ cold, expectObservable }) => {
      const notification1: Notification = { id: '1', message: 'Recipe added successfully.', type: 'success' };
      const notification2: Notification = { id: '2', message: 'Recipe could not be added.', type: 'success' };
      const add1$ = cold('a', { a: notification1 });
      const add2$ = cold('--a', { a: notification2 });
      // we put event c at 4997ms, since after we emit value a, we have 1ms gap, then b takes 1ms to emit it's value
      // then we wait 4997ms (4999ms in total since a was emitted) before we finally emit the event 
      // that will remove the first notification from the stack
      const expected$ = 'a 1ms b 4997ms c 1ms d'; 
      const expectedValues = { 
        a: [notification1],
        b: [notification1, notification2],
        c: [notification2],
        d: [],
      };
  
      add1$.subscribe(notification => service.addNotification(notification));
      add2$.subscribe(notification => service.addNotification(notification));
      service.notifications.subscribe();
  
      // Delay the subscription to notifications$ to ensure addNotification has been called
      testScheduler.schedule(() => 
        expectObservable(service.notifications$).toBe(expected$, expectedValues));
    });
  }));

  it('should add 3 notifications and dismiss 2 notifications', fakeAsync(() => {
    testScheduler.run(({ cold, expectObservable }) => {
      const notification1: Notification = { id: '1', message: 'Recipe added successfully.', type: 'success' };
      const notification2: Notification = { id: '2', message: 'Recipe could not be added.', type: 'error' };
      const notification3: Notification = { id: '3', message: 'Recipe could not be added.', type: 'error' };
      const add1$ = cold('a', { a: notification1 });
      const add2$ = cold('   1500ms a', { a: notification2 });
      const add3$ = cold('                       4000ms a', { a: notification3 });
      const expected$ = 'a 1499ms b 2499ms c 999ms d 3999ms e'; 
      const expectedValues = { 
        a: [notification1],
        b: [notification1, notification2],
        c: [notification1, notification2, notification3],
        d: [notification2, notification3],
        e: [notification2]
      };
  
      add1$.subscribe(notification => service.addNotification(notification));
      add2$.subscribe(notification => service.addNotification(notification, false));
      add3$.subscribe(notification => service.addNotification(notification));
      service.notifications.subscribe();
  
      // Delay the subscription to notifications$ to ensure addNotification has been called
      testScheduler.schedule(() => {
        expectObservable(service.notifications$).toBe(expected$, expectedValues);
      });
    });
  }));
});
