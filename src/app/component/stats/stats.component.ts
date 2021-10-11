import { Component, Inject, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);

@Component({
  selector: 'dumap-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  public Highcharts: typeof Highcharts = Highcharts; // required
  public chartConstructor: string = 'chart'; // optional string, defaults to 'chart'

  public chartCallback: Highcharts.ChartCallbackFunction = null; //function (chart) { ... } // optional function, defaults to null
  public updateFlag: boolean = false; // optional boolean
  public oneToOneFlag: boolean = true; // optional boolean, defaults to false
  public runOutsideAngular: boolean = false; // optional boolean, defaults to false

  public data = {};
  public stats = {
    Alioth: {
      scan: 2787,
      bauxite_avg: 574803.2305,
      bauxite_min: 390,
      bauxite_max: 5757757,
      bauxite_percent: 99.6552,
      coal_avg: 573635.5739,
      coal_min: 434,
      coal_max: 5484800,
      coal_percent: 99.4397,
      hematite_avg: 560305.2636,
      hematite_min: 401,
      hematite_max: 6425680,
      hematite_percent: 99.5690,
      quartz_avg: 576044.4390,
      quartz_min: 483,
      quartz_max: 7969990,
      quartz_percent: 99.5690,
      limestone_avg: 44973.3611,
      limestone_min: 0,
      limestone_max: 5286000,
      limestone_percent: 74.6121,
      malachite_avg: 42713.6923,
      malachite_min: 0,
      malachite_max: 4781000,
      malachite_percent: 76.3362
    },
    Feli: {
      scan: 307,
      bauxite_avg: 266346.4248,
      coal_avg: 260603.9638,
      hematite_avg: 172993.4739,
      quartz_avg: 270351.9804,
      malachite_avg: 95262.5132,
      petalite_avg: 24327.5783,
      gold_nuggets_avg: 27551.8000
    },
    Ion: {
      scan: 219,
      bauxite_avg: 436784.3014,
      coal_avg: 441468.9256,
      hematite_avg: 419612.9302,
      quartz_avg: 423109.9907,
      limestone_avg: 141531.7116,
      acanthite_avg: 15835.8269,
      cryolite_avg: 5792.0000,
      rhodonite_avg: 7098.9200
    },
    Jago: {
      scan: 783,
      bauxite_avg: 65309.6282,
      coal_avg: 63471.6671,
      hematite_avg: 66608.5492,
      quartz_avg: 68595.0000,
      chromite_avg: 75613.5440,
      limestone_avg: 51518.0887,
      petalite_avg: 11398.1910,
      kolbeckite_avg: 8280.0278,
      columbite_avg: 6003.2000
    },
    Lacobus: {
      scan: 589,
      bauxite_avg: 178305.8404,
      coal_avg: 166343.8234,
      hematite_avg: 162134.5806,
      quartz_avg: 166537.7538,
      natron_avg: 99404.8861,
      pyrite_avg: 17992.0947,
      petalite_avg: 11398.1910,
      gold_nuggets_avg: 5816.7556,
      illmenite_avg: 2880.0000
    },
    Madis: {
      scan: 458,
      bauxite_avg: 591146.1316,
      coal_avg: 617865.9159,
      hematite_avg: 627140.3040,
      quartz_avg: 614362.0508,
      natron_avg: 152866.9513,
      garnierite_avg: 25958.4391
    },
    Sicari: {
      scan: 1601,
      bauxite_avg: 227870.8982,
      coal_avg: 227159.0069,
      hematite_avg: 227503.7799,
      quartz_avg: 229294.5084,
      chromite_avg: 69133.9480,
      pyrite_avg: 12473.4818,
      kolbeckite_avg: 8164.8169
    },
    Sinnen: {
      scan: 767,
      bauxite_avg: 484925.8840,
      coal_avg: 473629.7210,
      hematite_avg: 472601.1904,
      quartz_avg: 480759.6858,
      malachite_avg: 78770.3246,
      acanthite_avg: 10953.7207,
      cryolite_avg: 6601.4167
    },
    Symeon: {
      scan: 415,
      bauxite_avg: 246912.0386,
      coal_avg: 258386.2843,
      hematite_avg: 240574.3566,
      quartz_avg: 275410.8096,
      chromite_avg: 115965.0413,
      garnierite_avg: 15037.7598,
      cobaltite_avg: 6587.5833,
      vanadinite_avg: 2735.3333
    },
    Talemai: {
      scan: 393,
      bauxite_avg: 246912.0386,
      coal_avg: 258386.2843,
      hematite_avg: 240574.3566,
      quartz_avg: 275410.8096,
      limestone_avg: 109057.5195,
      natron_avg: 54177.9488,
      petalite_avg: 8997.9821
    },
    Teoma: {
      scan: 1418,
      bauxite_avg: 142876.9767,
      coal_avg: 148356.8883,
      hematite_avg: 145355.4767,
      quartz_avg: 146792.3173,
      malachite_avg: 62841.5596,
      natron_avg: 66490.0453,
      garnierite_avg: 15564.0614,
      cobaltite_avg: 7966.2439
    },
    Thades: {
      scan: 585,
      bauxite_avg: 398030.6325,
      coal_avg: 376719.4342,
      hematite_avg: 383646.6935,
      quartz_avg: 385895.7248,
      chromite_avg: 71059.0210,
      pyrite_avg: 10718.2534
    }
  };

  public currentOption : Highcharts.Options = {
    title: {
      text: ''
    },
    chart: {
      type: 'bar'
    },
    yAxis: {
      min: 0,
      title: {
        text: 'ore in L',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    xAxis: {
      type: 'category',
      min: 0,
    },
    tooltip: {
        valueSuffix: ' L'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true,
                format: '{y:,.0f}'
            }
        }
    },
    legend: {
      enabled: false
    },
    series: [{
      data: [],
      type: null,
      dataSorting: {
        enabled: true,
        sortKey: 'y'
      },
      zoneAxis: 'x',
      zones: [{
          value: 1,
          color: '#ff4d40'
      }],
    }]
  };
  public options = {};
  public optionKey;
  public currentGraph = '';

  public createData(ore: {technical}[], name, tooltipSuffix) {
    const currentdata = [];
    for (const planet of this.planets) {
      let sum = 0;
      for (const o of ore) {
        if (this.stats[planet.name]) {
          const oreKey = o.technical + '_avg';
          const value = this.stats[planet.name][oreKey] || 0;
          sum += value;
        }
      }
      if (sum > 0) {
        currentdata.push([planet.name + ' (' + this.stats[planet.name].scan + ' scans)',  sum]);
      }
    }

    return [name, currentdata, tooltipSuffix];
  }

  constructor(
    @Inject('ORES') public oreNames,
    @Inject('PLANETS') public planets
    ) {

    for (const ore of oreNames) {
      this.data[ore.name] = this.createData([ ore ], ore.name + ' avg per Planet', ' L');
    }

    this.data['T1 sum'] = this.createData([oreNames[0], oreNames[1], oreNames[2], oreNames[3] ], 'T1 avg sum per Planet', ' L');
    this.data['T2 sum'] = this.createData([oreNames[4], oreNames[5], oreNames[6], oreNames[7] ], 'T2 avg sum per Planet', ' L');
    this.data['T3 sum'] = this.createData([oreNames[8], oreNames[9], oreNames[10], oreNames[11] ], 'T3 avg sum per Planet', ' L');
    this.data['T4 sum'] = this.createData([oreNames[12], oreNames[13], oreNames[14], oreNames[15] ], 'T4 avg sum per Planet', ' L');
    this.data['T5 sum'] = this.createData([oreNames[16], oreNames[17], oreNames[18], oreNames[19] ], 'T5 avg sum per Planet', ' L');
    this.optionKey = Object.keys(this.data);
  }

  ngOnInit() {
    this.onChartChange('Bauxite');
  }

  public onChartChange(newValue) {
    const currentData = this.data[newValue];
    this.currentOption.title = {text: currentData[0] };
    // clone data because graph modifies the data and then it gets complicated
    const newData = [];
    for (const c of currentData[1]) {
      newData.push(c);
    }

    const series = this.currentOption.series[0] as Highcharts.SeriesBarOptions;
    series.data = newData;
    series.name = newValue;
    this.currentOption.tooltip.valueSuffix = currentData[2];
    this.updateFlag = true;
  }
}
