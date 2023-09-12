import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitiqueManagementComponent } from './pitique-management.component';

describe('PitiqueManagementComponent', () => {
  let component: PitiqueManagementComponent;
  let fixture: ComponentFixture<PitiqueManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PitiqueManagementComponent]
    });
    fixture = TestBed.createComponent(PitiqueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
