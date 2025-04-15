import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITab } from '../../app/toolbar/tabs/types/tab.model';
import { Observable, of, Subscription } from 'rxjs';
import { timeoutWhen } from '../utility/operators/timeout-when';
import { HttpResponseMapper } from './mappers/http-response.mapper';
import { catchError, map } from 'rxjs/operators';
import { Guid } from '../../core/guid';
import { HistoryService } from '../../app/sidebar/history-view/services/history.service';
import { HttpRequestMapper } from './mappers/http-request.mapper';
import { ISettings, SettingsService } from '../../app/settings.service';
import { environment } from '../../environments/environment';

@Injectable()
export class RequestPerformerService implements OnDestroy {
    private _httpClient: HttpClient;
    private _historyService: HistoryService;
    private _settings: ISettings;
    private _httpRequestMapper: HttpRequestMapper;
    private _httpResponseMapper: HttpResponseMapper;
    private _subscriptions: Subscription = new Subscription();

    constructor(
        httpClient: HttpClient,
        historyService: HistoryService,
        settingsService: SettingsService,
        httpRequestMapper: HttpRequestMapper,
        httpResponseMapper: HttpResponseMapper
    ) {
        this._httpClient = httpClient;
        this._historyService = historyService;
        this._httpRequestMapper = httpRequestMapper;
        this._httpResponseMapper = httpResponseMapper;

        this._subscriptions.add(
            settingsService.settings.subscribe((settings) => {
                this._settings = settings;
            })
        );
    }

    public perform(tab: ITab, addToHistory: boolean = true): Observable<ITab> {
        const startTime = new Date();
        const url = this.sanitizeUrl(tab.url);

        return this._httpClient
            .request('POST', `${environment.apiUrl}/api/request`, {
                body: { Method: tab.method, Url: url, Headers: tab.request.headers, Body: tab.request.body, Settings: {} },
                observe: 'response'
            })
            .pipe(timeoutWhen(this._settings.requestTimeoutInMs && `${this._settings.requestTimeoutInMs}` !== '0', this._settings.requestTimeoutInMs))
            .pipe(
                map((payload: any) => {
                    tab.response = this._httpResponseMapper.map(payload.body);
                    tab.response.timeTaken = new Date(new Date().getTime() - startTime.getTime());
                    if (addToHistory) {
                        this._historyService.addEntry(tab);
                    }
                    return tab;
                }),
                catchError((error: any) => {
                    console.log(error);
                    tab.response = this._httpResponseMapper.map(error);
                    tab.response.timeTaken = new Date(new Date().getTime() - startTime.getTime());
                    if (addToHistory) {
                        this._historyService.addEntry(tab);
                    }
                    return of(tab);
                })
            );
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    private sanitizeUrl(url: string): string {
        url = url.trim();

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `http${this._settings.defaultToHttps ? 's' : ''}://${url}`;
    }
}
