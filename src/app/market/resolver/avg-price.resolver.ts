import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AvgOrePrice, OrderService } from '@tiramon/du-market-api';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvgPriceResolver implements Resolve<Array<AvgOrePrice>> {
  constructor(private api: OrderService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<AvgOrePrice>>|Promise<Array<AvgOrePrice>>|Array<AvgOrePrice> {
    return this.api.getAvgOrePrices();
  }
}
