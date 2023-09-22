export interface UserState {
  details: UserDetails;
  isLoading: boolean;
}

export interface UserFailure {
  message: string;
  statusCode: number;
}

export type UserDetails = User | null;

export interface User {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profile: {
    url: string;
    filename: string;
  };
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProfile {
  prevFilename: string;
  profile: File;
}

export interface ResetPassword {
  password: string;
  confirmPassword: string;
}

export interface ChangeEmailLink {
  email: string;
}

export interface ChangeEmail {
  email: string;
  token: string;
}
