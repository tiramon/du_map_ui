import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
    {
        path: 'itemType/:itemType',
        component: OrderDetailComponent,
        resolve: {
          stats: OrderStatsResolver,
          item: ItemResolver
        }
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRoutingModule { }
