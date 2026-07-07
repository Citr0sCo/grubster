import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'method-indicator',
    templateUrl: './method-indicator.component.html',
    styleUrls: ['./method-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MethodIndicatorComponent {
    @Input()
    public method: string = '';

    @Input()
    public isSmall: boolean = false;
}
