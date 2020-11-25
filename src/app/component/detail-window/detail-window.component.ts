import { Component, Inject, OnInit } from '@angular/core';
import { Face } from 'src/app/model/Face';
import { Scan } from 'src/app/model/Scan';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'dumap-detail-window',
  templateUrl: './detail-window.component.html',
  styleUrls: ['./detail-window.component.scss']
})
export class DetailWindowComponent implements OnInit {

  face: Face = null;
  scan: Scan = null;
  constructor(
    private eventService: EventService,
    @Inject('ORES') public oreNames
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
    const posString = `::pos{0,${this.face.duEntityId},${(Math.round(this.face.latitude * 10000) / 10000).toFixed(4)},${(Math.round(this.face.longitude * 10000) / 10000).toFixed(4)},0.0}`;
    this.copyToClipboard(posString);
  }

  /**
   * Copies the given text to the clipboard
   *
   * @param text text to be copied
   */
  copyToClipboard(text) {
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
}
