import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Face } from 'src/app/model/Face';
import { Scan } from 'src/app/model/Scan';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'dumap-detail-window',
  templateUrl: './detail-window.component.html',
  styleUrls: ['./detail-window.component.scss']
})
export class DetailWindowComponent implements OnInit {
  allowedLocales = ['en-US', 'de'];

  faCopy = faCopy;

  face: Face = null;
  scan: Scan = null;
  constructor(
    private eventService: EventService,
    @Inject('ORES') public oreNames: {name, tier, color}[]
  ) { }

  ngOnInit() {
    // changes the shown face and scan that was selected by a click on the map
    this.eventService.faceSelected.subscribe( f => {
      this.face = f;
      this.scan = this.face.scan;
    });

    // hides the last shown information if the user logs out
    this.eventService.loginChange.subscribe((logedIn: boolean) => {
      if (!logedIn) {
        this.face = null;
        this.scan = null;
      }
    });
  }

  /**
   * Creates the ::poss{} link for that given tile and copies it to the clipboard
   */
  onPosClick() {
    this.copyToClipboard(this.posLink());
  }

  posLink() {
    return `::pos{0,${this.face.duEntityId},${(Math.round(this.face.latitude * 10000) / 10000).toFixed(4)},${(Math.round(this.face.longitude * 10000) / 10000).toFixed(4)},0.0}`;
  }

  /**
   * Copies the given text to the clipboard
   *
   * @param text text to be copied
   */
  copyToClipboard(text: string) {
    const dummy = document.createElement('textarea');
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    // Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
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

  sumOre(scan: Scan): number  {
    return Object.keys(scan.ores).map(key => scan.ores[key]).reduce((p, c) => p + c );
  }
  onScanClick() {
    let out = `Planet: ${this.scan.planet}\nTile: ${this.scan.tileId}\n${this.posLink()}\n${new DatePipe(this.getUsersLocale('en-US')).transform(this.scan.time, 'MMM dd, y HH:mm')}\n`;
    for (let ore of this.oreNames) {
      if (this.scan.ores[ore.name]) {
        out += `\n${ore.name}:${'            '.slice(ore.name.length)} ${'         '.slice(this.scan.ores[ore.name].toLocaleString().length)}${this.scan.ores[ore.name].toLocaleString()}`;
      }
    }
    this.copyToClipboard('```' + out + '```');
  }
}
