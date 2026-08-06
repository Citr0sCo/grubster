import { PreviewViewComponent } from './preview-view.component';

describe('PreviewViewComponent', () => {
    it('renders HTML responses through srcdoc with the request URL as base', () => {
        const component = new PreviewViewComponent();
        const iframe = document.createElement('iframe');
        component.iframe = { nativeElement: iframe } as any;
        component.requestUrl = 'https://www.miloszdura.com/';
        component.requestBody = '<!doctype html><html><head><link rel="stylesheet" href="styles.css"></head><body>Preview</body></html>';

        component.ngAfterViewInit();

        expect(iframe.srcdoc).toContain('<base href="https://www.miloszdura.com/">');
        expect(iframe.srcdoc).toContain('href="styles.css"');
        expect(iframe.getAttribute('src')).toBeNull();
    });

    it('updates the preview when the response body changes', () => {
        const component = new PreviewViewComponent();
        const iframe = document.createElement('iframe');
        component.iframe = { nativeElement: iframe } as any;
        component.requestBody = '<!doctype html><html><body>First</body></html>';
        component.ngAfterViewInit();

        component.requestBody = '<!doctype html><html><body>Second</body></html>';
        component.ngOnChanges({ requestBody: {} as any });

        expect(iframe.srcdoc).toContain('Second');
    });
});
