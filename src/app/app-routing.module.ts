import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapWrapperComponent } from './map/component/map-wrapper/map-wrapper.component';
import { MapComponent } from './map/component/map/map.component';
import { ScanListComponent } from './map/component/scan-list/scan-list.component';
import { SelectedTileResolver } from './map/resolver/selected-tile-resolver';


const routes: Routes = [
  {
    path: '', redirectTo: '/map', pathMatch: 'full'
  },
  {
    path: 'map',
    resolve: {selectedTile: SelectedTileResolver},
    component: MapComponent,
    loadChildren: () => import('./map/map.module').then(m => m.MapModule)
  }
  /*,
  {  path: 'market'}
  */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
