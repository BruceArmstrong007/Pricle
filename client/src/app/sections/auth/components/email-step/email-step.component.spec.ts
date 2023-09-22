import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailStepComponent } from './email-step.component';

describe('EmailStepComponent', () => {
  let component: EmailStepComponent;
  let fixture: ComponentFixture<EmailStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmailStepComponent]
    });
    fixture = TestBed.createComponent(EmailStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
