import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Order, OrderService, OrderStats } from "@tiramon/du-market-api";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OrderStatsResolver implements Resolve<Array<OrderStats>> {
  constructor(private service: OrderService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<OrderStats>>|Promise<Array<OrderStats>>|Array<OrderStats> {
    const marketIdValue = route.paramMap.get('marketId');
    const marketId: number|undefined = marketIdValue ? +marketIdValue : undefined;
    const itemTypeValue = route.paramMap.get('itemType');
    const itemType: number|undefined = itemTypeValue ? +itemTypeValue : undefined;
    const planetIdValue = route.paramMap.get('planetId');
    const planetId: number|undefined = planetIdValue ? +planetIdValue : undefined;

    return this.service.getOrdersStats( marketId, itemType, planetId);
  }
}