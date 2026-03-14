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

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 3 of: uppercase, lowercase, numbers, special characters
 * - Not a common password
 */
function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new AuthValidationError('Password must be at least 8 characters');
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~]/.test(password);

  const complexityCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
    Boolean
  ).length;

  if (complexityCount < 3) {
    throw new AuthValidationError(
      'Password must contain at least 3 of: uppercase letters, lowercase letters, numbers, special characters'
    );
  }

  // Check against common passwords
  const commonPasswords = [
    'password',
    'password1',
    'password123',
    '12345678',
    '123456789',
    'qwerty',
    'abc123',
    'monkey',
    '1234567890',
    'letmein',
    'trustno1',
    'dragon',
    'baseball',
    'iloveyou',
    'master',
    'sunshine',
    'ashley',
    'bailey',
    'shadow',
    '123123',
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    throw new AuthValidationError('Password is too common. Please choose a stronger password.');
  }
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

  // Strengthen password policy (Fix #5)
  validatePassword(input.password);

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

  // Enforce token expiration (Fix #7)
  if (input.expiresAt) {
    const now = new Date();
    const expiresAt = input.expiresAt instanceof Date ? input.expiresAt : new Date(input.expiresAt);

    if (now > expiresAt) {
      throw new AuthValidationError('Token has expired');
    }
  }

  const user = await adapter.verifySession(input);

  if (!user) {
    throw new AuthValidationError('Invalid or expired token');
  }

  return user;
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
