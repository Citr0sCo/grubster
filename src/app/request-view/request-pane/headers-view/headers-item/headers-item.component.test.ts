import { HeadersItemComponent } from './headers-item.component';

describe('HeadersItemComponent', () => {
    it('loads header suggestions from the JSON list', () => {
        const component = new HeadersItemComponent();
        component.header = { key: 'Acc', value: '' };

        component.headerKeyChanged(component.header);

        expect(component.suggestions.map((suggestion) => suggestion.value)).toContain('Accept');
    });
});
