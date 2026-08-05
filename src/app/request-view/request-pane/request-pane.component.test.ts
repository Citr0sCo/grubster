import '@angular/compiler';
import { of } from 'rxjs';
import { RequestPaneComponent } from './request-pane.component';

describe('RequestPaneComponent', () => {
    const createComponent = (): RequestPaneComponent => new RequestPaneComponent({ settings: of({}) } as any);

    it('detects credentials without mutating reactive state during rendering', () => {
        const component = createComponent();
        component.currentTab = { request: { auth: { username: 'user', password: '' } } } as any;
        component.requestBody = '{"Credentials":{"ApiKey":"key"}}';

        expect(component.hasMultipleCredentials()).toBe(true);
        expect(component.credentialLocations).toBe('basic auth, body');
    });

    it('ignores invalid request bodies when checking credentials', () => {
        const component = createComponent();
        component.currentTab = { request: { auth: { username: '', password: '' } } } as any;
        component.requestBody = 'not json';

        expect(component.hasMultipleCredentials()).toBe(false);
        expect(component.credentialLocations).toBe('');
    });
});
