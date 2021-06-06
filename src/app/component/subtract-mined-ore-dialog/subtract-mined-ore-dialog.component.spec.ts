import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtractMinedOreDialogComponent } from './subtract-mined-ore-dialog.component';

describe('SubtractMinedOreDialogComponent', () => {
  let component: SubtractMinedOreDialogComponent;
  let fixture: ComponentFixture<SubtractMinedOreDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtractMinedOreDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtractMinedOreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
