import { Component, inject } from '@angular/core';
import { ProfilePreviewComponent } from 'src/app/shared/components/profile-preview/profile-preview.component';
import { Store } from '@ngrx/store';
import { userFeature } from 'src/app/stores/user/user.reducer';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfilePreviewComponent, ProfileEditComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private readonly store = inject(Store);
  readonly user = this.store.selectSignal(userFeature.selectDetails);
  readonly isLoading = this.store.selectSignal(userFeature.selectIsLoading);
}
