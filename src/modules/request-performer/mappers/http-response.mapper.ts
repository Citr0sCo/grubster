import { IResponse } from '../../../app/toolbar/tabs/types/response.model';
import { IHeader } from '../../../app/toolbar/tabs/types/header.model';
import { ISettings, SettingsService } from '../../../app/settings.service';
import { FileSizeService } from '../../utility/memory/fileSize.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LargeResponseHandlerService } from '../../large-response/large-response-handler.service';

@Injectable()
export class HttpResponseMapper implements OnDestroy {
    public static languages: string[] = ['JSON', 'XML', 'HTML', 'Text', 'JavaScript', 'FormData'];

    private _settings: ISettings;
    private _subscriptions: Subscription = new Subscription();
    private _largeResponseHandlerService: LargeResponseHandlerService;

    constructor(settingsService: SettingsService, largeResponseHandlerService: LargeResponseHandlerService) {
        this._largeResponseHandlerService = largeResponseHandlerService;
        this._subscriptions.add(
            settingsService.settings.subscribe((settings) => {
                this._settings = settings;
            })
        );
    }

    public map(payload: any): IResponse {
        const headers: IHeader[] = [];

        if (payload.headers) {
            payload.headers.keys().forEach((key: string) => {
                headers.push({ key: key, value: payload.headers.get(key) });
            });
        }

        return {
            headers: headers,
            body: this.mapBody(payload),
            statusCode: payload.status,
            statusText: payload.statusText,
            timeTaken: new Date(0),
            occurredAt: new Date(),
            size: payload.headers?.get('Content-Length') ?? FileSizeService.memorySizeOf(JSON.stringify(payload.body)),
            language: payload.headers?.get('content-type')
                ? HttpResponseMapper.languages.find((x) => payload.headers?.get('content-type').toUpperCase().indexOf(x.toUpperCase()) > -1)
                : 'JSON'
        };
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    private mapBody(payload: any): string {
        if (payload.status === 0) {
            return payload.message;
        }

        const maxResponseSizeBeforePrompt = this._settings.maxResponseSizeBeforePromptInBytes;
        if (FileSizeService.sizeOf(payload.body) > maxResponseSizeBeforePrompt) {
            const handledResponse = this._largeResponseHandlerService.handleResponse(payload, maxResponseSizeBeforePrompt);

            if (handledResponse) {
                return handledResponse;
            }
        }

        if (payload.body) {
            if (this._settings.autoBeautifyResponseBodyOnSend) {
                return JSON.stringify(payload.body, null, 4);
            }
            return JSON.stringify(payload.body);
        }

        if (typeof payload.error === 'object') {
            return JSON.stringify(payload.error, null, 4);
        }

        if (payload.error) {
            return payload.error;
        }

        return payload.message;
    }
}
