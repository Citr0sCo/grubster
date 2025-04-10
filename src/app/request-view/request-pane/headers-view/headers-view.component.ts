import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHeader } from '../../../toolbar/tabs/types/header.model';

@Component({
    selector: 'headers-view',
    templateUrl: './headers-view.component.html',
    styleUrls: ['./headers-view.component.scss']
})
export class HeadersViewComponent implements OnInit {
    @Input()
    public requestHeaders: IHeader[] = [];

    @Input()
    public isEditable: boolean = true;

    @Input()
    public isVertical: boolean = true;

    @Input()
    public removePadding: boolean = false;

    @Output()
    public headersChanged: EventEmitter<IHeader[]> = new EventEmitter<IHeader[]>();

    public ngOnInit(): void {
        if (!this.hasEmptyHeader() && this.isEditable) {
            this.requestHeaders.push({ key: '', value: '' });
        }
    }

    public headerRemoved(header: IHeader): void {
        this.requestHeaders = this.requestHeaders.filter((x) => x !== header);
        this.headersChanged.emit(this.requestHeaders);
    }

    public headerChanged(index: number, header: IHeader): void {
        this.requestHeaders[index] = header;
        this.headersChanged.emit(this.requestHeaders);
    }

    public hasEmptyHeader(): boolean {
        return !!this.requestHeaders.find((x) => x.key.length === 0 && x.value.length === 0);
    }

    public addHeader(isNew: boolean): void {
        if (!this.hasEmptyHeader()) {
            this.requestHeaders.push({ key: '', value: '' });
        }
    }
}
