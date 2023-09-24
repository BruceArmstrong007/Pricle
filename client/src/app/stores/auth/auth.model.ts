export interface AuthState {
  isLoading: boolean;
  accessToken: string | null;
}

export interface AuthSuccess {
  message: string;
}

export interface AuthFailure {
  message: string;
  statusCode: number;
}

export interface Register {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken {
  accessToken: string;
}

export interface VerifyEmailLink {
  email: string;
}

export interface VerifyEmail {
  email: string;
  token: string;
}

export interface ResetPasswordLink {
  email: string;
}

export interface ResetPassword {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}
