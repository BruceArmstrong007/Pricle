import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCardComponent } from './chat-card.component';

describe('ChatCardComponent', () => {
  let component: ChatCardComponent;
  let fixture: ComponentFixture<ChatCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChatCardComponent]
    });
    fixture = TestBed.createComponent(ChatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
