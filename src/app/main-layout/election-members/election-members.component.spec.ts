import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionMembersComponent } from './election-members.component';

describe('ElectionMembersComponent', () => {
  let component: ElectionMembersComponent;
  let fixture: ComponentFixture<ElectionMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionMembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElectionMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
