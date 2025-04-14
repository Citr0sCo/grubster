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

        for (const header of payload.Headers) {
            headers.push({ key: header.Key, value: header.Value });
        }

        return {
            headers: headers,
            body: this.mapBody(payload),
            statusCode: payload.StatusCode,
            statusText: payload.StatusDescription,
            timeTaken: new Date(0),
            occurredAt: new Date(),
            size: headers.find((x) => x.key.toUpperCase() === 'Content-Length'.toUpperCase())?.value ?? FileSizeService.memorySizeOf(JSON.stringify(payload.Body)),
            language: headers.find((x) => x.key.toUpperCase() === 'Content-Type'.toUpperCase())
                ? HttpResponseMapper.languages.find((x) => headers.find((x) => x.key.toUpperCase() === 'Content-Type'.toUpperCase())?.value.toUpperCase().indexOf(x.toUpperCase()) > -1)
                : 'JSON'
        };
    }

    public ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    private mapBody(payload: any): string {

        if (payload.Body.indexOf('<') === 0) {
            return payload.Body;
        }

        if (payload.StatusCode === 0) {
            return JSON.parse(payload.Body);
        }

        const maxResponseSizeBeforePrompt = this._settings.maxResponseSizeBeforePromptInBytes;
        if (FileSizeService.sizeOf(payload.Body) > maxResponseSizeBeforePrompt) {
            const handledResponse = this._largeResponseHandlerService.handleResponse(payload, maxResponseSizeBeforePrompt);

            if (handledResponse) {
                return handledResponse;
            }
        }

        if (payload.Body) {
            if (this._settings.autoBeautifyResponseBodyOnSend) {
                return JSON.stringify(JSON.parse(payload.Body), null, 4);
            }
            return JSON.stringify(JSON.parse(payload.Body));
        }

        if (typeof payload.Error === 'object') {
            return JSON.stringify(payload.Error, null, 4);
        }

        if (payload.Error) {
            return payload.Error;
        }

        return JSON.parse(payload.Body);
    }
}
