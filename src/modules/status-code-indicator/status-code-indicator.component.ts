import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'status-code-indicator',
    templateUrl: './status-code-indicator.component.html',
    styleUrls: ['./status-code-indicator.component.scss']
})
export class StatusCodeIndicatorComponent implements OnChanges {
    @Input()
    public statusCode: number = 0;

    @Input()
    public statusText: string = 'Ready';

    @Input()
    public isSmall: boolean = false;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.statusCode) {
            this.statusCode = changes.statusCode.currentValue ? changes.statusCode.currentValue : '0';
        }

        if (changes.statusText) {
            this.statusText = changes.statusText.currentValue ? changes.statusText.currentValue : 'Ready';
        }
    }
}
