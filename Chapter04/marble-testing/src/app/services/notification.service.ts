import { Injectable } from '@angular/core';
import { Subject, Observable, map, BehaviorSubject, merge, withLatestFrom, timer } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public notifications$ = new BehaviorSubject<Notification[]>([]);
  public addNotification$ = new Subject<Notification>();
  public removeNotification$ = new Subject<string>();

  get notifications(): Observable<Notification[]> {
    return merge(
      this.addNotification$,
      this.removeNotification$
    ).pipe(
      withLatestFrom(this.notifications$),
      map(([changedNotification, notifications]) => {
        if (changedNotification instanceof Object) {
          this.notifications$.next([...notifications, changedNotification]);
        } else {
          this.notifications$.next(notifications.filter(notification => notification.id !== changedNotification));
        }
        
        return this.notifications$.value;
      })
    )
  }

  addNotification(notification: Notification, autodismiss = true, timeout = 5000) {
    this.addNotification$.next(notification);

    if (autodismiss) {
      timer(timeout).subscribe(() => this.removeNotification(notification.id)); 
    }
  }

  removeNotification(id: string) {
    this.removeNotification$.next(id);
  }
}
