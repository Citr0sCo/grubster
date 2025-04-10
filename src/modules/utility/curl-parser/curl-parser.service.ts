import { Injectable } from '@angular/core';
import { IParsedCurlRequest } from './types/parsed-curl.request';
import { BeautifyHelper } from '../../../core/beautify.helper';

@Injectable()
export class CurlParserService {
    public parseCurl(curlRequest: string): IParsedCurlRequest {
        const response: IParsedCurlRequest = { url: '', headers: [], method: 'GET', body: '' };
        const explodedCurlRequest = curlRequest.split(' \\ ');

        response.url = explodedCurlRequest[0].replace('curl', '').replace(/'/g, '').trim();

        for (const key of explodedCurlRequest) {
            if (key.indexOf('curl') === 0) {
                continue;
            }

            if (key.indexOf('-X') > -1) {
                const parsedMethod = key.replace('-X', '').replace(/'/g, '').trim();
                response.method = parsedMethod.toLowerCase();
            }

            if (key.indexOf('-H') > -1) {
                const parsedHeader = key.replace('-H', '').replace(/'/g, '').trim();

                const splitHeader = parsedHeader.split(':');

                const headerKey = splitHeader.shift();
                let headerValue = '';

                for (const headerValuePiece of splitHeader) {
                    headerValue += headerValuePiece;
                }

                response.headers.push({ key: headerKey.trim(), value: headerValue.trim() });
            }

            if (key.indexOf('--data-raw') > -1) {
                const parsedBody = key.replace('--data-raw', '').replace("'{", '{').replace("}'", '}').trim();
                response.body = BeautifyHelper.beautify(parsedBody);
            }
        }

        return response;
    }
}
