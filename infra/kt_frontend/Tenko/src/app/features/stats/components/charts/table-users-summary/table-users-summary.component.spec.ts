import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUsersSummaryComponent } from './table-users-summary.component';

describe('TableUsersSummaryComponent', () => {
  let component: TableUsersSummaryComponent;
  let fixture: ComponentFixture<TableUsersSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableUsersSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableUsersSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
