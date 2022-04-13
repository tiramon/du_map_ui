import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/component/map/map.component';
import { SelectedTileResolver } from './map/resolver/selected-tile-resolver';
import { MarketComponent } from './market/components/market/market.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/map', pathMatch: 'full'
  },
  {
    path: 'map',
    resolve: {
      selectedTile: SelectedTileResolver
    },
    component: MapComponent,
    loadChildren: () => import('./map/map.module').then(m => m.MapModule)
  },
  {
    path: 'market',
    component: MarketComponent,
    loadChildren: () => import('./market/market.module').then(m => m.MarketModule)
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
