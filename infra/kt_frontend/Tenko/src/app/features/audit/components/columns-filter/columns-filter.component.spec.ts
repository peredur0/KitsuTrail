import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsFilterComponent } from './columns-filter.component';

describe('ColumnsFilterComponent', () => {
  let component: ColumnsFilterComponent;
  let fixture: ComponentFixture<ColumnsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
