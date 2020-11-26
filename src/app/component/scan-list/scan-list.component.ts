import { Component, Inject, OnInit } from '@angular/core';
import { faMap } from '@fortawesome/free-regular-svg-icons';
import { faSortNumericDownAlt, faSortNumericUpAlt } from '@fortawesome/free-solid-svg-icons';
import { Scan } from 'src/app/model/Scan';

@Component({
  selector: 'dumap-scan-list',
  templateUrl: './scan-list.component.html',
  styleUrls: ['./scan-list.component.scss']
})
export class ScanListComponent implements OnInit {
  faMap = faMap;
  faSortNumericUpAlt = faSortNumericUpAlt;
  faSortNumericDownAlt = faSortNumericDownAlt;

  sort = {name: 'TileId', up: true}
  scans: Scan[];
  constructor(
    @Inject('ORES') public oreNames,
    @Inject('PLANETS') public planetNames
  ) { }

  getPlanetIdByName(name): number {
    return this.planetNames.find(p => p.name === name).id;
  }

  ngOnInit() {
    this.scans = [];
    this.scans.push({time : new Date(), planet : 'Thades', tileId : 22021, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Thades', tileId : 730, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Alioth', tileId : 25678, ores: {'Bauxite': 123}});
    this.scans.push({time : new Date(), planet : 'Alioth', tileId : 26053, ores: {'Bauxite': 123}});
  }

  showSort(name, up) {
    return this.sort && this.sort.name === name && this.sort.up === up;
  }

}
