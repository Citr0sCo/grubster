import { PayloadSizeIndicatorComponent } from './payload-size-indicator.component';

describe('PayloadSizeIndicatorComponent', () => {
    const component = new PayloadSizeIndicatorComponent();

    it('keeps the full bytes label for byte-sized payloads', () => {
        expect(component.getResponseSize('0 Bytes')).toBe('0 <small>bytes</small>');
    });

    it('formats numeric payloads using readable decimal units', () => {
        expect(component.getResponseSize(1500)).toBe('1.5 <small>KB</small>');
    });
});
