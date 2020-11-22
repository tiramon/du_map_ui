import { BrowserModule } from '@angular/platform-browser';
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

@NgModule({
  declarations: [
    AppComponent,
    MapComponentComponent,
    DetailWindowComponent,
    AddScanDialogComponent,
    LoginComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [
    {provide: 'BASEURL', useValue: 'http://www.dumap.de:8150/'},
    {provide: 'PLANETS', useValue: [
      {id: 31, name: 'Alioth'}, {id: 17, name: 'Alioth Moon 1'}, {id: 18, name: 'Alioth Moon 4'},
      {id: 27, name: 'Feli'}, {id: 8, name: 'Feli Moon 1'},
      {id: 20, name: 'Ion'}, {id: 6, name: 'Ion Moon 1'}, {id: 14, name: 'Ion Moon 2'},
      {id: 29, name: 'Jago'},
      {id: 26, name: 'Lacobus'}, {id: 16, name: 'Lacobus Moon 1'}, {id: 9, name: 'Lacobus Moon 2'}, {id: 13, name: 'Lacobus Moon 3'},
      {id: 19, name: 'Madis'}, {id: 1, name: 'Madis Moon 1'}, {id: 2, name: 'Madis Moon 2'}, {id: 11, name: 'Madis Moon 3'},
      {id: 30, name: 'Sanctuary'},
      {id: 23, name: 'Sicari'},
      {id: 24, name: 'Sinnen'}, {id: 15, name: 'Sinnen Moon 1'},
      {id: 22, name: 'Symeon'},
      {id: 25, name: 'Talemai'}, {id: 12, name: 'Talemai Moon 1'}, {id: 3, name: 'Talemai Moon 2'}, {id: 4, name: 'Talemai Moon 3'},
      {id: 28, name: 'Teoma'},
      {id: 21, name: 'Thades'}, {id: 7, name: 'Thades Moon 1'}, {id: 10, name: 'Thades Moon 2'}
    ]},
    {provide: 'ORES', useValue: [
      {name: 'Bauxite', tier: 1}, {name: 'Coal', tier: 1}, {name: 'Hematite', tier: 1}, {name: 'Quartz', tier: 1},
      {name: 'Chromite', tier: 2}, {name: 'Limestone', tier: 2}, {name: 'Malachite', tier: 2}, {name: 'Natron', tier: 2},
      {name: 'Acanthite', tier: 3}, {name: 'Garnierite', tier: 3}, {name: 'Petalite', tier: 3}, {name: 'Pyrite', tier: 3},
      {name: 'Cobaltite', tier: 4}, {name: 'Cryolite', tier: 4}, {name: 'Gold nuggets', pictureName: 'Gold', tier: 4}, {name: 'Kolbeckite', tier: 4},
      {name: 'Columbite', tier: 5}, {name: 'Illmenite', tier: 5}, {name: 'Rhodonite', tier: 5}, {name: 'Thoramine', tier: 5}, {name: 'Vanadinite', tier: 5}
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
