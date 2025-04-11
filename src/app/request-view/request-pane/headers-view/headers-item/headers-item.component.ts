import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHeader } from '../../../../toolbar/tabs/types/header.model';
import { ISuggestion } from '../../../request-bar/types/suggestion.model';
import * as headers from '../../../../../assets/data/headers.json';

@Component({
    selector: 'headers-item',
    templateUrl: './headers-item.component.html',
    styleUrls: ['./headers-item.component.scss'],
    standalone: false
})
export class HeadersItemComponent implements OnInit {
    @Input()
    public header: IHeader;

    @Input()
    public isEditable: boolean = true;

    @Input()
    public isLastHeader: boolean = false;

    @Output()
    public headerChanged: EventEmitter<IHeader> = new EventEmitter<IHeader>();

    @Output()
    public headerRemoved: EventEmitter<IHeader> = new EventEmitter<IHeader>();

    @Output()
    public addHeader: EventEmitter<boolean> = new EventEmitter<boolean>();

    public suggest: boolean = false;
    public suggestions: ISuggestion[] = [];

    private _allSuggestions: ISuggestion[] = [];

    constructor() {
        this._allSuggestions = headers.map((x: string) => {
            return { id: '', value: x } as ISuggestion;
        });
    }

    public ngOnInit(): void {
        this.addHeader.emit(true);
    }

    public removeHeader(header: IHeader): void {
        this.headerRemoved.emit(header);
    }

    public changeHeader(header: IHeader): void {
        this.headerChanged.emit(header);
    }

    public headerKeyChanged(header: IHeader): void {
        this.suggest = true;
        this.suggestions = this._allSuggestions.filter((x) => x.value.toUpperCase().indexOf(header.key.toUpperCase()) > -1);
        this.changeHeader(header);

        if (this.isValid()) {
            this.addHeader.emit(true);
        }
    }

    public headerValueChanged(header: IHeader): void {
        this.changeHeader(header);

        if (this.isValid()) {
            this.addHeader.emit(true);
        }
    }

    public isValid(): boolean {
        return this.header.key !== '' && this.header.value !== '';
    }
}
