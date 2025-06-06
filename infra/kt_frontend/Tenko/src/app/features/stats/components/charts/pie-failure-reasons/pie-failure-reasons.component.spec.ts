import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieFailureReasonsComponent } from './pie-failure-reasons.component';

describe('PieFailureReasonsComponent', () => {
  let component: PieFailureReasonsComponent;
  let fixture: ComponentFixture<PieFailureReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieFailureReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieFailureReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
