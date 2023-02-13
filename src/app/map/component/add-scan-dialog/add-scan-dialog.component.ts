import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { faDiscord, faJava } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Scan } from 'src/app/map/model/Scan';
import { EventService } from 'src/app/map/service/event.service';
import { RequestService } from 'src/app/map/service/request.service';

@Component({
  selector: 'dumap-add-scan-dialog',
  templateUrl: './add-scan-dialog.component.html',
  styleUrls: ['./add-scan-dialog.component.scss'],
})
export class AddScanDialogComponent implements OnInit, OnChanges {
  faDownload = faDownload;
  faJava = faJava;
  faDiscord = faDiscord;

  @Input()
  modal: boolean;

  @Input()
  currentPlanetId: number;

  @Output()
  endModal = new EventEmitter();

  ocrResult: string;

  jsonResult: string;

  tab = 4;
  error = [];

  scan: Scan;
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
    this.ores = oreNames;
    this.scan = new Scan();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearScan();
  }

  ngOnInit() {
    this.clearScan();
  }

  get maxTiles(): number {
    return this.maxTilesForPlanet(
      this.planets.find((p: { name: string }) => p.name === this.scan.planet)
    );
  }

  private maxTilesForPlanet(planet: { gp }): number {
    return planet.gp * planet.gp * 3 * 10 + 2;
  }
  /**
   * Resets the scan object behind the form and refreshes the list of available ore at that planet
   */
  clearScan() {
    this.scan = new Scan();
    this.scan.tileId = null;
    this.scan.time = this.nowUTC();
    this.scan.ores = {};
    if (this.currentPlanetId) {
      this.scan.planet = this.planets.find(
        p => p.id === this.currentPlanetId
      ).name;
    } else {
      this.scan.planet = null;
    }
    this.refreshCurrentOres();
  }

  nowUTC(): Date {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60 * 1000);
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
    for (const o of this.getOres(this.scan.planet)) {
      this.currentOres.push(this.ores[o]);
    }
    this.currentOres = [].concat(this.currentOres);
  }

  changePlanet(event) {
    Object.keys(this.enteredOres).forEach(k => delete this.enteredOres[k]);
    this.refreshCurrentOres();
  }
  /*
  public inputValidator(event: any) {
    const value = event.target.value;
    const pattern = /^[0-9]{1,6}$/;
    if (!pattern.test(value)) {
      // invalid character, prevent input
      event.target.value = value.replace(/[^0-9]/g, '');
      if (event.target.value.length > 6) {
        event.target.value = event.target.value.substr(0, 6);
      }
    }
  }
*/

  saveScan(close: boolean, form: NgForm) {
    if (form.invalid) {
      this.formTouched = true;
      this.toastr.error('Your scan input contained errors.');
      return;
    }
    // fix time
    const now = new Date();
    if (typeof this.scan.time === 'string') {
      console.log('fix date');
      this.scan.time = new Date(Date.parse(this.scan.time));
    }

    this.scan.time.setHours(now.getHours());
    this.scan.time.setMinutes(now.getMinutes());
    this.scan.time.setSeconds(now.getSeconds());
    this.scan.time.setMilliseconds(now.getMilliseconds());
    this.error = [];
    this.requestService.saveScan(this.scan).then(
      response => {
        if (response) {
          this.toastr.success('Your scan was successfully saved.');
          this.eventService.scanAdded.emit(this.scan);
        }
        if (close && response) {
          this.endModal.emit();
        } else {
          this.clearScan();
        }
        this.eventService.loading.emit(false);
      },
      error => {
        if (error.status === 400) {
          this.error.push(
            'Invalid Data send, plz write 123000 instead of 123kL'
          );
        }
      }
    );
  }

  parseAndSaveScan(close: boolean) {
    this.clearScan();
    this.error = [];

    this.scan = this.parseJsonResponse(this.jsonResult, this.scan);
    if (this.scan && this.error.length === 0) {
      this.requestService.saveScan(this.scan).then(
        response => {
          if (response) {
            this.toastr.success('Your scan was successfully saved.');
            this.eventService.scanAdded.emit(this.scan);
          }
          if (close && response) {
            this.endModal.emit();
          } else {
            this.clearScan();
            this.jsonResult = undefined;
          }
          this.eventService.loading.emit(false);
        },
        error => {
          if (error.status === 400) {
            this.error.push(
              'Invalid Data send, plz write 123000 instead of 123kL'
            );
          }
        }
      );
    }
  }
  /**
   * Parse the OCR scan and write the parsed content to the form
   */
  fillForm() {
    this.clearScan();
    this.error = [];

    const result = this.parseResponse(this.ocrResult, this.scan);
    if (result && this.error.length === 0) {
      this.tab = 1;
      this.toastr.success('Your scan was successfully parsed.');
    }
    this.formTouched = true;
  }

  fillJsonForm() {
    this.clearScan();
    this.formTouched = true;
    this.error = [];
    const result = this.parseJsonResponse(this.jsonResult, this.scan);
    if (result && this.error.length === 0) {
      this.tab = 1;
      this.toastr.success('Your scan was successfully parsed.');
    }
    this.formTouched = true;
  }

  /**
   * Removes an array element by value
   * @param array array to be modified
   * @param item element to be removed
   */
  remove(array: string[], item: string) {
    const index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  parseResponse(text: string, scan: Scan): Scan {
    if (!text || text.trim().length === 0) {
      this.toastr.warning('OCR Result is empty');
      return null;
    }
    let splittedInput = text.split(/\r?\n/);
    splittedInput = splittedInput.filter(k => k);
    if (splittedInput[0][0] === '*') {
      this.remove(splittedInput, splittedInput[0]);
    }
    console.log('first split', splittedInput);
    const map = {};
    splittedInput.map(l => l.split(/\t/)).forEach(ls => (map[ls[0]] = ls[1]));
    console.log(map);

    let keys = Object.keys(map);

    console.log('keys', keys);
    const systemkey = this.bestMatch('SYSTEM', keys);
    const territorykey = this.bestMatch('TERRITORY ID', keys);
    const agekeys = this.bestMatch('AGE', keys);

    const bestSystemMatch = this.bestMatch(
      map[systemkey],
      this.planets.map(p => p.name)
    );
    scan.planet = bestSystemMatch;
    this.refreshCurrentOres();

    if (+map[territorykey] != map[territorykey]) {
      this.error.push(
        `could not parse the value of TERRITORY ID-> ${map[territorykey]} is not numeric`
      );
    }
    scan.tileId = +map[territorykey];

    console.log(bestSystemMatch + ' ' + map[territorykey] + ' ' + map[agekeys]);
    keys = this.remove(keys, systemkey);
    keys = this.remove(keys, territorykey);
    /*
    const splittedAge = map[agekeys].split(' ');
    console.log(splittedAge, agekeys, map[agekeys]);
    if (splittedInput.length < 2 || !splittedAge[1]) {
      this.error.push(`could not parse AGE value "${map[agekeys]}" ... maybe it's something like '3d' instead of '3 d'`);
      return;
    }
    const unit = this.bestMatch(splittedAge[1], ['min', 'hrs', 'd']);
    let age = +splittedAge[0];
    scan.time =  new Date(Date.now() - age);
    if (unit === 'hrs') {
      age *= 60;
    } else if (unit === 'd') {
      age *= 24 * 60;
    }

    age *= 60 * 1000;
    */
    scan.time = new Date();
    keys = this.remove(keys, agekeys); // min hrs d
    console.log(keys);
    for (const key of keys) {
      const out = this.bestMatch(
        key,
        this.oreNames.map(o => o.name)
      );
      let amount = map[key];
      let splitted = amount.split(' ');
      if (splitted.length > 2) {
        amount = amount.replace(' ', '');
        splitted = amount.split(' ');
      } else if (splitted.length < 2) {
        this.error.push(
          `could not parse the value of ${key} -> ${amount} it's probably missing a whitespace between value and unit '123L' instead of '123 L'`
        );
      }
      if (splitted[1].length > 2) {
        this.error.push(
          `could not parse the value of ${key} -> ${amount} it's probably missing a whitespace between value and unit '1 123L' instead of '1123 L'`
        );
      }
      const oreUnit = this.bestMatch(splitted[1], ['L', 'kL']);
      if (+splitted[0] != splitted[0]) {
        this.error.push(
          `could not parse the value of ${key} -> ${splitted[0]} is not numeric`
        );
      }
      let value = +splitted[0].trim();

      console.log('oreunit', oreUnit);
      if (oreUnit === 'kL') {
        value *= 1000;
      }
      console.log(out + (out !== key ? '(' + key + ')' : '') + ' ' + value);

      scan.ores[out] = value;
    }
    return scan;
  }

  parseJsonResponse(text: string, scan: Scan): Scan {
    if (!this.jsonResult) {
      this.error.push(
        "empty JSON, don't mistake the placeholder of tile 27212 as a pasted JSON"
      );
      return undefined;
    }
    let parsed: {
      planetId: number;
      tileId: number;
      territoryPool: { itemId: number; maxMiningRate: number }[];
    };
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      this.error.push('Invalid JSON');
      return undefined;
    }

    scan.time = new Date();
    scan.planet = this.planets.filter(
      planet => planet.planetId === +parsed.planetId
    )[0]?.name;
    if (!scan.planet) {
      this.error.push(`invalid planetId '${parsed.planetId}'`);
      return undefined;
    }

    scan.tileId = parsed.tileId;
    if (!scan.tileId) {
      this.error.push('invalid tileId');
    }
    if (scan.tileId != +scan.tileId) {
      this.error.push('invalid tileId');
    }
    if (scan.tileId < 0) {
      this.error.push('invalid tileId, min value is 0');
    }
    if (scan.tileId >= this.maxTiles) {
      this.error.push(`invalid tileId, max value is ${this.maxTiles}`);
    }

    for (const pool of parsed.territoryPool) {
      const oreName = this.oreNames.filter(
        ore => ore.itemId === +pool.itemId
      )[0]?.name;
      if (!oreName) {
        this.error.push(`invalid itemId '${pool.itemId}'`);
      }

      scan.ores[oreName] = pool.maxMiningRate;
      if (scan.ores[oreName] != +scan.ores[oreName]) {
        this.error.push(
          `invalid maxMiningRate '${pool.maxMiningRate}' for itemId ${pool.itemId}`
        );
      }
    }

    return scan;
  }

  private bestMatch(input: string, possibleValues: string[]) {
    let best = Infinity;
    let bestString = '';
    for (const value of possibleValues) {
      const v = this.calculate(value, input);
      if (v < best) {
        best = v;
        bestString = value;
      }
    }
    return bestString;
  }

  private calculate(x: string, y: string) {
    const dp = [];

    for (let i = 0; i <= x.length; i++) {
      if (!dp[i]) {
        dp[i] = [];
      }
      for (let j = 0; j <= y.length; j++) {
        if (i === 0) {
          dp[i][j] = j;
        } else if (j === 0) {
          dp[i][j] = i;
        } else {
          dp[i][j] = this.min(
            dp[i - 1][j - 1] + this.costOfSubstitution(x[i - 1], y[j - 1]),
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1
          );
        }
      }
    }
    return dp[x.length][y.length];
  }

  private costOfSubstitution(a: string, b: string) {
    return a === b ? 0 : 1;
  }

  private min(n1: number, n2: number, n3: number) {
    return Math.min(n1, n2, n3);
  }
}
