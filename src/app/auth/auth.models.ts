export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  role: string;
  emailConsent?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface LoginPayload {
  mobile?: string;
  email?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  mobile: string;
  gender: 'male' | 'female';
  emailConsent: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponseData {
  accessToken?: string;
  tokens?: AuthTokens;
  user: AuthUser;
}

export interface RefreshTokenResponseData {
  accessToken: string;
}

export interface ProfileResponse {
  _id: string;
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  gender?: string;
  role: string;
  emailConsent?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface RegisterResponseData {
  user: AuthUser;
  otp?: string;
}

export interface ForgotPasswordResponseData {
  email: string;
  otp?: string;
}
