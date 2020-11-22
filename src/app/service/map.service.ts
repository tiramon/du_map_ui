import { EventEmitter, Injectable } from '@angular/core';
import { Face } from '../model/Face';
import { Scan } from '../model/Scan';
import { SelectedTile } from '../model/SelectedTile';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  public faceSelected = new EventEmitter<Face>();
  public tileSelected = new EventEmitter<SelectedTile>();
  public celestialSelected = new EventEmitter<number>();
  public loginChange = new EventEmitter<boolean>();
  public scanAdded = new EventEmitter<Scan>();
  public loading = new EventEmitter<boolean>();

  constructor() { }



}
