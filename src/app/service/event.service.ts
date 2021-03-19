import { EventEmitter, Injectable } from '@angular/core';
import { Face } from '../model/Face';
import { Scan } from '../model/Scan';
import { SelectedTile } from '../model/SelectedTile';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  /**
   * emits when a tile on the map has been left clicked
   */
  public faceSelected = new EventEmitter<Face>();
  /**
   * emits when a planet and tile has been choosen
   */
  public tileSelected = new EventEmitter<SelectedTile>();
  /**
   * emits when user changes status to loged in/out
   */
  public loginChange = new EventEmitter<boolean>();
  /**
   * emits a scan after it has been added
   */
  public scanAdded = new EventEmitter<Scan>();
  /**
   * emits if a longer loading process started/ended
   */
  public loading = new EventEmitter<boolean>();

  private lastSelectedTile: SelectedTile;

  constructor() {
    this.tileSelected.subscribe((selectedTile: SelectedTile) => this.lastSelectedTile = selectedTile);
  }

  public getLastSelectedTile() {
    return this.lastSelectedTile;
  }
}
