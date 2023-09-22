import { Component, Input } from '@angular/core';
import { UserDetails } from 'src/app/stores/user/user.model';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-profile-preview',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss']
})
export class ProfilePreviewComponent {
  @Input({required: true}) user!: UserDetails;
  @Input({required: true}) isLoading!: boolean;
}
