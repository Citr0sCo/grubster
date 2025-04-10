import { ErrorHandler, Injectable } from '@angular/core';
import { NotificationService } from '../../ui/notification/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private _notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this._notificationService = notificationService;
    }

    public handleError(error: any): void {
        console.error(error);
        this._notificationService.logError('Something has gone wrong!', 'Try restarting the app. If the problem persists, report it to the Grubster Discord.');
    }
}
