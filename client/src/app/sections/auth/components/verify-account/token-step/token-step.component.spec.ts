import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenStepComponent } from './token-step.component';

describe('TokenStepComponent', () => {
  let component: TokenStepComponent;
  let fixture: ComponentFixture<TokenStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TokenStepComponent]
    });
    fixture = TestBed.createComponent(TokenStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
