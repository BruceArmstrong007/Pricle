import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  dialog = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  data: WritableSignal<{ content: string } | null> = signal(null);

  constructor() {
    this.data.set(this.dialog.data);
    this.dialog.width = '300px';
  }
}
