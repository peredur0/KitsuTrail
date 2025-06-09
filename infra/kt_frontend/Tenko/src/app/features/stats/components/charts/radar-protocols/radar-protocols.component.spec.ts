import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadarProtocolsComponent } from './radar-protocols.component';

describe('RadarProtocolsComponent', () => {
  let component: RadarProtocolsComponent;
  let fixture: ComponentFixture<RadarProtocolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarProtocolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadarProtocolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
