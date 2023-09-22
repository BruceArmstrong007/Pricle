import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { Size } from 'src/app/shared/utils/variables';
import { MessageState } from 'src/app/stores/channels/channels.model';


export interface Message {
  content: string;
  author: string;
}

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [AvatarComponent, NgClass, NgIf],
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
  @Input({ required: true }) contactID: string | undefined;
  @Input({ required: true }) name: string | undefined;
  @Input({ required: true }) username: string | undefined;
  @Input({ required: true }) label: string | undefined;
  @Input({ required: true }) size: Size;
  @Input() isOnline: boolean | undefined;
  @Input() typing: Message | undefined;
  @Input() image: string | undefined;

  @Output() cardClick = new EventEmitter();
}
