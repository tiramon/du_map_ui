import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWrapperComponent } from './map-wrapper.component';

describe('MapWrapperComponent', () => {
  let component: MapWrapperComponent;
  let fixture: ComponentFixture<MapWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
