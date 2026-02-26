export interface AuthUser {
  id: string;
  email: string;
  metadata?: Record<string, unknown>;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  user: AuthUser;
}

export interface SignInWithOAuthInput {
  provider: 'google' | 'github' | 'gitlab' | 'azure' | 'bitbucket';
  redirectTo?: string;
}

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

export interface OAuthResponse {
  url: string;
  provider: string;
}

export interface VerifySessionInput {
  accessToken: string;
  expiresAt?: Date | string;
}

export interface AuthAdapter {
  signInWithOAuth(input: SignInWithOAuthInput): Promise<OAuthResponse>;

  signInWithPassword(input: SignInWithPasswordInput): Promise<AuthSession>;

  signOut(accessToken: string): Promise<void>;

  verifySession(input: VerifySessionInput): Promise<AuthUser | null>;

  refreshSession(refreshToken: string): Promise<AuthSession>;

  getCurrentUser(accessToken: string): Promise<AuthUser | null>;
}
