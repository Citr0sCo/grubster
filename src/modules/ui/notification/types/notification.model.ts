export interface INotification {
    title(): string;

    message(): string;

    icon(): string;

    class(): string;
}
