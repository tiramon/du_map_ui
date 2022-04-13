import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgOrePriceComponent } from './avg-ore-price.component';

describe('AvgOrePriceComponent', () => {
  let component: AvgOrePriceComponent;
  let fixture: ComponentFixture<AvgOrePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvgOrePriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgOrePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
