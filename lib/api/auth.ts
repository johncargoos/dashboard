import { API_BASE_URL, getDefaultHeaders, handleResponse } from './config';

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  name?: string;
  licenseNumber?: string; // Optional for carriers
  carrierIdNumber?: string;
  companyName?: string; // For carriers
  group?: string; // 'driver' | 'carrier' | 'admin'
  avatarKey?: string;
}

export interface SignUpResponse {
  message: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  challenge?: string;
  session?: string;
  username?: string;
}

export interface RespondNewPasswordRequest {
  email: string;
  tempPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ConfirmForgotPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  username?: string;
}

/**
 * Sign up a new user (creates Cognito user and driver/carrier record)
 */
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/sign-up`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<SignUpResponse>(response);
}

/**
 * Sign in user
 */
export async function signIn(data: SignInRequest): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/sign-in`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<SignInResponse>(response);
  
  // Store tokens if successful
  if (result.accessToken) {
    localStorage.setItem('accessToken', result.accessToken);
  }
  if (result.idToken) {
    localStorage.setItem('idToken', result.idToken);
  }
  if (result.refreshToken) {
    localStorage.setItem('refreshToken', result.refreshToken);
  }
  
  return result;
}

/**
 * Complete first login with new password
 */
export async function respondNewPassword(data: RespondNewPasswordRequest): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/respond-new-password`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<SignInResponse>(response);
  
  // Store tokens if successful
  if (result.accessToken) {
    localStorage.setItem('accessToken', result.accessToken);
  }
  if (result.idToken) {
    localStorage.setItem('idToken', result.idToken);
  }
  if (result.refreshToken) {
    localStorage.setItem('refreshToken', result.refreshToken);
  }
  
  return result;
}

/**
 * Request password reset
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Confirm password reset with code
 */
export async function confirmForgotPassword(data: ConfirmForgotPasswordRequest): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/confirm-forgot-password`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Refresh access token
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });

  const result = await handleResponse<SignInResponse>(response);
  
  // Update stored tokens
  if (result.accessToken) {
    localStorage.setItem('accessToken', result.accessToken);
  }
  if (result.idToken) {
    localStorage.setItem('idToken', result.idToken);
  }
  
  return result;
}

/**
 * Sign out user (clear tokens)
 */
export function signOut(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userType');
  localStorage.removeItem('companyName');
  document.cookie = 'userType=; path=/; max-age=0';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

/**
 * Get user email from stored token
 */
export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
}

/**
 * Parse JWT and extract user info
 */
export function parseToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
