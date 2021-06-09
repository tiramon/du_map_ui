import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MinedOre } from 'src/app/model/MinedOre';
import { Scan } from 'src/app/model/Scan';
import { EventService } from 'src/app/service/event.service';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'dumap-subtract-mined-ore-dialog',
  templateUrl: './subtract-mined-ore-dialog.component.html',
  styleUrls: ['./subtract-mined-ore-dialog.component.scss']
})
export class SubtractMinedOreDialogComponent implements OnInit, OnChanges {

  @Input()
  modal: boolean;

  @Input()
  currentPlanetId: number;

  @Output()
  endModal  = new EventEmitter();

  error  = [];

  minedOre: MinedOre;
  ores: string[];

  enteredOres = {};
  currentOres = [];
  formTouched = false;

  constructor(
    private requestService: RequestService,
    private eventService: EventService,
    private toastr: ToastrService,
    @Inject('ORES') public oreNames,
    @Inject('PLANETS') public planets
  ) {
    this.ores = oreNames.map(o => o.name);
    this.minedOre = new MinedOre();
  }

  ngOnInit() {
    this.clearDialog();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearDialog();
  }

  get maxTiles(): number {
    return this.maxTilesForPlanet(this.planets.find((p: {name: string}) => p.name === this.minedOre.planet));
  }

  private maxTilesForPlanet(planet: {gp}): number {
    return planet.gp * planet.gp * 3 * 10 + 2;
  }
  /**
   * Resets the scan object behind the form and refreshes the list of available ore at that planet
   */
  clearDialog() {
    this.minedOre = new MinedOre();
    this.minedOre.tileId = null;
    this.minedOre.time = new Date();
    this.minedOre.ores = {};
    if (this.currentPlanetId) {
      this.minedOre.planet = this.planets.find(p => p.id === this.currentPlanetId).name;
    } else {
      this.minedOre.planet = null;
    }
    this.refreshCurrentOres();
  }

  /**
   * Returns the indices for the ores present at the given planet
   * @param planet planet to filter ores by
   */
  getOres(planet: string): number[] {
    return this.planets.find(p => p.name === planet).ores;
  }

  /**
   * Resets the currentOres array and fills it with the ores available at currently selected planet
   */
  refreshCurrentOres() {
    this.currentOres.length = 0;
    for (const o of this.getOres(this.minedOre.planet)) {
      this.currentOres.push(this.ores[o]);
    }
  }

  changePlanet(event) {
    Object.keys(this.enteredOres).forEach(k => delete this.enteredOres[k]);
    this.refreshCurrentOres();
  }

  saveMinedOre(close: boolean, form: NgForm) {
    if (form.invalid) {
      this.formTouched = true;
      this.toastr.error('Your mined ore input contained errors.');
      return;
    }
    //fix time
    const now = new Date();
    if (typeof this.minedOre.time === 'string') {
      console.log('fix date');
      this.minedOre.time = new Date(Date.parse(this.minedOre.time));
    }

    this.minedOre.time.setHours(now.getHours());
    this.minedOre.time.setMinutes(now.getMinutes());
    this.minedOre.time.setSeconds(now.getSeconds());
    this.minedOre.time.setMilliseconds(now.getMilliseconds());
    this.error = [];
    this.requestService.saveMinedOre(this.minedOre).then(
      response => {
        if (response) {
          this.toastr.success('Your mined ore was successfully saved.');
          this.eventService.minedOreAdded.emit(this.minedOre);
        }
        if (close && response) {
          this.endModal.emit();
        } else {
          this.clearDialog();
        }
        this.eventService.loading.emit(false);
      },
      error => {
        if (error.status === 400) {
          this.error.push('Invalid Data send, plz write 123000 instead of 123kL');
        }
      }
    );
  }
}
