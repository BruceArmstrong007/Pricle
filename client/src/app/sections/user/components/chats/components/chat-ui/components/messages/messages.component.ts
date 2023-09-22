import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageState } from 'src/app/stores/channels/channels.model';
import { ContactDetails } from 'src/app/stores/contacts/contacts.model';
import { UserDetails } from 'src/app/stores/user/user.model';
import { MessageCardComponent } from './components/message-card/message-card.component';
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, MessageCardComponent, NgTemplateOutlet],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  @Input() messages: MessageState[] | undefined;
  @Input() user: UserDetails | undefined;
  @Input() contact: ContactDetails | undefined;


  trackBy(index: number, message: MessageState): string {
    return message?.messageID;
  }
}
