import { ComponentStateFeature } from 'src/app/shared/utils/types';

export interface ChangeEmailState extends ComponentStateFeature {
  isLinkLoading: boolean;
  isLinkSent: boolean;
}
