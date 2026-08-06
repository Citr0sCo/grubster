import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'payload-size-indicator',
    templateUrl: './payload-size-indicator.component.html',
    styleUrls: ['./payload-size-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PayloadSizeIndicatorComponent {
    @Input()
    public payloadSize: string = '';

    @Input()
    public isSmall: boolean = false;

    public getResponseSize(payloadSize: string | number | undefined | null): string {
        const size = this.formatResponseSize(payloadSize);
        return `${size.value} <small>${size.type}</small>`;
    }

    public formatResponseSize(payloadSize: string | number | undefined | null): { value: string; type: string } {
        if (payloadSize === undefined || payloadSize === null || payloadSize === '') {
            return { value: '0', type: 'bytes' };
        }

        if (typeof payloadSize === 'string') {
            const formatted = payloadSize.trim().match(/^(-?\d+(?:\.\d+)?)\s*(bytes?|b|kib|kb|mib|mb|gib|gb)$/i);
            if (formatted) {
                const type = formatted[2].toLowerCase();
                const units: { [key: string]: string } = {
                    b: 'bytes',
                    byte: 'bytes',
                    bytes: 'bytes',
                    kib: 'KB',
                    kb: 'KB',
                    mib: 'MB',
                    mb: 'MB',
                    gib: 'GB',
                    gb: 'GB'
                };
                return { value: formatted[1], type: units[type] };
            }
        }

        const bytes = Number(payloadSize);
        if (!Number.isFinite(bytes)) {
            return { value: String(payloadSize), type: 'bytes' };
        }

        const units = ['bytes', 'KB', 'MB', 'GB'];
        let value = Math.abs(bytes);
        let unitIndex = 0;
        while (value >= 1000 && unitIndex < units.length - 1) {
            value /= 1000;
            unitIndex++;
        }

        return {
            value: unitIndex === 0 ? String(bytes) : value.toFixed(1),
            type: units[unitIndex]
        };
    }
}
