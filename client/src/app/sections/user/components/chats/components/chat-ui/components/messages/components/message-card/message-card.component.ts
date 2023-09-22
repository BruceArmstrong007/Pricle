import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { MessageStatus } from 'src/app/shared/utils/variables';

@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [AvatarComponent, DatePipe, NgClass, NgIf],
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent {
  @Input() url: string | undefined;
  @Input({required:true}) name: string | undefined;
  @Input({required:true}) content: string | undefined;
  @Input({required:true}) username: string | undefined;
  @Input({required:true}) timestamp: string | undefined;
  @Input() status: string | undefined;
  MessageStatus = MessageStatus;

}
