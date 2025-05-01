import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogListComponent } from './audit-log-list.component';

describe('AuditLogListComponent', () => {
  let component: AuditLogListComponent;
  let fixture: ComponentFixture<AuditLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
