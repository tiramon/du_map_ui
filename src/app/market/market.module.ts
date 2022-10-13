import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ApiModule, Configuration } from '@tiramon/du-market-api';
import { CommonModule } from '@angular/common';
import { MarketRoutingModule } from './market-routing.module';
import { TreeViewLevelComponent } from './components/tree-view-level/tree-view-level.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { MarketComponent } from './components/market/market.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ShareService } from './services/share.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { AvgOrePriceComponent } from './components/avg-ore-price/avg-ore-price.component';
import { FuzzyPipe } from './pipe/fuzzy.pipe';
import { RecipeComponent } from './components/recipe/recipe.component';


@NgModule({
    declarations: [
      MarketComponent,
      TreeViewComponent,
      TreeViewLevelComponent,
      OrderDetailComponent,
      AvgOrePriceComponent,
      FuzzyPipe,
      RecipeComponent
    ],
    imports: [
      CommonModule,
      HttpClientModule,
      FontAwesomeModule,
      HighchartsChartModule,
      MarketRoutingModule
    ],
    providers: [
      ShareService
    ]
  })
export class MarketModule { }
