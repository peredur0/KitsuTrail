import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeFilterComponent } from './time-range-filter.component';

describe('TimeRangeFilterComponent', () => {
  let component: TimeRangeFilterComponent;
  let fixture: ComponentFixture<TimeRangeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRangeFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
