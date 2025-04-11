import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'badge',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss'],
    standalone: false
})
export class BadgeComponent {
    @Input()
    public value: string;

    @Input()
    public isRemovable: boolean;

    @Input()
    public isLarge: boolean;

    @Input()
    public color: string;

    @Output()
    public hasBeenRemoved: EventEmitter<boolean> = new EventEmitter();

    public handleClick(): void {
        this.hasBeenRemoved.emit(true);
    }
}
