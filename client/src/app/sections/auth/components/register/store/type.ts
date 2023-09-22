import { ComponentStateFeature } from "src/app/shared/utils/types";

export interface RegisterState extends ComponentStateFeature {
  passwordVisibility: boolean;
  confirmPasswordVisibility: boolean;
}
