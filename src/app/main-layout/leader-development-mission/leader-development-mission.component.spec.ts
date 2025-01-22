import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderDevelopmentMissionComponent } from './leader-development-mission.component';

describe('LeaderDevelopmentMissionComponent', () => {
  let component: LeaderDevelopmentMissionComponent;
  let fixture: ComponentFixture<LeaderDevelopmentMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderDevelopmentMissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaderDevelopmentMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
