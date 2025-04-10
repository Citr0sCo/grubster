import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent {
    @Input()
    public switchValue: boolean;

    @Input()
    public isDisabled: boolean;

    @Output()
    public switchValueChange: EventEmitter<boolean> = new EventEmitter();

    public toggle(): void {
        this.switchValueChange.emit(this.switchValue);
    }
}
