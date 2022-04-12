import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { inputItem } from '../model/inputItem.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  currentItem$: Subject<inputItem> = new Subject<inputItem>();
  currentItem: inputItem;
  constructor() {
    this.currentItem$.subscribe(item => this.currentItem = item);
  }
}
