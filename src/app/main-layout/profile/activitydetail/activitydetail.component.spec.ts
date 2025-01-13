import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitydetailComponent } from './activitydetail.component';

describe('ActivitydetailComponent', () => {
  let component: ActivitydetailComponent;
  let fixture: ComponentFixture<ActivitydetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitydetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
