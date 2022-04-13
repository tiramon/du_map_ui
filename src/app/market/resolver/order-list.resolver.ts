import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Order, OrderService } from "@tiramon/du-market-api";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OrderListResolver implements Resolve<Array<Order>> {
  constructor(private service: OrderService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<Order>>|Promise<Array<Order>>|Array<Order> {
    const active: boolean|undefined = (/true/i).test(route.paramMap.get('active') ?? '');
    const marketIdValue = route.paramMap.get('marketId');
    const marketId: number|undefined = marketIdValue ? +marketIdValue : undefined;
    const itemTypeValue = route.paramMap.get('itemType');
    const itemType: number|undefined = itemTypeValue ? +itemTypeValue : undefined;
    const planetIdValue = route.paramMap.get('planetId');
    const planetId: number|undefined = planetIdValue ? +planetIdValue : undefined;

    return this.service.getOrders( active, marketId, itemType, planetId);
  }
}