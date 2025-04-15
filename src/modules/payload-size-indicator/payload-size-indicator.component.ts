import { Component, Input } from '@angular/core';

@Component({
    selector: 'payload-size-indicator',
    templateUrl: './payload-size-indicator.component.html',
    styleUrls: ['./payload-size-indicator.component.scss'],
    standalone: false
})
export class PayloadSizeIndicatorComponent {
    @Input()
    public payloadSize: string = '';

    @Input()
    public isSmall: boolean = false;

    public getResponseSize(payloadSize: any): string {
        const size = this.formatResponseSize(payloadSize);

        if (typeof size.value === 'string') {
            if (size.value.indexOf('B') > -1) {
                return `${size.value.replace('B', '')}<small>bytes</small>`;
            }
            if (size.value.indexOf('KiB') > -1) {
                return `${size.value.replace('KiB', '')}<small>Kb</small>`;
            }
            if (size.value.indexOf('MiB') > -1) {
                return `${size.value.replace('MiB', '')}<small>Mb</small>`;
            }
            if (size.value.indexOf('GiB') > -1) {
                return `${size.value.replace('GiB', '')}<small>Gb</small>`;
            }
        }

        return `${size.value} <small>${size.type}</small>`;
    }

    public formatResponseSize(bytes: any): { value: string; type: string } {
        let formattedResponseSize = bytes;

        if (bytes === undefined) {
            return {
                value: '0',
                type: 'bytes'
            };
        }

        let formattedResponseSizeType = 'bytes';
        if (formattedResponseSize > Math.pow(1000, 3)) {
            formattedResponseSize = formattedResponseSize / Math.pow(1000, 3);
            formattedResponseSizeType = 'Gb';
        } else if (formattedResponseSize > Math.pow(1000, 2)) {
            formattedResponseSize = formattedResponseSize / Math.pow(1000, 2);
            formattedResponseSizeType = 'Mb';
        } else if (formattedResponseSize > 1000) {
            formattedResponseSize = formattedResponseSize / 1000;
            formattedResponseSizeType = 'Kb';
        }

        return {
            value: formattedResponseSize,
            type: formattedResponseSizeType
        };
    }
}
