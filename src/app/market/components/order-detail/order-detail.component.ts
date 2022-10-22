import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvgOrePrice, Order, OrderStats } from '@tiramon/du-market-api';
import { inputItem } from '../../model/inputItem.model';

import * as Highcharts from 'highcharts';
import { ShareService } from '../../services/share.service';
import HighchartsMore from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import { CalcService } from '../../services/calc.service';

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
  item: inputItem = {Name: '', Description: '', Tier: 0, Mass: 0, Icon: '', GroupId: '', Volume: 0, NqId: 0};
  avg: Array<AvgOrePrice>;

  withoutSkills;
  withSkills;
  skills;
  constructor(
    private route: ActivatedRoute,
    private shareService: ShareService,
    private calcService: CalcService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.orderStats = data['stats'];
      this.orderStats.push({
        timestamp: new Date().getTime()
      });
      this.item = data['item'];
      this.avg = data['avgPrice'];

      const buySeries = this.currentOption.series[2] as Highcharts.SeriesBarOptions;
      const sellAvgSeries = this.currentOption.series[0] as Highcharts.SeriesBarOptions;
      const buyMaxSeries = this.currentOption.series[3] as Highcharts.SeriesBarOptions;
      const sellMinSeries = this.currentOption.series[1] as Highcharts.SeriesBarOptions;
      const keys = this.orderStats.map(stat => stat.timestamp);

      const currentBuyData: any[] = [];
      const currentSellAvgData: any[] = [];
      const currentBuyMaxData: any[] = [];
      const currentSellMinData: any[] = [];

      const minTimestamp = (Date.now() - 1000 * 60 * 60 * 24 * 14);
      console.log(minTimestamp);
      this.orderStats.forEach( stat => {
        const buyAvg = stat.buyValue / stat.buyStock;
        const sellAvg = stat.sellValue / stat.sellStock;
        console.log(+stat.timestamp > minTimestamp,+stat.timestamp,minTimestamp);
        if (+stat.timestamp > minTimestamp) {
        currentBuyData.push([+stat.timestamp, buyAvg]);
        currentSellAvgData.push([+stat.timestamp, sellAvg]);
        currentBuyMaxData.push([+stat.timestamp, stat.buyMaxPrice]);
        currentSellMinData.push([+stat.timestamp, stat.sellMinPrice]);
        }
      });
      buySeries.data = currentBuyData;
      sellAvgSeries.data = currentSellAvgData;
      buyMaxSeries.data = currentBuyMaxData;
      sellMinSeries.data = currentSellMinData;
      this.currentOption.title.text = 'Market values ' + this.item.Name;
      this.updateFlag = true;

      this.calcService.clearValueCache(this.avg);
      this.withoutSkills = this.calcService.calcOrePriceOneItem(this.item, undefined);
      this.calcService.clearValueCache(this.avg);
      this.withSkills = this.calcService.calcOrePriceOneItem(this.item, {});
      console.log('calculated item price', this.withoutSkills);

      this.skills = this.calcService.getAffectingSkill(this.item);
    });
  }

  get recipe() {
    return this.item.recipe;
  }

  produced() {
    return this.calcService.getRecipesUsingItem(this.item.NqId);
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
