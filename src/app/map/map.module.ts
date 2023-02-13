import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { AddScanDialogComponent } from './component/add-scan-dialog/add-scan-dialog.component';
import { DetailWindowComponent } from './component/detail-window/detail-window.component';
import { MapComponentComponent } from './component/map-component/map-component.component';
import { MapSettingsComponent } from './component/map-settings/map-settings.component';
import { MapWrapperComponent } from './component/map-wrapper/map-wrapper.component';
import { ScanListComponent } from './component/scan-list/scan-list.component';

import { SelectedTileResolver } from './resolver/selected-tile-resolver';
import { MapComponent } from './component/map/map.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MapRoutingModule } from './map-routing.module';
import { SortByPipe } from './pipe/SortByPipe';
import { CustomMaxDirective } from './directive/customMax.directive';
import { CustomMinDirective } from './directive/customMin.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login/login.component';

@NgModule({
    declarations: [
      MapComponentComponent,
      DetailWindowComponent,
      AddScanDialogComponent,
      MapSettingsComponent,
      ScanListComponent,
      MapWrapperComponent,
      MapComponent,
      SortByPipe,
      CustomMaxDirective,
      CustomMinDirective,
      LoginComponent
    ],
    imports: [
      CommonModule,
      DataTablesModule,
      FontAwesomeModule,
      FormsModule,
      MapRoutingModule
    ],
    providers: [
      SelectedTileResolver,
      {provide: 'BASEURL', useValue: environment.apiEndpoint},
      {provide: 'PLANETS', useValue: [
        {id: 31, name: 'Alioth', ores: [0, 1, 2, 3, 5, 8], gp: 93, altitude: 200, planetId: 2},
          {id: 17, name: 'Alioth Moon 1', ores: [1, 3, 7, 11], gp: 22, altitude: 0, planetId: 21},
          {id: 18, name: 'Alioth Moon 4', ores:  [0, 2, 4, 9], gp: 22, altitude: 0, planetId: 22},
//        {id: 27, name: 'Feli', ores: [0, 1, 2, 3, 6, 10, 14], gp: 30, altitude: 18300},
//          {id: 8, name: 'Feli Moon 1', ores: [ 1, 2, 6, 17], gp: 10, altitude: 0},
        {id: 32, name: 'Haven', ores: [0, 1, 2, 3], gp: 61, altitude: 80, planetId: 27},
//        {id: 20, name: 'Ion', ores: [1, 5, 8, 13, 18], gp: 33, altitude: 500},
//          {id: 6, name: 'Ion Moon 1', ores: [0, 7, 9, 16], gp: 8, altitude: 0},
//          {id: 14, name: 'Ion Moon 2', ores: [0, 4, 6, 18], gp: 11, altitude: 0},
        {id: 29, name: 'Jago', ores: [0, 3, 8, 12, 17], gp: 45, altitude: 0, planetId: 9},
//        {id: 26, name: 'Lacobus', ores: [2, 7, 11, 14, 17], gp: 41, altitude: 800},
//          {id: 16, name: 'Lacobus Moon 1', ores: [2, 8, 20], gp: 13, altitude: 0},
//          {id: 9, name: 'Lacobus Moon 2', ores: [3, 5, 10, 17], gp: 10, altitude: 0},
//          {id: 13, name: 'Lacobus Moon 3', ores: [1, 11, 18], gp: 11, altitude: 0},
        {id: 19, name: 'Madis', ores: [0, 1, 2, 3, 4, 11], gp: 32, altitude: 750, planetId: 1},
          {id: 1, name: 'Madis Moon 1', ores: [1, 2, 7, 8], gp: 7, altitude: 0, planetId: 10},
          {id: 2, name: 'Madis Moon 2', ores: [2, 3, 6, 10], gp: 8, altitude: 0, planetId: 11},
          {id: 11, name: 'Madis Moon 3', ores:  [0, 3, 4, 9], gp: 11, altitude: 0, planetId: 12},
        {id: 30, name: 'Sanctuary', ores: [0, 1, 2, 3], gp: 61, altitude: 80, planetId: 26},
//        {id: 23, name: 'Sicari', ores: [0, 1, 2, 3, 4, 11, 15], gp: 37, altitude: 130},
//        {id: 24, name: 'Sinnen', ores: [0, 1, 2, 3, 5, 8, 13], gp: 40, altitude: 317},
//          {id: 15, name: 'Sinnen Moon 1', ores: [0, 3, 4, 16], gp: 12, altitude: 0},
//        {id: 22, name: 'Symeon', ores: [0, 4, 9, 12, 20], gp: 36, altitude: 39},
        {id: 25, name: 'Talemai', ores: [0, 1, 2, 3, 5, 7, 10], gp: 42, altitude: 580, planetId: 4},
          {id: 12, name: 'Talemai Moon 1', ores: [ 1, 2, 3, 5, 20], gp: 11, altitude: 0, planetId: 42},
          {id: 3, name: 'Talemai Moon 2', ores: [0, 1, 3, 4, 16], gp: 8, altitude: 0, planetId: 40},
          {id: 4, name: 'Talemai Moon 3', ores: [0, 1, 2, 7, 18], gp: 8, altitude: 0, planetId: 41},
        {id: 28, name: 'Teoma', ores: [1, 2, 7, 10, 13 ], gp: 45, altitude: 700, planetId: 8},
        {id: 21, name: 'Thades', ores: [0, 1, 2, 3, 6, 9], gp: 36, altitude: 13640, planetId: 3},
          {id: 7, name: 'Thades Moon 1', ores: [0, 1, 6, 11], gp: 10, altitude: 0, planetId: 30},
          {id: 10, name: 'Thades Moon 2', ores: [2, 3, 5, 9], gp: 11, altitude: 0, planetId: 31}
      ]},
      {provide: 'ORES', useValue: [
        {name: 'Bauxite',    tier: 1, hc: 10, quanta: 90,   color: 'rgb(214, 255, 255)',  order: 10,  itemId: 262147665},
        {name: 'Coal',       tier: 1, hc: 10, quanta: 90,   color: 'rgb(214, 255, 255)',  order: 7,   itemId: 299255727},
        {name: 'Hematite',   tier: 1, hc: 10, quanta: 90,   color: 'rgb(0, 186, 255)',    order: 8,   itemId: 4234772167},
        {name: 'Quartz',     tier: 1, hc: 10, quanta: 90,   color: 'rgb(104, 238, 255)',  order: 9,   itemId: 3724036288},

        {name: 'Chromite',   tier: 2, hc: 20, quanta: 390,   color: 'rgb(0, 164, 244)',   order: 6,   itemId: 2029139010},
        {name: 'Limestone',  tier: 2, hc: 20, quanta: 390,   color: 'rgb(101, 232, 249)', order: 100, itemId: 3086347393},
        {name: 'Malachite',  tier: 2, hc: 20, quanta: 390,   color: 'rgb(10, 173, 255)',  order: 3,   itemId: 2289641763},
        {name: 'Natron',     tier: 2, hc: 20, quanta: 390,   color: 'rgb(191, 249, 250)', order: 102, itemId: 343766315},

        {name: 'Acanthite',  tier: 3, hc: 50, quanta: 900,   color: 'rgb(0, 220, 116)',   order: 4,   itemId: 1050500112},
        {name: 'Garnierite', tier: 3, hc: 50, quanta: 900,   color: 'rgb(104, 238, 255)', order: 104, itemId: 1065079614},
        {name: 'Petalite',   tier: 3, hc: 50, quanta: 900,   color: 'rgb(150, 246, 255)', order: 11,  itemId: 3837858336},
        {name: 'Pyrite',     tier: 3, hc: 50, quanta: 900,   color: 'rgb(0, 186, 255)',   order: 5,   itemId: 4041459743},

        {name: 'Cobaltite',  tier: 4, hc: 200, quanta: 2500, color: 'rgb(0, 201, 255)',   order: 1,   itemId: 3546085401},
        {name: 'Cryolite',   tier: 4, hc: 200, quanta: 2500, color: 'rgb(64, 224, 255)',  order: 107, itemId: 1467310917},
        {name: 'Gold nuggets', pictureName: 'Gold', tier: 4, hc: 200, quanta: 2500, color: 'rgb(255, 91, 0)', order: 108, itemId: 1866812055},
        {name: 'Kolbeckite', tier: 4, hc: 200, quanta: 2500, color: 'rgb(150, 246, 255)', order: 2,   itemId: 271971371},

        {name: 'Columbite',  tier: 5, hc: 250, quanta: 3000, color: 'rgb(0, 200, 255)',   order: 109, itemId: 789110817},
        {name: 'Ilmenite',   tier: 5, hc: 250, quanta: 3000, color: 'rgb(0, 164, 244)',   order: 110, itemId: 629636034},
        {name: 'Rhodonite',  tier: 5, hc: 250, quanta: 3000, color: 'rgb(11, 172, 252)',  order: 111, itemId: 3934774987},
        {name: 'Thoramine',  tier: 5, order: 112, itemId: 0},
        {name: 'Vanadinite', tier: 5, hc: 250, quanta: 3000, color: 'rgb(0, 220, 116)',   order: 113, itemId: 2162350405}
      ]}
    ]
  })
export class MapModule { }
