# Authentication Module

Provider-agnostic authentication system for StructCMS with Supabase OAuth adapter.

## Architecture

The authentication module follows the same adapter pattern as storage and media:

- **`types.ts`** - Core interfaces and types
- **`supabase-adapter.ts`** - Supabase implementation of `AuthAdapter`
- **`handlers.ts`** - Validation and business logic
- **`middleware.ts`** - Authentication middleware for protecting routes
- **`index.ts`** - Public API exports

## Usage

### 1. Create Auth Adapter

```typescript
import { createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_SECRET_KEY,
});
```

### 2. Next.js API Routes

```typescript
// app/api/auth/oauth/route.ts
import { createNextAuthOAuthRoute } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthOAuthRoute({ authAdapter }, Response);
```

```typescript
// app/api/auth/signin/route.ts
import { createNextAuthSignInRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthSignInRoute({ authAdapter }, Response);
```

```typescript
// app/api/auth/verify/route.ts
import { createNextAuthVerifyRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthVerifyRoute({ authAdapter }, Response);
```

### 3. Protect Admin Routes

```typescript
// app/api/admin/pages/route.ts
import { createAuthenticatedRoute, createNextPagesRoute } from '@structcms/api';

const { authAdapter, storageAdapter } = createSupabaseAdapters();

const handler = createNextPagesRoute({ storageAdapter }, Response);

export const GET = createAuthenticatedRoute(
  authAdapter,
  Response,
  async (request, user) => {
    return handler.GET(request);
  }
);
```

### 4. Admin UI Integration

```typescript
import { AuthProvider, LoginForm, ProtectedRoute } from '@structcms/admin';

function App() {
  return (
    <AuthProvider apiBaseUrl="/api">
      <ProtectedRoute fallback={<LoginForm />}>
        <AdminDashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
}
```

## Supported OAuth Providers

- Google
- GitHub
- GitLab
- Azure
- Bitbucket

## Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-secret-key
```

## API Reference

### AuthAdapter Interface

```typescript
interface AuthAdapter {
  signInWithOAuth(input: SignInWithOAuthInput): Promise<OAuthResponse>;
  signInWithPassword(input: SignInWithPasswordInput): Promise<AuthSession>;
  signOut(accessToken: string): Promise<void>;
  verifySession(input: VerifySessionInput): Promise<AuthUser | null>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  getCurrentUser(accessToken: string): Promise<AuthUser | null>;
}
```

### Types

```typescript
interface AuthUser {
  id: string;
  email: string;
  metadata?: Record<string, unknown>;
}

interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  user: AuthUser;
}
```

## Creating Custom Adapters

To implement a custom auth provider:

```typescript
import { AuthAdapter, AuthUser, AuthSession } from '@structcms/api';

export class CustomAuthAdapter implements AuthAdapter {
  async signInWithOAuth(input) {
    // Implementation
  }
  
  async signInWithPassword(input) {
    // Implementation
  }
  
  async verifySession(input) {
    // Implementation
  }
  
  // ... other methods
}
```

## Security Best Practices

1. **Never expose secret keys** - Use environment variables
2. **Use HTTPS** in production
3. **Implement CSRF protection** for state-changing operations
4. **Set secure cookie flags** when storing tokens
5. **Validate tokens** on every protected route
6. **Implement rate limiting** on auth endpoints
