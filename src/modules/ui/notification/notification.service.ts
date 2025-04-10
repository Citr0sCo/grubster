import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { INotification } from './types/notification.model';
import { ErrorNotification } from './types/error-notification.model';
import { SuccessNotification } from './types/success-notification.model';
import { WarnNotification } from './types/warn-notification.model';

@Injectable()
export class NotificationService {
    public notifications: ReplaySubject<INotification> = new ReplaySubject<INotification>(1);

    public logError(title: string, message: string): void {
        this.notifications.next(new ErrorNotification(title, message));
    }

    public logWarn(title: string, message: string): void {
        this.notifications.next(new WarnNotification(title, message));
    }

    public logSuccess(title: string, message: string): void {
        this.notifications.next(new SuccessNotification(title, message));
    }
}
