import { Injectable, Provider } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { version } from '../../package.json';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    public static forRoot(): Provider {
        return {
            provide: HTTP_INTERCEPTORS,
            useClass: AppInterceptor,
            multi: true
        };
    }

    // eslint-disable-next-line
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = request.headers;
        return next.handle(request.clone({ headers: headers }));
    }
}
