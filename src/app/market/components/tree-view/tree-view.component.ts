import { ChangeDetectionStrategy } from '@angular/compiler';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TreeViewEntryModel } from '../../model/tree-view-entry.model';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnChanges {
 
  @Input()
  public entries: TreeViewEntryModel[] = [];

  @Input()
  public loadChildren: Function;

  @Output()
  public selected: EventEmitter<TreeViewEntryModel> = new EventEmitter();

  constructor() { }

  openPath(path: string[]) {
    let currentChildren = this.entries;
    path.forEach(step => {
      const entry = currentChildren.filter(entry => entry.id == step)[0];
      entry.children.forEach(child => {
        if (child.children.length == 0) {
          child.children = this.loadChildren(child.id)
        }
      });
      currentChildren = entry.children;
      entry.open = true;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openPath && changes['openPath']) {
      const path = [];
      let currentId = '' + this.openPath;
      while (currentId != undefined) {
        const entry = this.entries.filter(entry => entry.id == currentId)[0];
        entry.children = this.loadChildren(entry.id);
        entry.open = true;
        currentId = entry.parentId;
      }
    }
  }

  

  entrySelected(entry: TreeViewEntryModel) {
    this.selected.emit(entry);
  }
}
