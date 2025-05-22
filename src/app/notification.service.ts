import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  private counter = 0;

  getNotifications(): Observable<Notification> {
    return this.notificationsSubject.asObservable();
  }

  showNotification(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ): void {
    const id = this.counter++;
    this.notificationsSubject.next({ message, type, id });
  }

  success(message: string): void {
    this.showNotification(message, 'success');
  }

  error(message: string): void {
    this.showNotification(message, 'error');
  }

  info(message: string): void {
    this.showNotification(message, 'info');
  }

  warning(message: string): void {
    this.showNotification(message, 'warning');
  }
}
