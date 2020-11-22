import { Component, Inject, OnInit } from '@angular/core';
import { Face } from 'src/app/model/Face';
import { Scan } from 'src/app/model/Scan';
import { MapService } from 'src/app/service/map.service';
import { RequestService } from 'src/app/service/request.service';


@Component({
  selector: 'dumap-detail-window',
  templateUrl: './detail-window.component.html',
  styleUrls: ['./detail-window.component.scss']
})
export class DetailWindowComponent implements OnInit {

  face: Face = null;
  scan: Scan = null;
  constructor(
    private requestService: RequestService,
    private mapService: MapService,
    @Inject('ORES') public oreNames
  ) { }

  ngOnInit() {
    this.mapService.faceSelected.subscribe( f => {
      this.face = f;
      // if (this.face.scan) {
      this.scan = this.face.scan;
      // } else {
      //  this.requestService.requestScan(f.tileId).then(result => this.scan = result);
      // }
    });
  }

  onPosClick() {
    const posString = `::pos{0,${this.face.duEntityId},${(Math.round(this.face.latitude * 10000) / 10000).toFixed(4)},${(Math.round(this.face.longitude * 10000) / 10000).toFixed(4)},0.0}`;
    this.copyToClipboard(posString);

    console.log(this.face, this.scan);
  }

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
