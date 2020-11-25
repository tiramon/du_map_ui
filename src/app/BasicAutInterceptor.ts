import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';



@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(
        private oauthService: OAuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available

        if (request.url.indexOf('www.dumap.de') < 0) {
            return next.handle(request);
        }
        const currentUser = this.oauthService.getAccessToken();
        if (currentUser) {
            console.log('logedin');
            request = request.clone({
                setHeaders: {
                    Authorization: `Basic ${this.oauthService.getAccessToken()}`
                }
            });
        }

        return next.handle(request);
    }
}