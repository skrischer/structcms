# Authentication Setup Guide

This guide shows how to add authentication to your StructCMS project.

## Prerequisites

- Supabase project with authentication enabled
- OAuth providers configured in Supabase (optional)

## Step 1: Configure Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable desired OAuth providers (Google, GitHub, etc.)
4. Configure redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://yourdomain.com/api/auth/callback`

## Step 2: Environment Variables

Add to your `.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
```

## Step 3: Create API Routes

### OAuth Route

Create `app/api/auth/oauth/route.ts`:

```typescript
import { createNextAuthOAuthRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthOAuthRoute({ authAdapter }, Response);
```

### Sign In Route

Create `app/api/auth/signin/route.ts`:

```typescript
import { createNextAuthSignInRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthSignInRoute({ authAdapter }, Response);
```

**Note:** User registration/sign-up is not included. Users must be created manually in Supabase or through your own admin process.

### Sign Out Route

Create `app/api/auth/signout/route.ts`:

```typescript
import { createNextAuthSignOutRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthSignOutRoute({ authAdapter }, Response);
```

### Verify Route

Create `app/api/auth/verify/route.ts`:

```typescript
import { createNextAuthVerifyRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthVerifyRoute({ authAdapter }, Response);
```

### Refresh Route

Create `app/api/auth/refresh/route.ts`:

```typescript
import { createNextAuthRefreshRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();

export const POST = createNextAuthRefreshRoute({ authAdapter }, Response);
```

## Step 4: Protect Admin Routes

Update your existing admin API routes to require authentication:

```typescript
// app/api/admin/pages/route.ts
import { 
  createAuthenticatedRoute, 
  createNextPagesRoute,
  createSupabaseAdapters 
} from '@structcms/api';

const { authAdapter, storageAdapter } = createSupabaseAdapters();

const pagesHandler = createNextPagesRoute({ storageAdapter }, Response);

export const GET = createAuthenticatedRoute(
  authAdapter,
  Response,
  async (request, user) => {
    return pagesHandler.GET(request);
  }
);

export const POST = createAuthenticatedRoute(
  authAdapter,
  Response,
  async (request, user) => {
    return pagesHandler.POST(request);
  }
);
```

## Step 5: Update Admin UI

Wrap your admin app with the `AuthProvider`:

```typescript
// app/admin/layout.tsx
'use client';

import { AuthProvider } from '@structcms/admin';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider apiBaseUrl="/api">
      {children}
    </AuthProvider>
  );
}
```

Add login page:

```typescript
// app/admin/login/page.tsx
'use client';

import { LoginForm, OAuthButton } from '@structcms/admin';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        
        <LoginForm 
          onSuccess={() => router.push('/admin')}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <OAuthButton 
            provider="google" 
            apiBaseUrl="/api"
            redirectTo="/admin"
          />
          <OAuthButton 
            provider="github" 
            apiBaseUrl="/api"
            redirectTo="/admin"
          />
        </div>
      </div>
    </div>
  );
}
```

Protect admin pages:

```typescript
// app/admin/page.tsx
'use client';

import { ProtectedRoute } from '@structcms/admin';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <ProtectedRoute 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <button onClick={() => router.push('/admin/login')}>
            Go to Login
          </button>
        </div>
      }
    >
      <div>Your Admin Dashboard</div>
    </ProtectedRoute>
  );
}
```

## Step 6: Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/admin/login`
3. Try signing in with email/password or OAuth
4. Verify you can access protected admin routes
5. Test sign out functionality

## Troubleshooting

### OAuth redirect not working

- Check Supabase redirect URLs match your configuration
- Ensure OAuth provider credentials are correct in Supabase

### Token verification fails

- Verify `SUPABASE_SECRET_KEY` is the service role key, not anon key
- Check token is being sent in `Authorization: Bearer <token>` header

### Session not persisting

- Check browser localStorage for `structcms_access_token`
- Verify `AuthProvider` wraps your entire admin app

## Next Steps

- Add role-based access control (RBAC)
- Implement email verification
- Add password reset functionality
- Configure session timeout
- Add audit logging for admin actions
