import { Component, Input } from '@angular/core';

@Component({
    selector: 'time-taken-indicator',
    templateUrl: './time-taken-indicator.component.html',
    styleUrls: ['./time-taken-indicator.component.scss']
})
export class TimeTakenIndicatorComponent {
    @Input()
    public timeTaken: Date = new Date();

    @Input()
    public isSmall: boolean = false;

    public formatResponseTime(timeInMs: Date): string {
        let response = '';
        const time = new Date(timeInMs);

        const minutes = time.getMinutes();
        if (minutes > 0) {
            response += `${minutes}<small>m</small>`;
        }

        const seconds = time.getSeconds();
        if (seconds > 0) {
            response += ` ${seconds}<small>s</small>`;
        }

        const ms = time.getMilliseconds();
        if (ms > 0 && seconds < 10) {
            response += ` ${ms}<small>ms</small>`;
        }

        if (response.length === 0) {
            response = '<small>ms</small>';
        }

        return response;
    }
}
