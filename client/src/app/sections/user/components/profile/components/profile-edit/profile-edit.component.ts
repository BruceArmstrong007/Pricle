import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { EditProfileStore } from './store/edit-profile.store';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { userActions } from 'src/app/stores/user/user.action';
import { userFeature } from 'src/app/stores/user/user.reducer';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';
import { DividerModule } from 'primeng/divider';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    DialogModule,
    AvatarComponent,
    DividerModule,
    ImageCropperModule,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent {
  private readonly store = inject(Store);
  readonly user = this.store.selectSignal(userFeature.selectDetails);
  private readonly profileEditState = inject(EditProfileStore);
  readonly state = this.profileEditState.instance;
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toastService = inject(MessageService);
  @ViewChild('image') image!: ElementRef;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageBlob: any;
  readonly form: FormGroup;
  visible = signal(false);
  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.compose([Validators.maxLength(25)])],
      name: ['', Validators.compose([Validators.maxLength(50)])],
      bio: ['', Validators.compose([Validators.maxLength(500)])],
    });

    effect(() => {
      this.form.patchValue({
        ...this.user(),
      });
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
      event.objectUrl as string
    );
    this.croppedImageBlob = event?.blob;
  }

  loadImageFailed() {
    this.toastService.add({
      severity: 'warn',
      summary: 'Image Error',
      detail: 'Select a different image.',
    });
  }

  crop() {
    const file = new File([this.croppedImageBlob], 'file_name', {
      lastModified: new Date().getTime(),
      type: this.croppedImageBlob.type
    });
    this.fileUpload(file);
    this.resetCropper();
  }

  resetCropper(){
    this.croppedImage = '';
    this.imageChangedEvent.target.value = '';
    this.imageChangedEvent = null;
    this.croppedImageBlob = '';
    this.visible.set(false)
  }

  get f() {
    return this.form.controls;
  }

  fileUpload(file: File) {
    if (!file) {
      return;
    }
    const prevFilename = this.user()?.profile?.filename ?? '';
    const form = {
      profile: file,
      prevFilename,
    };
    this.store.dispatch(userActions.uploadProfile(form));
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    this.store.dispatch(userActions.updateUser(this.form.value));
  }
}
