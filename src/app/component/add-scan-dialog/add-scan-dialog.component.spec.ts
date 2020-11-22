import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScanDialogComponent } from './add-scan-dialog.component';

describe('AddScanDialogComponent', () => {
  let component: AddScanDialogComponent;
  let fixture: ComponentFixture<AddScanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
