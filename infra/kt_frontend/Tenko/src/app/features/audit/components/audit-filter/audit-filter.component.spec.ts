import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFilterComponent } from './audit-filter.component';

describe('AuditFilterComponent', () => {
  let component: AuditFilterComponent;
  let fixture: ComponentFixture<AuditFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
