import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponentComponent } from './component/map-component/map-component.component';
import { DetailWindowComponent } from './component/detail-window/detail-window.component';
import { AddScanDialogComponent } from './component/add-scan-dialog/add-scan-dialog.component';
import { LoginComponent } from './component/login/login.component';
import { BasicAuthInterceptor } from './BasicAutInterceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingComponent } from './component/loading/loading.component';
import { environment } from 'src/environments/environment';
import { MapSettingsComponent } from './component/map-settings/map-settings.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScanListComponent } from './component/scan-list/scan-list.component';
import { MapWrapperComponent } from './component/map-wrapper/map-wrapper.component';
import { SelectedTileResolver } from './resolver/selected-tile-resolver';
import { HelpComponent } from './component/help/help.component';
import { SortByPipe } from './pipe/SortByPipe';
import { DataTablesModule } from 'angular-datatables';
import { CustomMinDirective } from './directive/customMin.directive';
import { CustomMaxDirective } from './directive/customMax.directive';
import { StatsComponent } from './component/stats/stats.component';
import { SubtractMinedOreDialogComponent } from './component/subtract-mined-ore-dialog/subtract-mined-ore-dialog.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    MapComponentComponent,
    DetailWindowComponent,
    AddScanDialogComponent,
    LoginComponent,
    LoadingComponent,
    MapSettingsComponent,
    ScanListComponent,
    MapWrapperComponent,
    HelpComponent,
    SortByPipe,
    CustomMinDirective,
    CustomMaxDirective,
    StatsComponent,
    SubtractMinedOreDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    OAuthModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    DataTablesModule
  ],
  providers: [
    SelectedTileResolver,
    {provide: 'BASEURL', useValue: environment.apiEndpoint},
    {provide: 'PLANETS', useValue: [
      {id: 31, name: 'Alioth', ores: [0, 1, 2, 3, 5, 6, 8], gp: 93, altitude: 0},
        {id: 17, name: 'Alioth Moon 1', ores: [0, 1, 2, 3, 16], gp: 22, altitude: 0},
        {id: 18, name: 'Alioth Moon 4', ores:  [0, 1, 2, 3, 18], gp: 22, altitude: 0},
      {id: 27, name: 'Feli', ores: [0, 1, 2, 3, 6, 10, 14], gp: 30, altitude: 18400},
        {id: 8, name: 'Feli Moon 1', ores: [0, 1, 2, 3, 6, 11, 16], gp: 10, altitude: 0},
      {id: 20, name: 'Ion', ores: [0, 1, 2, 3, 5, 8, 13, 18], gp: 33, altitude: 0},
        {id: 6, name: 'Ion Moon 1', ores: [0, 1, 2, 3, 7], gp: 8, altitude: 0},
        {id: 14, name: 'Ion Moon 2', ores: [0, 1, 2, 3, 6, 11], gp: 11, altitude: 0},
      {id: 29, name: 'Jago', ores: [0, 1, 2, 3, 4, 5, 10, 15, 16], gp: 45, altitude: 0},
      {id: 26, name: 'Lacobus', ores: [0, 1, 2, 3, 7, 11, 14, 17], gp: 41, altitude: 0},
        {id: 16, name: 'Lacobus Moon 1', ores: [0, 1, 2, 3], gp: 13, altitude: 0},
        {id: 9, name: 'Lacobus Moon 2', ores: [0, 1, 2, 3, 5], gp: 10, altitude: 0},
        {id: 13, name: 'Lacobus Moon 3', ores: [0, 1, 2, 3], gp: 11, altitude: 0},
      {id: 19, name: 'Madis', ores: [0, 1, 2, 3, 7, 9], gp: 32, altitude: 0},
        {id: 1, name: 'Madis Moon 1', ores: [0, 1, 2, 3, 10, 15], gp: 7, altitude: 0},
        {id: 2, name: 'Madis Moon 2', ores: [0, 1, 2, 3, 9, 14, 20], gp: 8, altitude: 0},
        {id: 11, name: 'Madis Moon 3', ores:  [0, 1, 2, 3, 13, 17], gp: 11, altitude: 0},
      {id: 30, name: 'Sanctuary', ores: [0, 1, 2, 3, 4, 5, 6, 7], gp: 61, altitude: 0},
      {id: 23, name: 'Sicari', ores: [0, 1, 2, 3, 4, 11, 15], gp: 37, altitude: 0},
      {id: 24, name: 'Sinnen', ores: [0, 1, 2, 3, 6, 8, 13], gp: 40, altitude: 0},
        {id: 15, name: 'Sinnen Moon 1', ores: [0, 1, 2, 3, 4, 8, 12, 18], gp: 12, altitude: 0},
      {id: 22, name: 'Symeon', ores: [0, 1, 2, 3, 4, 9, 12, 20], gp: 36, altitude: 0},
      {id: 25, name: 'Talemai', ores: [0, 1, 2, 3, 5, 7, 10], gp: 42, altitude: 0},
        {id: 12, name: 'Talemai Moon 1', ores: [0, 1, 2, 3, 7, 13, 17], gp: 11, altitude: 0},
        {id: 3, name: 'Talemai Moon 2', ores: [0, 1, 2, 3, 9, 15], gp: 8, altitude: 0},
        {id: 4, name: 'Talemai Moon 3', ores: [0, 1, 2, 3, 5, 14, 20], gp: 8, altitude: 0},
      {id: 28, name: 'Teoma', ores: [0, 1, 2, 3, 6, 7, 9, 12 ], gp: 45, altitude: 0},
      {id: 21, name: 'Thades', ores: [0, 1, 2, 3, 4, 11], gp: 36, altitude: 13700},
        {id: 7, name: 'Thades Moon 1', ores: [0, 1, 2, 3, 4, 8], gp: 10, altitude: 0},
        {id: 10, name: 'Thades Moon 2', ores: [0, 1, 2, 3, 10, 12], gp: 11, altitude: 0}
    ]},
    {provide: 'ORES', useValue: [
      {name: 'Bauxite',    tier: 1, hc: 10, quanta: 25, color: 'rgb(214, 255, 255)'},
      {name: 'Coal',       tier: 1, hc: 10, quanta: 25, color: 'rgb(214, 255, 255)'},
      {name: 'Hematite',   tier: 1, hc: 10, quanta: 25, color: 'rgb(0, 186, 255)'},
      {name: 'Quartz',     tier: 1, hc: 10, quanta: 25, color: 'rgb(104, 238, 255)'},

      {name: 'Chromite',   tier: 2, hc: 20, quanta: 60, color: 'rgb(0, 164, 244)'},
      {name: 'Limestone',  tier: 2, hc: 20, quanta: 60, color: 'rgb(101, 232, 249)'},
      {name: 'Malachite',  tier: 2, hc: 20, quanta: 60, color: 'rgb(10, 173, 255)'},
      {name: 'Natron',     tier: 2, hc: 20, quanta: 60, color: 'rgb(191, 249, 250)'},

      {name: 'Acanthite',  tier: 3, hc: 50, quanta: 125, color: 'rgb(0, 220, 116)'},
      {name: 'Garnierite', tier: 3, hc: 50, quanta: 125, color: 'rgb(104, 238, 255)'},
      {name: 'Petalite',   tier: 3, hc: 50, quanta: 125, color: 'rgb(150, 246, 255)'},
      {name: 'Pyrite',     tier: 3, hc: 50, quanta: 125, color: 'rgb(0, 186, 255)'},

      {name: 'Cobaltite',  tier: 4, hc: 200, quanta: 590, color: 'rgb(0, 201, 255)'},
      {name: 'Cryolite',   tier: 4, hc: 200, quanta: 590, color: 'rgb(64, 224, 255)'},
      {name: 'Gold nuggets', pictureName: 'Gold', tier: 4, hc: 200, quanta: 590, color: 'rgb(255, 91, 0)'},
      {name: 'Kolbeckite', tier: 4, hc: 200, quanta: 590, color: 'rgb(150, 246, 255)'},

      {name: 'Columbite',  tier: 5, hc: 250, quanta: 1375, color: 'rgb(0, 200, 255)'},
      {name: 'Illmenite',  tier: 5, hc: 250, quanta: 1375, color: 'rgb(0, 164, 244)'},
      {name: 'Rhodonite',  tier: 5, hc: 250, quanta: 1375, color: 'rgb(11, 172, 252)'},
      {name: 'Thoramine',  tier: 5},
      {name: 'Vanadinite', tier: 5, hc: 250, quanta: 1375, color: 'rgb(0, 220, 116)'}
    ]},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
