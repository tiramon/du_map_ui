import { Component, Inject, OnInit } from '@angular/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faSortNumericDownAlt, faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons';
import { Scan } from 'src/app/model/Scan';
import { Settings } from 'src/app/model/Settings';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'dumap-scan-list',
  templateUrl: './scan-list.component.html',
  styleUrls: ['./scan-list.component.scss']
})
export class ScanListComponent implements OnInit {
  faMap = faMap;
  faSortNumericUpAlt = faSortNumericUpAlt;
  faSortNumericDownAlt = faSortNumericDownAlt;

  settings: Settings;
  sort = {name: 'TileId', up: true}
  scans: Scan[];
  constructor(
    private settingsService: SettingsService,
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
    this.scans = [];
    this.scans.push({time : new Date(), planet : 'Thades', tileId : 22021, ores: {'Bauxite': 123.5, Coal: 123, Hematite:123, Quartz: 123, Chromite: 123, Limestone: 123, Malachite: 123, Natron: 123, Acanthite: 123, Garnierite: 123, Petalite: 123, Pyrite: 123}});
    this.scans.push({time : new Date(), planet : 'Thades', tileId : 730, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Alioth', tileId : 25678, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Alioth', tileId : 26053, ores: {'Bauxite': 123}});
    /*
    this.scans = this.scans.map( (s: Scan) => {
      const out = {};
      out['planet'] = s.planet;
      out['tileId'] = s.tileId;
      out['time'] = s.time;
      for (let o of this.oreNames) {
        out[o.name] = s.ores[o.name];
      }
      return out;
    });
    */
  }

  showSort(name, up) {
    return this.sort && this.sort.name === name && this.sort.up === up;
  }

}
