import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Scan } from 'src/app/model/Scan';
import { MapService } from 'src/app/service/map.service';
import { RequestService } from 'src/app/service/request.service';


@Component({
  selector: 'dumap-add-scan-dialog',
  templateUrl: './add-scan-dialog.component.html',
  styleUrls: ['./add-scan-dialog.component.scss']
})
export class AddScanDialogComponent implements OnInit, OnChanges {

  @Input() modal;

  @Input()
  currentPlanetId: number;

  @Output()
  endModal  = new EventEmitter();

  message = '';

  scan: Scan;
  ores: string[];

  oresPerPlanet = {
    Alioth: [0, 1, 2, 3, 5, 6, 8],
    'Alioth Moon 1': [0, 1, 2, 3, 16],
    'Alioth Moon 4': [0, 1, 2, 3, 18],
    Feli: [0, 1, 2, 3, 6, 10, 14],
    'Feli Moon 1': [0, 1, 2, 3, 6, 11, 16],
    Ion: [0, 1, 2, 3, 5, 8, 13, 18],
    'Ion Moon 1': [0, 1, 2, 3, 7],
    'Ion Moon 2': [0, 1, 2, 3, 6, 11],
    Jago: [0, 1, 2, 3, 4, 5, 10, 15, 16],
    Lacobus: [0, 1, 2, 3, 7, 11, 14, 17],
    'Lacobus Moon 1': [0, 1, 2, 3],
    'Lacobus Moon 2': [0, 1, 2, 3, 5],
    'Lacobus Moon 3': [0, 1, 2, 3],
    Madis: [0, 1, 2, 3, 7, 9],
    'Madis Moon 1': [0, 1, 2, 3, 10, 15],
    'Madis Moon 2': [0, 1, 2, 3, 9, 14, 20],
    'Madis Moon 3': [0, 1, 2, 3, 13, 17],
    Sanctuary: [0, 1, 2, 3, 4, 5, 6, 7],
    Sicari: [0, 1, 2, 3, 4, 11, 15],
    Sinnen: [0, 1, 2, 3, 6, 8, 13],
    'Sinnen Moon 1': [0, 1, 2, 3, 4, 8, 12, 18],
    Symeon: [0, 1, 2, 3, 4, 9, 12],
    Talemai: [0, 1, 2, 3, 5, 7, 10],
    'Talemai Moon 1': [0, 1, 2, 3, 7, 13, 17],
    'Talemai Moon 2': [0, 1, 2, 3, 9, 15],
    'Talemai Moon 3': [0, 1, 2, 3, 5, 14, 20],
    Teoma: [0, 1, 2, 3, 6, 7, 9, 12 ],
    Thades: [0, 1, 2, 3, 4, 11],
    'Thades Moon 1': [0, 1, 2, 3, 4, 8],
    'Thades Moon 2': [0, 1, 2, 3, 10, 12]
  };

  enteredOres = {};
  currentOres = [];


  constructor(
    private requestService: RequestService,
    private mapService: MapService,
    @Inject('ORES') public oreNames,
    @Inject('PLANETS') public planets
  ) {
    this.ores = oreNames.map(o => o.name);
    this.message = '';
    this.scan = new Scan();
   }

  ngOnChanges(changes: SimpleChanges): void {
    this.message = '';
    this.newScan();
  }

  ngOnInit() {
    this.newScan();
  }

  newScan() {
    this.scan = new Scan();
    if (this.currentPlanetId) {
      this.scan.planet = this.planets.find(p => p.id === this.currentPlanetId).name;
      this.refreshCurrentOres();
    }
  }

  getOres(planet: string) {
    return this.oresPerPlanet[planet];
  }

  refreshCurrentOres() {
    this.currentOres.length = 0;
    for (const o of this.getOres(this.scan.planet)) {
      this.currentOres.push(this.ores[o]);
    }
  }

  changePlanet(event) {
    Object.keys(this.enteredOres).forEach(k => delete this.enteredOres[k]);
    this.refreshCurrentOres();
  }
  public inputValidator(event: any) {
    const value = event.target.value;
    const pattern = /^[0-9]{1,6}$/;
    if (!pattern.test(value)) {
      // invalid character, prevent input
      event.target.value = value.replace(/[^0-9]/g, '');
      if (event.target.value.length > 6) {
        event.target.value = event.target.value.substr(0,6);
      }
    }
  }
  saveScan(close: boolean) {
    console.log(this.scan);
    this.requestService.saveScan(this.scan).then( response => {
      if (response) {
        console.log('scan saved');
        this.message = 'Your scan was successfully saved.';
        this.mapService.scanAdded.emit(this.scan);
      }
      if (close && response) {
        this.endModal.emit();
      } else {
        this.newScan();
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

}
