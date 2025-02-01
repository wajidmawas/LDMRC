import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IOTComponent } from './IOT-dashboard.component';

describe('SlidersComponent', () => {
  let component: IOTComponent;
  let fixture: ComponentFixture<IOTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IOTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
