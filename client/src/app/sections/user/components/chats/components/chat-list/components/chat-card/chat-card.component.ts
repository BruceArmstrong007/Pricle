import { NgClass, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';

export interface Message {
  type: 'chat' | 'typing';
  content: string;
  author: string;
}

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [AvatarComponent, ButtonModule, NgClass, NgIf],
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss'],
})
export class ChatCardComponent {
  @Input({ required: true }) contactID: string | undefined;
  @Input({ required: true }) name: string | undefined;
  @Input() image: string | undefined;
  @Input() selected: boolean | undefined;
  @Input() isOnline: boolean | undefined;
  @Input() message: Message | undefined;
  @Input() deliveredCount: number | undefined;

  @Output() cardClick = new EventEmitter();
}
