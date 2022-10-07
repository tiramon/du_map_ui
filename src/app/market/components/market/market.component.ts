import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TreeViewEntryModel } from '../../model/tree-view-entry.model';

import itemJson from '../../../../assets/market/items.json';
import groupJson from '../../../../assets/market/groups.json';
import { inputGroup } from '../../model/inputGroup.model';
import { inputItem } from '../../model/inputItem.model';
import { OrderService } from '@tiramon/du-market-api';
import { Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { TreeViewComponent } from '../../components/tree-view/tree-view.component';

@Component({
  selector: 'dumap-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, AfterViewInit {
  @ViewChild(TreeViewComponent)
  treeView: TreeViewComponent;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private shareService: ShareService
  ) {
    // this.http.get('assets/items.json').subscribe(data => {
  }

  groupedGroups: any;
  groupedItems: any;
  entries: TreeViewEntryModel[] = [];

  currentItem: inputItem;

  ngOnInit(): void {
    this.groupedGroups = this.groupBy(groupJson as inputGroup[], (group: inputGroup) => group.ParentId == null ? 'null' : group.ParentId);
    this.groupedItems = this.groupBy(itemJson as inputItem[], (item: inputItem) => item.GroupId == null ? 'null' : item.GroupId);
    this.shareService.currentItem$.subscribe(item => {
      console.log('item change');
      if (item) {
        this.currentItem = item;
        const path = this.getPathToItem(item);
        this.treeView.openPath(path);
      }
    });

    // console.log(this.groupedGroups, this.groupedItems);
    const result: TreeViewEntryModel[] = this.groupedGroups['null'].filter(g => !g.Hidden).map((group: inputGroup) => {
      const outGroup = this.group2Entry(group);
      outGroup.children = this.loadChildren(outGroup.id);
      return outGroup;
    });
    this.entries.push(...result.sort( (a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    }));
  }

  ngAfterViewInit() {
    if (this.shareService.currentItem) {
      const initialPath = this.getPathToItem(this.shareService.currentItem);
      this.treeView.openPath(initialPath);
    }
  }

  getPathToItem(item: inputItem) {
    const path = [];
    let groupId = item.GroupId;
    while (groupId !== undefined && groupId !== null) {
      path.push(groupId);
      const group = (groupJson as inputGroup[]).filter(g => g.Id === groupId)[0];
      groupId = group?.ParentId;
    }
    return path.reverse();
  }

  group2Entry(group: inputGroup): TreeViewEntryModel {
    return {id: group.Id, name: group.Name, children: [], icon: group.Icon, selectable: false, parentId: group.ParentId};
  }

  item2Entry(item: inputItem): TreeViewEntryModel {
    return {id: item.NqId == null ? '' : '' + item.NqId, name: item.Name, children: [], icon: item.Icon, selectable: true, parentId: item.GroupId};
  }

  groupBy(list: any, keyGetter: any) {
    return list.reduce((groups: any, item: any) => {
      const val = keyGetter(item);
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }

  loadChildren(id: string): TreeViewEntryModel[] {
    let groups: TreeViewEntryModel[] = this.groupedGroups[id]?.filter(group => group.Hidden === false).map((group: inputGroup) => this.group2Entry(group)) ?? [];
    groups = groups.sort( (a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
    const items: TreeViewEntryModel[] =  this.groupedItems[id]?.map((item: inputItem) => this.item2Entry(item)) ?? [];
    items.sort( (a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
    return [...groups, ...items];
  }

  onEntrySelected(entry: any) {
    if (entry.selectable) {
      if (entry.id) {
        this.router.navigate(['market/itemType', entry.id]);
      } else {
        console.error('missing id for ', entry.name);
      }
      /*this.orderService.getOrders(undefined, undefined, entry.id, undefined).subscribe(data => {
        console.log('server data', data);
      });
      */
    }
  }
}
