export type VerificationData = {
  email: string;
  token: string;
} | null;

export enum SectionType {
  EMAIL = 'email',
  RESET_PASSWORD = 'reset-password',
}

export enum Steps {
  One = 1,
  Two = 2,
}
