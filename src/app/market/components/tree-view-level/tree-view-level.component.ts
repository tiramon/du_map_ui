import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { TreeViewEntryModel } from '../../model/tree-view-entry.model';

@Component({
  selector: 'app-tree-view-level',
  templateUrl: './tree-view-level.component.html',
  styleUrls: ['./tree-view-level.component.scss']
})
export class TreeViewLevelComponent implements OnInit {
  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;
  
  @Input()
  public entries: TreeViewEntryModel[] = [];

  @Input()
  public loadChildren: Function = () => null;

  @Output()
  public selected: EventEmitter<TreeViewEntryModel> = new EventEmitter();
  
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
      console.log('toggle', entry);
      entry.open = !entry.open;
      entry.children.forEach(child => {
        console.log('load children for ', child);
        if (child.children.length == 0) {
          child.children = this.loadChildren(child.id);
        }
        console.log(child.children);
      });
    }
  }
}
