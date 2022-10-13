import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { inputItem } from '../model/inputItem.model';
import { ShareService } from '../services/share.service';
import { CalcService } from '../services/calc.service';

@Injectable({ providedIn: 'root' })
export class ItemResolver implements Resolve<inputItem> {
  constructor(
    private shareService: ShareService,
    private itemService: CalcService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<inputItem>|Promise<inputItem>|inputItem {
    const itemTypeValue = route.paramMap.get('itemType');
    const itemType: number|undefined = itemTypeValue ? +itemTypeValue : undefined;

    const item = this.itemService.itemByNqId(itemType);

    this.shareService.currentItem$.next(item);
    return item;
  }
}
