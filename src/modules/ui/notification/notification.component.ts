import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
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
    animations: [Animations.slideInUp()],
    standalone: false
})
export class NotificationComponent implements OnInit, OnDestroy {
    private readonly _notifications = signal<INotification[]>([]);

    public get notifications(): INotification[] {
        return this._notifications();
    }
    public set notifications(value: INotification[]) {
        this._notifications.set(value);
    }

    private _notificationService: NotificationService;
    private _subscriptions: Subscription = new Subscription();

    constructor(notificationService: NotificationService) {
        this._notificationService = notificationService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._notificationService.notifications
                .pipe(
                    tap((notification) => {
                        this.notifications = [...this.notifications, notification];
                    }),
                    delay(Times.SECOND * 3),
                    tap(() => {
                        this.notifications = this.notifications.slice(1);
                    })
                )
                .subscribe()
        );
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
