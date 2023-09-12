import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtorManagementComponent } from './realtor-management.component';

describe('RealtorManagementComponent', () => {
  let component: RealtorManagementComponent;
  let fixture: ComponentFixture<RealtorManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealtorManagementComponent]
    });
    fixture = TestBed.createComponent(RealtorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
