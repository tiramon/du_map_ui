import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { TreeViewEntryModel } from '../../model/tree-view-entry.model';

@Component({
  selector: 'dumap-tree-view-level',
  templateUrl: './tree-view-level.component.html',
  styleUrls: ['./tree-view-level.component.scss']
})
export class TreeViewLevelComponent implements OnInit {
  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  @Input()
  public entries: TreeViewEntryModel[] = [];

  @Output()
  public selected: EventEmitter<TreeViewEntryModel> = new EventEmitter();

  @Input()
  // tslint:disable-next-line:ban-types
  public loadChildren: Function = () => null

  constructor() { }

  ngOnInit(): void {
  }

  entrySelected(entry: TreeViewEntryModel) {
    if (!entry.selectable) {
    //  this.toggle(entry);
    } else {
      this.selected.emit(entry);
    }
  }

  toggle(entry: TreeViewEntryModel) {
    if (!entry.selectable) {
      //console.log('toggle', entry);
      entry.open = !entry.open;
      entry.children.forEach(child => {
        //console.log('load children for ', child);
        if (child.children.length === 0) {
          child.children = this.loadChildren(child.id);
          child.children.filter(ch => !ch.id).forEach(ch => console.error('missing id', ch.name));
        }
        //console.log(child.children);
      });
    }
  }
}
