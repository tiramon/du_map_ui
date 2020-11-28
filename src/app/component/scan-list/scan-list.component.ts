import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesResponse } from 'src/app/model/DataTablesResponse';
import { Scan } from 'src/app/model/Scan';
import { Settings } from 'src/app/model/Settings';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-scan-list',
  templateUrl: './scan-list.component.html',
  styleUrls: ['./scan-list.component.scss']
})


export class ScanListComponent implements OnInit, OnDestroy {
  faMap = faMap;

  dtOptions: DataTables.Settings = {};

  settings: Settings;
  scans: Scan[];

  searchOnlyNewest = true;
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;

  constructor(
    private http: HttpClient,
    settingsService: SettingsService,
    @Inject('BASEURL') protected defaultURL: string,
    @Inject('ORES') public oreNames,
    @Inject('PLANETS') public planetNames
  ) {
    this.settings = settingsService.getSettings();
    // redraws the map when settings are changed
    settingsService.settingsChanged.subscribe(
      (settings: Settings) => {
        this.settings = settings;
      }
    );
  }

  getPlanetIdByName(name): number {
    return this.planetNames.find(p => p.name === name).id;
  }

  ngOnInit() {
    const that = this;
    const options = {
      pagingType: 'full_numbers',
      pageLength: 20,
      serverSide: true,
      dom: '<"columnData"l>tip',
      //processing: true,
      stateSave: false,
      scrollX: true,
      order: [],
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.columns[0].search = {value: '' + this.searchOnlyNewest, regex: false};
        console.log(dataTablesParameters)
        that.http
          .post<DataTablesResponse>(
            `${this.defaultURL}scans`,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.scans = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columnDefs: [
        {
          orderable: false, searchable: false, targets: 0, width: '10px'
        }
      ],
      columns: [
        {name: 'action',  orderable: false, searchable: false, width: '10px'},
        { name: 'planet' },
        { name: 'tileId' },
        { name: 'time' },
        {name: 'distance'}]
    };
    for (const ore of this.oreNames) {
      options.columns.push({name: `${ore.name}`});
    }
    console.log(options);
    this.dtOptions = options;

    /*
    this.scans = [];
    this.scans.push({time : new Date(), planet : 'Thades', tileId : 22021, ores: {'Bauxite': 123.5, Coal: 123, Hematite:123, Quartz: 123, Chromite: 123, Limestone: 123, Malachite: 123, Natron: 123, Acanthite: 123, Garnierite: 123, Petalite: 123, Pyrite: 123}});
    this.scans.push({time : new Date(), planet : 'Thades', tileId : 730, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Alioth', tileId : 25678, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Alioth', tileId : 26053, ores: {'Bauxite': 123}});
    */
  }

  ngOnDestroy(): void {
    // We remove the last function in the global ext search array so we do not add the fn each time the component is drawn
    // /!\ This is not the ideal solution as other components may add other search function in this array, so be careful when
    // handling this global variable
  }

  changeNewestFilter(event) {
    this.searchOnlyNewest = event.target.checked;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

}
