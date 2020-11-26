import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapWrapperComponent } from './component/map-wrapper/map-wrapper.component';
import { SelectedTileResolver } from './resolver/selected-tile-resolver';


const routes: Routes = [
  {
    path: '', redirectTo: '/map', pathMatch: 'full'
  },
  {
    path: 'map/:planetId/:tileId',
    resolve: {selectedTile: SelectedTileResolver},
    component: MapWrapperComponent
  },
  {
    path: 'map',
    resolve: {selectedTile: SelectedTileResolver},
    component: MapWrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
