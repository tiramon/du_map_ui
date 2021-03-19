import { Component, Inject, Input, OnInit } from '@angular/core';
import {  faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Share } from 'src/app/model/Share';

@Component({
  selector: 'dumap-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {
  faPen = faPen;
  faTrashAlt = faTrashAlt;
  @Input()
  currentPlanetId: number;

  shares: Share[];
  constructor(
    @Inject('PLANETS') public planets
  ) {
    this.shares = [];
    this.shares.push(new Share('Alioth', null));
  }

  ngOnInit() {
    //this.clearShare();
  }

  changePlanet(event) {
  }

  /*
  clearShare() {
    if (this.currentPlanetId) {
      this.share.planet = this.planets.find(p => p.id === this.currentPlanetId).name;
    } else {
      this.share.planet = null;
    }
  }
  */

  maxTiles(share: Share): number {
    return this.maxTilesForPlanet(this.planets.find(p => p.name === share.planet));
  }

  maxTilesForPlanet(planet): number {
    if (!planet) {
      return 0;
    }
    return planet.gp * planet.gp * 3 * 10 + 2;
  }
}
