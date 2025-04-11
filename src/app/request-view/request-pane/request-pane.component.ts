import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ITab } from '../../toolbar/tabs/types/tab.model';
import { IRequestTypeModel } from './types/request-type.model';
import { IHeader } from '../../toolbar/tabs/types/header.model';
import { HttpResponseMapper } from '../../../modules/request-performer/mappers/http-response.mapper';
import { ISettings, SettingsService } from '../../settings.service';
import { Subscription } from 'rxjs';
import { JsonPathHelper } from '../../../core/json-path.helper';
import { BeautifyHelper } from '../../../core/beautify.helper';

@Component({
    selector: 'request-pane',
    templateUrl: './request-pane.component.html',
    styleUrls: ['./request-pane.component.scss'],
    standalone: false
})
export class RequestPaneComponent implements OnInit, OnDestroy {
    @Input()
    public currentTab: ITab;

    @Input()
    public requestBody: string;

    @Input()
    public requestHeaders: IHeader[];

    @Input()
    public requestLanguage: string;

    @Input()
    public areHeadersEditable: boolean = true;

    @Input()
    public isReadOnly: boolean = false;

    @Input()
    public extraTabs: string[];

    @Input()
    public isVertical: boolean = true;

    @Input()
    public isFilterable: boolean = false;

    @Output()
    public bodyChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    public headersChanged: EventEmitter<IHeader[]> = new EventEmitter<IHeader[]>();

    @Output()
    public languageChanged: EventEmitter<string> = new EventEmitter<string>();

    public settings: ISettings;
    public credentialLocations: string;
    public selectedTab: IRequestTypeModel;
    public tabs: IRequestTypeModel[] = [
        { id: 'body', name: 'Body' },
        { id: 'headers', name: 'Headers' }
    ];
    public availableTabs: IRequestTypeModel[] = [
        { id: 'body', name: 'Body' },
        { id: 'headers', name: 'Headers' },
        { id: 'basic-auth', name: 'Basic Auth' },
        { id: 'preview', name: 'Preview' }
    ];
    public languages: string[] = HttpResponseMapper.languages;

    private _subscriptions: Subscription = new Subscription();
    private _settingsService: SettingsService;

    constructor(settingsService: SettingsService) {
        this._settingsService = settingsService;
    }

    public get filteredRequestBody(): string {
        if (!this.isFilterable) {
            return this.requestBody;
        }

        const requestFilter = this.currentTab.jsonPathQuery?.trim();

        if (requestFilter === '' || !this.requestBody) {
            return '';
        }

        return JsonPathHelper.apply(this.requestBody, requestFilter);
    }

    public ngOnInit(): void {
        this.extraTabs.forEach((tab) => {
            const foundTab = this.availableTabs.find((availableTab) => availableTab.id === tab);
            if (foundTab) {
                this.tabs.push(foundTab);
            }
        });
        this.selectedTab = this.tabs[0];

        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings) => {
                this.settings = settings;
            })
        );
    }

    public updateBody($event: string): void {
        this.bodyChanged.emit($event);
    }

    public updateHeaders($event: IHeader[]): void {
        this.headersChanged.emit($event);
    }

    public updateLanguage($event: string): void {
        this.languageChanged.emit($event);
    }

    public hasAuth(currentTab: ITab): boolean {
        return currentTab.request.auth?.username !== '';
    }

    public hasHeaders(): boolean {
        return this.requestHeaders?.length > 0;
    }

    public hasBody(): boolean {
        return this.requestBody?.length > 0;
    }

    public hasMultipleCredentials(): boolean {
        const foundCredentials = [];

        if (this.hasAuth(this.currentTab)) {
            foundCredentials.push('basic auth');
        }

        try {
            if (JSON.parse(this.requestBody)?.Credentials?.ApiKey) {
                foundCredentials.push('body');
            }
        } catch (e) {
            // do nothing
        }

        this.credentialLocations = foundCredentials.join(', ');
        return foundCredentials.length > 1;
    }

    public beautifyRequestBody(): void {
        try {
            this.requestBody = BeautifyHelper.beautify(this.requestBody);
        } catch (e) {
            return;
        }
    }

    public toggleDirection(): void {
        this.settings.isEditorVertical = !this.isVertical;
        this._settingsService.update(this.settings);
    }

    public toggleWordWrap(): void {
        this.settings.editorWordWrap = !this.settings.editorWordWrap;
        this._settingsService.update(this.settings);
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
