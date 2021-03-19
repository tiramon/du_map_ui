import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './component/help/help.component';
import { MapWrapperComponent } from './component/map-wrapper/map-wrapper.component';
import { ScanListComponent } from './component/scan-list/scan-list.component';
import { ShareDialogComponent } from './component/share-dialog/share-dialog.component';
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
  },
  {
    path: 'scan',
    component: ScanListComponent
  },
  {
    path: 'help',
    component: HelpComponent
  },
  {
    path: 'share',
    component: ShareDialogComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
