import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { Size } from '../../utils/variables';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [AvatarModule, NgIf],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() size: Size = 'normal';
  @Input({ required: true }) label: string | undefined;
  @Input() image: string | undefined;
  @Output() clickEvent = new EventEmitter();
}
