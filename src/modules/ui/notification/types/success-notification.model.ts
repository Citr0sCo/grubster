import { INotification } from './notification.model';

export class SuccessNotification implements INotification {
    private readonly _title: string;
    private readonly _message: string;

    constructor(title: string, message: string) {
        this._title = title;
        this._message = message;
    }

    public title(): string {
        return this._title;
    }

    public message(): string {
        return this._message;
    }

    public icon(): string {
        return 'fa fa-check';
    }

    public class(): string {
        return 'notification--success';
    }
}
