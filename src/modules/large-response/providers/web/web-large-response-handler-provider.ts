import { ILargeResponseHandlerProvider } from '../../large-response-handler.service';
import { FileSizeService } from '../../../utility/memory/fileSize.service';
import { FileNameService } from '../../../utility/filename/file-name.service';
import { WebFrameworkTools } from '../../../utility/framework/Web/WebFrameworkTools';
import { Injectable } from '@angular/core';

@Injectable()
export class WebLargeResponseHandlerProvider implements ILargeResponseHandlerProvider {
    public handleResponse(payload: any, maxResponseSizeBeforePrompt: number): string {
        const confirmResponse = confirm(
            `Response size is greater than ${FileSizeService.formatByteSize(maxResponseSizeBeforePrompt)} and may not render properly, do you want to save it as a file.`
        );

        if (confirmResponse) {
            WebFrameworkTools.downloadFile(`${payload.url}-${FileNameService.fileSafeDate(new Date(Date.now()))}.json`, payload, true);
            return `Response saved to file due to file size being greater than specified limit of ${FileSizeService.formatByteSize(maxResponseSizeBeforePrompt)}`;
        }
    }
}
