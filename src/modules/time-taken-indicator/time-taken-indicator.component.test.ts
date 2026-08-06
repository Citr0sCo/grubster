import { TimeTakenIndicatorComponent } from './time-taken-indicator.component';

describe('TimeTakenIndicatorComponent', () => {
    it('shows zero seconds before a request has completed', () => {
        const component = new TimeTakenIndicatorComponent();

        expect(component.formatResponseTime(component.timeTaken)).toBe('0<small>s</small>');
    });
});
