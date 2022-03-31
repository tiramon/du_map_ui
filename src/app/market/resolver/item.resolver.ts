import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Order, OrderService } from "@tiramon/du-market-api";
import { Observable } from "rxjs";

import { inputItem } from '../model/inputItem.model';
import itemJson from '../../assets/items.json';

@Injectable({ providedIn: 'root' })
export class ItemResolver implements Resolve<inputItem> {
  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<inputItem>|Promise<inputItem>|inputItem {
    const itemTypeValue = route.paramMap.get('itemType');
    const itemType: number|undefined = itemTypeValue ? +itemTypeValue : undefined;
    
    const result: inputItem[] = (itemJson as inputItem[]).filter((item: inputItem) => item.NqId === itemType);
    return result[0];
  }
}