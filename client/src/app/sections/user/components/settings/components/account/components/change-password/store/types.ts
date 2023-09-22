import { ComponentStateFeature } from 'src/app/shared/utils/types';

export interface ChangePasswordState extends ComponentStateFeature {
  passwordVisibility: boolean;
  confirmPasswordVisibility: boolean;
}
