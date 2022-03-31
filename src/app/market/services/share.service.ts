import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { inputItem } from '../model/inputItem.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  currentItem$: Subject<inputItem> = new Subject<inputItem>();
  constructor() { }
}
