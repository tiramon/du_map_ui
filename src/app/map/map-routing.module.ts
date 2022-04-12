import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth.guard';
import { MapWrapperComponent } from './component/map-wrapper/map-wrapper.component';
import { ScanListComponent } from './component/scan-list/scan-list.component';
import { SelectedTileResolver } from './resolver/selected-tile-resolver';


const routes: Routes = [
  {
    path: ':planet/:tileId',
    resolve: {selectedTile: SelectedTileResolver},
    component: MapWrapperComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    resolve: {selectedTile: SelectedTileResolver},
    component: MapWrapperComponent
  },
  {
    path: 'scan',
    component: ScanListComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }
