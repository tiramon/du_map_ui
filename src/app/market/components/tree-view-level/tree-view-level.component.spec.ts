import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewLevelComponent } from './tree-view-level.component';

describe('TreeViewLevelComponent', () => {
  let component: TreeViewLevelComponent;
  let fixture: ComponentFixture<TreeViewLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeViewLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
