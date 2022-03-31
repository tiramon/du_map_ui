import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { MarketRoutingModule } from './market-routing.module';

@NgModule({
    declarations: [
      MarketComponent,
      TreeViewComponent,
      TreeViewLevelComponent,
      OrderDetailComponent
    ],
    imports: [
      CommonModule,
      HttpClientModule,
      AppRoutingModule, 
      FontAwesomeModule,
      ApiModule.forRoot(() => new Configuration({basePath: environment.basePath, accessToken:'CzGJUnXEfeKtu9liTDIC4DLgAx467R'})),
      MarketRoutingModule
    ],
    providers: [
      
    ]
  })
export class MarketModule { }
