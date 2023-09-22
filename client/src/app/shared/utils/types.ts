export type ComponentStateFeature = IsLoadingFeature & ErrorFeature;

export interface IsLoadingFeature {
  isLoading: boolean;
}

export interface ErrorFeature {
  error: string | null;
}

export interface CardEvent {
  type: string;
  contactID: string;
}

export interface ContactCardItems {
  label: string;
  key: string;
  icon: string;
  backgroundColor?: string;
}
