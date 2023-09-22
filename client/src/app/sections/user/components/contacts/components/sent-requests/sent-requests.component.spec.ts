import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentRequestsComponent } from './sent-requests.component';

describe('SentRequestsComponent', () => {
  let component: SentRequestsComponent;
  let fixture: ComponentFixture<SentRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SentRequestsComponent]
    });
    fixture = TestBed.createComponent(SentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
