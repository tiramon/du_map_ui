import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderStats } from '@tiramon/du-market-api';
import { inputItem } from '../../model/inputItem.model';

import * as Highcharts from 'highcharts';
import { ShareService } from '../../services/share.service';
import HighchartsMore from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);
HighchartsMore(Highcharts);

@Component({
  selector: 'dumap-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  public Highcharts: typeof Highcharts = Highcharts; // required
  public chartConstructor = 'chart'; // optional string, defaults to 'chart'

  public chartCallback: Highcharts.ChartCallbackFunction | null = null; // function (chart) { ... } // optional function, defaults to null
  public updateFlag = false; // optional boolean
  public oneToOneFlag = true; // optional boolean, defaults to false
  public runOutsideAngularFlag = false; // optional boolean, defaults to false

  public currentOption: Highcharts.Options = {
    time: { useUTC: false },
    title: { text: '' },
    chart: { type: 'line' },
    yAxis: {
      labels: { format: '{value:,.0f} ħ' },
      title: { text: 'Quanta' }
    },
    xAxis: { type: 'datetime' },
    tooltip: { pointFormat: '{point.y:,.2f} ħ' },
    legend: { enabled: true },
    series: [
      { name: 'avg sell value', type: 'line', data: [] },
      { name: 'min sell value', type: 'line', data: [] },
      { name: 'avg buy value', type: 'line', data: [] },
      { name: 'max buy value', type: 'line', data: [] },
   ]
  };

  orderStats: OrderStats[] = [];
  item: inputItem = {Name: '', Description: '', Tier: 0, Mass: 0, Icon: '', GroupId: '', Volume: 0, NqId: 0, NqRecipeId: 0};

  constructor(private route: ActivatedRoute, private shareService: ShareService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.orderStats = data['stats'];
      this.orderStats.push({
        timestamp: new Date().getTime()
      });
      this.item = data['item'];

      const buySeries = this.currentOption.series[2] as Highcharts.SeriesBarOptions;
      const sellAvgSeries = this.currentOption.series[0] as Highcharts.SeriesBarOptions;
      const buyMaxSeries = this.currentOption.series[3] as Highcharts.SeriesBarOptions;
      const sellMinSeries = this.currentOption.series[1] as Highcharts.SeriesBarOptions;
      const keys = this.orderStats.map(stat => stat.timestamp);

      const currentBuyData: any[] = [];
      const currentSellAvgData: any[] = [];
      const currentBuyMaxData: any[] = [];
      const currentSellMinData: any[] = [];

      data['stats'].forEach( stat => {

        const buyAvg = stat.buyValue / stat.buyStock;
        const sellAvg = stat.sellValue / stat.sellStock;

        currentBuyData.push([+stat.timestamp, buyAvg]);
        currentSellAvgData.push([+stat.timestamp, sellAvg]);
        currentBuyMaxData.push([+stat.timestamp, stat.buyMaxPrice]);
        currentSellMinData.push([+stat.timestamp, stat.sellMinPrice]);
      });
      buySeries.data = currentBuyData;
      sellAvgSeries.data = currentSellAvgData;
      buyMaxSeries.data = currentBuyMaxData;
      sellMinSeries.data = currentSellMinData;
      this.currentOption.title.text = 'Market values ' + this.item.Name;
      this.updateFlag = true;
    });
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
