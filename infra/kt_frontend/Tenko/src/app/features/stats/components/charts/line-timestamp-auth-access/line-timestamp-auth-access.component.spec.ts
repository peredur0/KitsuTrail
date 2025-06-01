import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineTimestampAuthAccessComponent } from './line-timestamp-auth-access.component';

describe('LineTimestampAuthAccessComponent', () => {
  let component: LineTimestampAuthAccessComponent;
  let fixture: ComponentFixture<LineTimestampAuthAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineTimestampAuthAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineTimestampAuthAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
