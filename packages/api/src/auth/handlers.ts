import type {
  AuthAdapter,
  SignInWithOAuthInput,
  SignInWithPasswordInput,
  VerifySessionInput,
} from './types';

export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthValidationError';
  }
}

export async function handleSignInWithOAuth(adapter: AuthAdapter, input: SignInWithOAuthInput) {
  if (!input.provider) {
    throw new AuthValidationError('Provider is required');
  }

  const validProviders = ['google', 'github', 'gitlab', 'azure', 'bitbucket'];
  if (!validProviders.includes(input.provider)) {
    throw new AuthValidationError(`Invalid provider. Must be one of: ${validProviders.join(', ')}`);
  }

  return await adapter.signInWithOAuth(input);
}

export async function handleSignInWithPassword(
  adapter: AuthAdapter,
  input: SignInWithPasswordInput
) {
  if (!input.email || !input.password) {
    throw new AuthValidationError('Email and password are required');
  }

  if (!input.email.includes('@')) {
    throw new AuthValidationError('Invalid email format');
  }

  if (input.password.length < 6) {
    throw new AuthValidationError('Password must be at least 6 characters');
  }

  return await adapter.signInWithPassword(input);
}

export async function handleSignOut(adapter: AuthAdapter, accessToken: string) {
  if (!accessToken) {
    throw new AuthValidationError('Access token is required');
  }

  return await adapter.signOut(accessToken);
}

export async function handleVerifySession(adapter: AuthAdapter, input: VerifySessionInput) {
  if (!input.accessToken) {
    throw new AuthValidationError('Access token is required');
  }

  return await adapter.verifySession(input);
}

export async function handleRefreshSession(adapter: AuthAdapter, refreshToken: string) {
  if (!refreshToken) {
    throw new AuthValidationError('Refresh token is required');
  }

  return await adapter.refreshSession(refreshToken);
}

export async function handleGetCurrentUser(adapter: AuthAdapter, accessToken: string) {
  if (!accessToken) {
    throw new AuthValidationError('Access token is required');
  }

  return await adapter.getCurrentUser(accessToken);
}
