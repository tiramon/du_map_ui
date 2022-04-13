import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Order, OrderService } from "@tiramon/du-market-api";
import { Observable } from "rxjs";

import { inputItem } from '../model/inputItem.model';
import itemJson from '../../../assets/market/items.json';
import { ShareService } from '../services/share.service';

@Injectable({ providedIn: 'root' })
export class ItemResolver implements Resolve<inputItem> {
  constructor(private shareService: ShareService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<inputItem>|Promise<inputItem>|inputItem {
    const itemTypeValue = route.paramMap.get('itemType');
    const itemType: number|undefined = itemTypeValue ? +itemTypeValue : undefined;

    const result: inputItem[] = (itemJson as inputItem[]).filter((item: inputItem) => item.NqId === itemType);
    this.shareService.currentItem$.next(result[0]);
    console.log('new item');
    return result[0];
  }
}
