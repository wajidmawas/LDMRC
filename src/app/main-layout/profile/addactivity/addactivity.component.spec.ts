import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddactivityComponent } from './addactivity.component';

describe('AddactivityComponent', () => {
  let component: AddactivityComponent;
  let fixture: ComponentFixture<AddactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddactivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
