import { MenuItem } from 'primeng/api';
import { VerificationData } from '../../../types/types';
import { ComponentStateFeature } from 'src/app/shared/utils/types';
export interface VerifyAccountState extends ComponentStateFeature {
  step: number;
  items: MenuItem[],
  params: VerificationData
}
