import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService, public router: Router) {}

  canActivate(): boolean {
    const validId = this.oauthService.getAccessTokenExpiration() > Date.now();
    if (!validId) {
      console.log('unauthenticated', validId);
      this.router.navigate(['map']);
      return false;
    }
    return true;
  }
}
