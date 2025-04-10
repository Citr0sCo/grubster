import { Component, Input } from '@angular/core';

@Component({
    selector: 'preview-view',
    templateUrl: './preview-view.component.html',
    styleUrls: ['./preview-view.component.scss']
})
export class PreviewViewComponent {
    @Input()
    public requestBody: string;

    @Input()
    public isVertical: boolean = true;
}
