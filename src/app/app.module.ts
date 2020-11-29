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
    SortByPipe
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
      {id: 31, name: 'Alioth', altitude: 0}, {id: 17, name: 'Alioth Moon 1', altitude: 0}, {id: 18, name: 'Alioth Moon 4', altitude: 0},
      {id: 27, name: 'Feli', altitude: 18400}, {id: 8, name: 'Feli Moon 1', altitude: 0},
      {id: 20, name: 'Ion', altitude: 0}, {id: 6, name: 'Ion Moon 1', altitude: 0}, {id: 14, name: 'Ion Moon 2', altitude: 0},
      {id: 29, name: 'Jago', altitude: 0},
      {id: 26, name: 'Lacobus', altitude: 0}, {id: 16, name: 'Lacobus Moon 1', altitude: 0}, {id: 9, name: 'Lacobus Moon 2', altitude: 0}, {id: 13, name: 'Lacobus Moon 3', altitude: 0},
      {id: 19, name: 'Madis', altitude: 0}, {id: 1, name: 'Madis Moon 1', altitude: 0}, {id: 2, name: 'Madis Moon 2', altitude: 0}, {id: 11, name: 'Madis Moon 3', altitude: 0},
      {id: 30, name: 'Sanctuary', altitude: 0},
      {id: 23, name: 'Sicari', altitude: 0},
      {id: 24, name: 'Sinnen', altitude: 0}, {id: 15, name: 'Sinnen Moon 1', altitude: 0},
      {id: 22, name: 'Symeon', altitude: 0},
      {id: 25, name: 'Talemai', altitude: 0}, {id: 12, name: 'Talemai Moon 1', altitude: 0}, {id: 3, name: 'Talemai Moon 2', altitude: 0}, {id: 4, name: 'Talemai Moon 3', altitude: 0},
      {id: 28, name: 'Teoma', altitude: 0},
      {id: 21, name: 'Thades', altitude: 13700}, {id: 7, name: 'Thades Moon 1', altitude: 0}, {id: 10, name: 'Thades Moon 2', altitude: 0}
    ]},
    {provide: 'ORES', useValue: [
      {name: 'Bauxite', tier: 1, color: 'rgb(214, 255, 255)'}, {name: 'Coal', tier: 1, color: 'rgb(214, 255, 255)'}, {name: 'Hematite', tier: 1, color: 'rgb(0, 186, 255)'}, {name: 'Quartz', tier: 1, color: 'rgb(104, 238, 255)'},
      {name: 'Chromite', tier: 2, color: 'rgb(0, 164, 244)'}, {name: 'Limestone', tier: 2, color: 'rgb(101, 232, 249)'}, {name: 'Malachite', tier: 2, color: 'rgb(10, 173, 255)'}, {name: 'Natron', tier: 2, color: 'rgb(191, 249, 250)'},
      {name: 'Acanthite', tier: 3, color: 'rgb(0, 220, 116)'}, {name: 'Garnierite', tier: 3, color: 'rgb(104, 238, 255)'}, {name: 'Petalite', tier: 3, color: 'rgb(150, 246, 255)'}, {name: 'Pyrite', tier: 3, color: 'rgb(0, 186, 255)'},
      {name: 'Cobaltite', tier: 4, color: 'rgb(0, 201, 255)'}, {name: 'Cryolite', tier: 4, color: 'rgb(64, 224, 255)'}, {name: 'Gold nuggets', pictureName: 'Gold', tier: 4, color: 'rgb(255, 91, 0)'}, {name: 'Kolbeckite', tier: 4, color: 'rgb(150, 246, 255)'},
      {name: 'Columbite', tier: 5, color: 'rgb(0, 200, 255)'}, {name: 'Illmenite', tier: 5, color: 'rgb(0, 164, 244)'}, {name: 'Rhodonite', tier: 5, color: 'rgb(11, 172, 252)'}, {name: 'Thoramine', tier: 5}, {name: 'Vanadinite', tier: 5, color: 'rgb(0, 220, 116)'}
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
