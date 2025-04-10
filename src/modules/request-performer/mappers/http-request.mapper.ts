import { HttpHeaders } from '@angular/common/http';
import { IRequest } from '../../../app/toolbar/tabs/types/request.model';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpRequestMapper {
    public map(request: IRequest): any {
        let headers = new HttpHeaders();
        request.headers.forEach((header) => {
            if (header.key === '' || header.value === '') {
                return;
            }

            headers = headers.append(header.key, header.value);
        });

        if (request.auth.username && request.auth.username !== '' && request.auth.password && request.auth.password !== '') {
            headers = headers.append('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent(`${request.auth.username}:${request.auth.password}`))));
        }

        return {
            headers: headers,
            body: request.body,
            observe: 'response'
        };
    }
}
