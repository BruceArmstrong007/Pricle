import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AvatarComponent } from '../avatar/avatar.component';
import { Size } from '../../utils/variables';
import { NgFor, NgIf } from '@angular/common';
import { ContactCardItems } from '../../utils/types';


@Component({
  selector: 'app-contact-card',
  standalone: true,
  imports: [
    NgFor,
    OverlayPanelModule,
    ButtonModule,
    CardModule,
    AvatarComponent,
    NgIf
  ],
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent {
  @Input({ required: true }) contactID: string | undefined;
  @Input() size: Size = 'normal';
  @Input({ required: true }) name: string | undefined;
  @Input({ required: true }) username: string | undefined;
  @Input() image: string | undefined;
  @Input() items: ContactCardItems[] | undefined;
  @Output() clickItem = new EventEmitter();
  @ViewChild('op') op: ElementRef | undefined;

  trackBy(index: number): number {
    return index;
  }

}
