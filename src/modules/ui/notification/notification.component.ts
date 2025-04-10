import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { INotification } from './types/notification.model';
import { delay, tap } from 'rxjs/operators';
import { Times } from '../../utility/time/times.enum';
import { Animations } from '../../../core/animations';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [Animations.slideInUp()]
})
export class NotificationComponent implements OnInit, OnDestroy {
    public notifications: INotification[] = [];

    private _notificationService: NotificationService;
    private _subscriptions: Subscription = new Subscription();
    private _changeDetector: ChangeDetectorRef;

    constructor(notificationService: NotificationService, changeDetector: ChangeDetectorRef) {
        this._notificationService = notificationService;
        this._changeDetector = changeDetector;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._notificationService.notifications
                .pipe(
                    tap((notification) => {
                        this.notifications.push(notification);
                        this._changeDetector.detectChanges();
                    }),
                    delay(Times.SECOND * 3),
                    tap(() => {
                        this.notifications.shift();
                        this._changeDetector.detectChanges();
                    })
                )
                .subscribe()
        );
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
