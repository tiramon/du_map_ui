import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { DataTablesResponse } from 'src/app/model/DataTablesResponse';
import { Scan } from 'src/app/model/Scan';
import { SelectedTile } from 'src/app/model/SelectedTile';
import { Settings } from 'src/app/model/Settings';
import { EventService } from 'src/app/service/event.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-scan-list',
  templateUrl: './scan-list.component.html',
  styleUrls: ['./scan-list.component.scss']
})


export class ScanListComponent implements OnInit, OnDestroy {
  allowedLocales = ['en-US', 'de'];
  faMap = faMap;

  dtOptions: DataTables.Settings = {};

  settings: Settings;
  scans: Scan[];

  searchOnlyNewest = true;
  selectedPlanet = null;
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;
  selectedTile: SelectedTile;

  constructor(
    private http: HttpClient,
    settingsService: SettingsService,
    eventService: EventService,
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

    this.selectedTile = eventService.getLastSelectedTile() || new SelectedTile(0, 31);
    eventService.tileSelected.subscribe((selectedTile: SelectedTile) => {
      this.selectedTile = selectedTile;
      console.log(selectedTile);
    });
  }

  getPlanetIdByName(name): number {
    return this.planetNames.find(p => p.name === name).id;
  }

  ngOnInit() {
    const that = this;
    const options = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      dom: '<"columnData"l>tip',
      //processing: true,
      stateSave: true,
      scrollX: true,
      order: [],
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.columns[0].search = {value: '' + this.searchOnlyNewest, regex: false};
        if (this.selectedPlanet) {
          dataTablesParameters.columns[1].search = {value: '' + this.selectedPlanet, regex: false};
        }
        if (this.selectedTile) {
          dataTablesParameters.search.value = `${this.selectedTile.celestialId}:${this.selectedTile.tileId}`;
        }
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
          orderable: false, searchable: false, targets: 0
        }
      ],
      columns: [
        {name: 'action',  orderable: false, searchable: false},
        { name: 'planet' },
        { name: 'tileId' },
        { name: 'time' },
        {name: 'distance'}]
    };
    for (const ore of this.oreNames) {
      options.columns.push({name: `${ore.name}`});
    }
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

  changePlanetFilter(event) {
    this.selectedPlanet = +event.target.options[event.target.selectedIndex].value;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  getUsersLocale(defaultValue: string): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return defaultValue;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : defaultValue;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    if (this.allowedLocales.indexOf(lang) < 0) {
      lang = 'en-US';
    }
    return lang;
  }
}
