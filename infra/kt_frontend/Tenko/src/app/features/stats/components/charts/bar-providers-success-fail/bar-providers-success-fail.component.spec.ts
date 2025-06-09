import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarProvidersSuccessFailComponent } from './bar-providers-success-fail.component';

describe('BarProvidersSuccessFailComponent', () => {
  let component: BarProvidersSuccessFailComponent;
  let fixture: ComponentFixture<BarProvidersSuccessFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarProvidersSuccessFailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarProvidersSuccessFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
