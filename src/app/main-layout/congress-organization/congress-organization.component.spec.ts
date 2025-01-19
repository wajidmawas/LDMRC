import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongressOrganizationComponent } from './congress-organization.component';

describe('CongressOrganizationComponent', () => {
  let component: CongressOrganizationComponent;
  let fixture: ComponentFixture<CongressOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongressOrganizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CongressOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
