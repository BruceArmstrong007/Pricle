import { ComponentStateFeature } from "src/app/shared/utils/types";

export interface LoginState extends ComponentStateFeature {
  passwordVisibility: boolean;
}
