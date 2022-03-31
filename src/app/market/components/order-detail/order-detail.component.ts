import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderStats } from '@tiramon/du-market-api';
import { inputItem } from 'src/app/model/inputItem.model';

import * as Highcharts from 'highcharts';
import { ShareService } from 'src/app/services/share.service';
import HighchartsMore  from "highcharts/highcharts-more";
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);
HighchartsMore(Highcharts);

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  public Highcharts: typeof Highcharts = Highcharts; // required
  public chartConstructor: string = 'chart'; // optional string, defaults to 'chart'

  public chartCallback: Highcharts.ChartCallbackFunction | null= null; //function (chart) { ... } // optional function, defaults to null
  public updateFlag: boolean = false; // optional boolean
  public oneToOneFlag: boolean = true; // optional boolean, defaults to false
  public runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  public currentOption : Highcharts.Options = {
    time: { useUTC: false },
    title: { text: '' },
    chart: { type: 'line' },
    yAxis: {
      labels: { format: '{value:,.0f} ħ' },
      title: { text:'Quanta' }
    },
    xAxis: { type: 'datetime' },
    tooltip: { pointFormat: '{point.y:,.2f} ħ' },
    legend: { enabled: true },
    series: [
      { name: 'avg sell value', type: 'line', data: [] },
      { name: 'min sell value', type: 'line', data: [] },
      { name: 'avg buy value', type: 'line', data: [] },      
      { name: 'max buy value', type: 'line', data: [] },
      
      //{ name: 'buy value errorbar', type: 'errorbar', data: [] },
      //{ name: 'sell value errorbar', type: 'errorbar', data: [] }
    ]
  };

  orderStats: OrderStats[] = [];
  item: inputItem = {Name: '', Description: '', Tier: 0, Mass: 0, Icon: '', GroupId: '', Volume: 0, NqId: 0, NqRecipeId: 0};

  constructor(private route: ActivatedRoute, private shareService: ShareService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.orderStats = data['stats'];
      this.item = data['item'];
      this.shareService.currentItem$.next(this.item);

      
      

      const buySeries = this.currentOption.series[2] as Highcharts.SeriesBarOptions;
      const sellAvgSeries = this.currentOption.series[0] as Highcharts.SeriesBarOptions;
      const buyMaxSeries = this.currentOption.series[3] as Highcharts.SeriesBarOptions;
      const sellMinSeries = this.currentOption.series[1] as Highcharts.SeriesBarOptions;
      //const buyErrorBarseries = this.currentOption.series[3] as Highcharts.SeriesErrorbarOptions;
      //const sellErrorBarseries = this.currentOption.series[4] as Highcharts.SeriesErrorbarOptions;
      const keys = this.orderStats.map(stat => stat.timestamp);
      
      const currentBuyData: any[] = [];
      const currentSellAvgData: any[] = [];      
      const currentBuyMaxData: any[] = []
      const currentSellMinData: any[] = []
      const errorBarData: any[] = [];
      const errorBarSellData: any[] = [];
    
      data['stats'].forEach( stat => {
        
        const buyAvg = stat.buyValue / stat.buyStock;
        const sellAvg = stat.sellValue / stat.sellStock;
        
        currentBuyData.push([+stat.timestamp, buyAvg]);
        currentSellAvgData.push([+stat.timestamp, sellAvg]);
        currentBuyMaxData.push([+stat.timestamp, stat.buyMaxPrice])
        currentSellMinData.push([+stat.timestamp, stat.sellMinPrice]);
        //errorBarData.push([+key, Math.min(...pricesBuy), Math.max(...pricesBuy)]);
        //errorBarSellData.push([+key, Math.min(...pricesSell), Math.max(...pricesSell)]);
      });
      console.log('new data',JSON.stringify(errorBarData));
      buySeries.data = currentBuyData;
      sellAvgSeries.data = currentSellAvgData;
      buyMaxSeries.data = currentBuyMaxData;
      sellMinSeries.data = currentSellMinData;
      //buyErrorBarseries.data = errorBarData; 
      //sellErrorBarseries.data = errorBarSellData;
      this.currentOption.title.text = "Market values " + this.item.Name;
      this.updateFlag = true;
    });

    //series2.data = errorBarData;
  }

  groupBy(list: any, keyGetter: any) {
    return list.reduce((groups: any, item: any) => {
      const val = keyGetter(item);
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }
}
