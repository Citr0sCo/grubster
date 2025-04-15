import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'preview-view',
    templateUrl: './preview-view.component.html',
    styleUrls: ['./preview-view.component.scss'],
    standalone: false
})
export class PreviewViewComponent implements AfterViewInit {
    @ViewChild('iframe')
    public iframe!: ElementRef;

    @Input()
    public requestBody: string;

    @Input()
    public isVertical: boolean = true;

    @Input()
    public requestUrl: string;

    public ngAfterViewInit() {
        if (this.requestBody.indexOf('<!DOCTYPE') === 0) {
            this.iframe.nativeElement.setAttribute('src', this.requestUrl);
        } else {
            const iframeDoc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(this.requestBody);
            iframeDoc.close();
        }
    }
}
