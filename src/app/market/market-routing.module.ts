import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvgOrePriceComponent } from './components/avg-ore-price/avg-ore-price.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AvgPriceResolver } from './resolver/avg-price.resolver';
import { ItemResolver } from './resolver/item.resolver';
import { OrderStatsResolver } from './resolver/order-stats.resolver';



const routes: Routes = [
    {
      path: '',
      redirectTo: 'avg',
      pathMatch: 'full'
    },

    {
      path: 'itemType/:itemType',
      component: OrderDetailComponent,
      resolve: {
        stats: OrderStatsResolver,
        item: ItemResolver,
        avgPrice: AvgPriceResolver
      }
    },
    {
      path: 'avg',
      component: AvgOrePriceComponent,
      resolve: {
        avgPrice: AvgPriceResolver
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
