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

        const currentUser = this.oauthService.getAccessToken();
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.oauthService.getAccessToken()}`
                }
            });
        }

        return next.handle(request);
    }
}