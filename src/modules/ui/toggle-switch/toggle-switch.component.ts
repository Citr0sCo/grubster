import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss'],
    standalone: false
})
export class ToggleSwitchComponent {
    @Input()
    public switchValue: boolean = false;

    @Input()
    public isDisabled: boolean = false;

    @Output()
    public switchValueChange: EventEmitter<boolean> = new EventEmitter();

    public toggle(): void {
        this.switchValueChange.emit(this.switchValue);
    }
}
