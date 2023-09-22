import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatListComponent } from './components/chat-list/chat-list.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [RouterOutlet, ChatListComponent],
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {

}
