import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IHeader } from '../../toolbar/tabs/types/header.model';
import { ITab } from '../../toolbar/tabs/types/tab.model';
import { IEnvironment } from '../../toolbar/tabs/types/environment.model';
import { TabsService } from '../../toolbar/tabs/services/tabs.service';
import { RequestPerformerService } from '../../../modules/request-performer/request-performer.service';
import { SuggestionsService } from './services/suggestions.service';
import { ISuggestion } from './types/suggestion.model';
import { ISettings, SettingsService } from '../../settings.service';
import { HttpVerbs } from '../../../core/http-verbs';
import { BeautifyHelper } from '../../../core/beautify.helper';
import { NotificationService } from '../../../modules/ui/notification/notification.service';
import { ClipboardService } from 'ngx-clipboard';
import { CurlParserService } from '../../../modules/utility/curl-parser/curl-parser.service';

@Component({
    selector: 'request-bar',
    templateUrl: './request-bar.component.html',
    styleUrls: ['./request-bar.component.scss'],
    standalone: false
})
export class RequestBarComponent implements OnInit, OnDestroy {
    @Input()
    public currentTab: ITab;

    public urlbarFocused: boolean = true;
    public suggestionsHovered: boolean = true;
    public suggestions: ISuggestion[] = [];
    public runningTotal: string;
    public showSendOptions: boolean = false;
    public isSubmitting: boolean = false;
    public isAlmostReady: boolean = false;
    public verbs: string[] = HttpVerbs.all();

    private _subscriptions: Subscription = new Subscription();
    private _activatedRoute: ActivatedRoute;
    private _tabsService: TabsService;
    private _tabs: ITab[];
    private _router: Router;
    private _requestPerformerService: RequestPerformerService;
    private _ongoingRequest: Subscription;
    private _requestStartedAt: Date;
    private _suggestionsService: SuggestionsService;
    private _allSuggestions: ISuggestion[];
    private _settingsService: SettingsService;
    private _settings: ISettings;
    private _notificationService: NotificationService;
    private _clipboardService: ClipboardService;
    private _curlParserService: CurlParserService;

    constructor(
        activatedRoute: ActivatedRoute,
        tabsService: TabsService,
        router: Router,
        requestPerformerService: RequestPerformerService,
        suggestionsService: SuggestionsService,
        settingsService: SettingsService,
        notificationService: NotificationService,
        clipboardService: ClipboardService,
        curlParserService: CurlParserService
    ) {
        this._activatedRoute = activatedRoute;
        this._tabsService = tabsService;
        this._router = router;
        this._requestPerformerService = requestPerformerService;
        this._suggestionsService = suggestionsService;
        this._settingsService = settingsService;
        this._notificationService = notificationService;
        this._clipboardService = clipboardService;
        this._curlParserService = curlParserService;
    }

    public ngOnInit(): void {
        this._subscriptions.add(
            this._settingsService.settings.subscribe((settings: ISettings) => {
                this._settings = settings;
            })
        );

        this._subscriptions.add(
            this._tabsService.tabs.subscribe((tabs: ITab[]) => {
                this._tabs = tabs;
            })
        );

        this._subscriptions.add(
            this._tabsService.activeTab.subscribe((activeTab: ITab) => {
                this.currentTab = activeTab;
            })
        );

        this._subscriptions.add(
            this._suggestionsService.suggestions.subscribe((suggestions: ISuggestion[]) => {
                this._allSuggestions = suggestions;
            })
        );

        this._subscriptions.add(
            this._activatedRoute.params.subscribe((payload) => {
                if (!payload.id) {
                    if (this._tabs.length > 0) {
                        this._router.navigate(['/request', this._tabs[0].id]);
                    } else {
                        this._router.navigate(['/dashboard']);
                    }
                }
            })
        );
    }

    public onUrlChange(tab: ITab): void {
        if (this.currentTab.url.indexOf('curl') === 0) {
            this.parseCurlString(this.currentTab.url);
            this._notificationService.logSuccess('Success!', 'Imported CURL request successfully!');
            return;
        }

        this.suggestions = this._allSuggestions.filter((x) => x.value.toUpperCase().indexOf(tab.url.toUpperCase()) > -1);
    }

    public parseCurlString(curlRequest: string): void {
        const parsedCurlRequest = this._curlParserService.parseCurl(curlRequest);
        this.currentTab.method = parsedCurlRequest.method;
        this.currentTab.url = parsedCurlRequest.url;
        this.currentTab.request.headers = parsedCurlRequest.headers;
        this.currentTab.request.body = parsedCurlRequest.body;
    }

    public replaceAll(needle: string, needleNew: string, haystack: string): string {
        while (haystack.indexOf(needle) > -1) {
            haystack = haystack.replace(needle, needleNew);
        }
        return haystack;
    }

    public copyCurlToClipboard(tab: ITab): void {
        let curlString = `curl '${tab.url}' \\ \n`;

        curlString += `-X '${tab.method.toUpperCase()}' \\ \n`;

        for (const header of tab.request.headers) {
            curlString += `-H '${header.key}: ${header.value}' \\ \n`;
        }

        curlString += `--data-raw '${this.replaceAll('\\"', '"', BeautifyHelper.uglify(JSON.stringify(tab.request.body)))}' \\ \n`;

        curlString += `--compressed`;

        this._clipboardService.copyFromContent(curlString);
        this._notificationService.logSuccess('Success!', 'Exported CURL into clipboard successfully!');
    }

    public performRequest(currentTab: ITab): void {
        this.isSubmitting = true;
        this._requestStartedAt = new Date();
        this.getRunningTotal();
        this._suggestionsService.addSuggestion(currentTab.url);

        if (this._settings.autoBeautifyRequestBodyOnSend) {
            currentTab.request.body = BeautifyHelper.beautify(currentTab.request.body);
        }

        this._ongoingRequest = this._requestPerformerService.perform(currentTab).subscribe((payload: ITab) => {
            this.isSubmitting = false;
            this.currentTab = payload;
        });
    }

    public cancelRequest(): void {
        if (this._ongoingRequest) {
            this._ongoingRequest.unsubscribe();
            this.isSubmitting = false;
        }
    }

    public getRunningTotal(): void {
        // tslint:disable-next-line:ban
        setTimeout(() => {
            this.runningTotal = this.formatResponseTime(new Date().valueOf() - this._requestStartedAt.valueOf());
            if (this.isSubmitting) {
                this.getRunningTotal();
            }
        }, 100);
    }

    public formatResponseTime(timeInMs: any): string {
        let response = '';
        const time = new Date(timeInMs);

        const minutes = time.getMinutes();
        if (minutes > 0) {
            response += `${minutes}<small>m</small>`;
        }

        const seconds = time.getSeconds();
        if (seconds > 0) {
            response += ` ${seconds}<small>s</small>`;
        }

        const ms = time.getMilliseconds();
        if (ms > 0 && seconds < 10 && minutes < 1) {
            response += ` ${ms}<small>ms</small>`;
        }

        return response;
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    public barLoseFocus(): void {
        this.urlbarFocused = false;
    }
}
