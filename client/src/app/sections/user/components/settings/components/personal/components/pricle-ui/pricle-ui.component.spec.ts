import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricleUiComponent } from './pricle-ui.component';

describe('PricleUiComponent', () => {
  let component: PricleUiComponent;
  let fixture: ComponentFixture<PricleUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PricleUiComponent]
    });
    fixture = TestBed.createComponent(PricleUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
