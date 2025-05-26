import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTableComponent } from './audit-table.component';

describe('AuditTableComponent', () => {
  let component: AuditTableComponent;
  let fixture: ComponentFixture<AuditTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
