import { Injectable } from '@angular/core';
import { WebLargeResponseHandlerProvider } from './providers/web/web-large-response-handler-provider';

export interface ILargeResponseHandlerProvider {
    handleResponse(payload: any, maxResponseSizeBeforePrompt: number): string;
}

@Injectable()
export class LargeResponseHandlerService implements ILargeResponseHandlerProvider {
    private _largeResponseHandlerProvider: ILargeResponseHandlerProvider;

    constructor(webLargeResponseHandlerProvider: WebLargeResponseHandlerProvider) {
        this._largeResponseHandlerProvider = webLargeResponseHandlerProvider;
    }

    public handleResponse(payload: any, maxResponseSizeBeforePrompt: number): string {
        return this._largeResponseHandlerProvider.handleResponse(payload, maxResponseSizeBeforePrompt);
    }
}
