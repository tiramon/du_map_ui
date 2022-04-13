import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvgOrePrice } from '@tiramon/du-market-api';

import { inputItem } from '../../model/inputItem.model';
import itemJson from '../../../../assets/market/items.json';

@Component({
  selector: 'dumap-avg-ore-price',
  templateUrl: './avg-ore-price.component.html',
  styleUrls: ['./avg-ore-price.component.scss']
})
export class AvgOrePriceComponent implements OnInit {
  avgPrices: AvgOrePrice[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.avgPrices = data['avgPrice'].sort((a, b) => {
        const itemA = this.idToItem(a.itemType);
        const itemB = this.idToItem(b.itemType);
        const tierDiff = itemA.Tier - itemB.Tier;
        if (tierDiff === 0) {
          if (itemA.Name < itemB.Name) { return -1; }
          if (itemA.Name > itemB.Name) { return 1; }
          return 0;
        }
        return tierDiff;
      });
    });
  }

  idToItem(itemId: number): inputItem {
    return (itemJson as inputItem[]).filter((item: inputItem) => item.NqId === itemId)[0];
  }

}
