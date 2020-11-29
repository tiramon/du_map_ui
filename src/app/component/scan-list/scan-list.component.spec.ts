import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanListComponent } from './scan-list.component';

describe('ScanListComponent', () => {
  let component: ScanListComponent;
  let fixture: ComponentFixture<ScanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
