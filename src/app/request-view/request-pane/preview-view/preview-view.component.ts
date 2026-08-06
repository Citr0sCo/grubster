import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'preview-view',
    templateUrl: './preview-view.component.html',
    styleUrls: ['./preview-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PreviewViewComponent implements AfterViewInit, OnChanges {
    @ViewChild('iframe')
    public iframe!: ElementRef<HTMLIFrameElement>;

    @Input()
    public requestBody: string = '';

    @Input()
    public isVertical: boolean = true;

    @Input()
    public requestUrl: string = '';

    public ngAfterViewInit(): void {
        this.renderPreview();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['requestBody'] || changes['requestUrl']) {
            this.renderPreview();
        }
    }

    private renderPreview(): void {
        if (!this.iframe?.nativeElement) {
            return;
        }

        const frame = this.iframe.nativeElement;
        if (this.isHtmlDocument(this.requestBody)) {
            frame.removeAttribute('src');
            frame.srcdoc = this.prepareHtmlDocument(this.requestBody);
            return;
        }

        frame.removeAttribute('srcdoc');
        const iframeDoc = frame.contentDocument || frame.contentWindow?.document;
        if (!iframeDoc) {
            return;
        }

        iframeDoc.open();
        iframeDoc.write(this.requestBody);
        iframeDoc.close();
    }

    private isHtmlDocument(body: string): boolean {
        return /^\s*(?:<!doctype\s+html|<html(?:\s|>))/i.test(body);
    }

    private prepareHtmlDocument(body: string): string {
        if (!this.requestUrl) {
            return body;
        }

        const baseTag = `<base href="${this.escapeAttribute(this.requestUrl)}">`;
        if (/<base\b[^>]*>/i.test(body)) {
            return body.replace(/<base\b[^>]*>/i, baseTag);
        }

        if (/<head(?:\s[^>]*)?>/i.test(body)) {
            return body.replace(/<head(?:\s[^>]*)?>/i, (headTag) => `${headTag}${baseTag}`);
        }

        return `${baseTag}${body}`;
    }

    private escapeAttribute(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
