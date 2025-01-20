import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressLeadersComponent } from './congress-leaders.component';

describe('CongressOrganizationComponent', () => {
  let component: CongressLeadersComponent;
  let fixture: ComponentFixture<CongressLeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongressLeadersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CongressLeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
