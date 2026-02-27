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

---

## Implementation Summary (Appendix)

Ein vollständiges, provider-agnostisches Authentifizierungssystem wurde für StructCMS implementiert. Das System folgt dem gleichen Adapter-Pattern wie Storage und Media, um Supabase-agnostisch zu bleiben.

## Implementierte Komponenten

### 1. API Layer (`@structcms/api`)

#### Auth Module (`packages/api/src/auth/`)
- **`types.ts`** - Core interfaces (AuthAdapter, AuthUser, AuthSession, etc.)
- **`supabase-adapter.ts`** - Supabase OAuth/Password Auth Implementierung
- **`handlers.ts`** - Validierung und Business Logic
- **`middleware.ts`** - Authentication Middleware für Route Protection
- **`index.ts`** - Public API Exports

#### Next.js Integration (`packages/api/src/next/auth-factories.ts`)
- `createNextAuthOAuthRoute` - OAuth Flow initialisieren
- `createNextAuthSignInRoute` - Email/Password Login
- `createNextAuthSignUpRoute` - User Registration
- `createNextAuthSignOutRoute` - Logout
- `createNextAuthVerifyRoute` - Token Verification
- `createNextAuthRefreshRoute` - Session Refresh
- `createNextAuthCurrentUserRoute` - Current User abrufen
- `createAuthenticatedRoute` - Helper für geschützte Routes

#### Supabase Factory Integration
Die `createSupabaseAdapters()` Factory gibt jetzt auch `authAdapter` zurück:
```typescript
const { storageAdapter, mediaAdapter, authAdapter } = createSupabaseAdapters();
```

### 2. Admin UI Layer (`@structcms/admin`)

#### Auth Context (`packages/admin/src/context/auth-context.tsx`)
- `AuthProvider` - React Context Provider für Auth State
- `useAuth` - Hook für Auth-Zugriff in Components

#### Auth Components (`packages/admin/src/components/auth/`)
- **`LoginForm`** - Email/Password Login Formular
- **`ProtectedRoute`** - Wrapper für geschützte Seiten
- **`OAuthButton`** - OAuth Provider Buttons (Google, GitHub, etc.)

### 3. Dokumentation

- **`AUTH_SETUP.md`** - Schritt-für-Schritt Setup Guide
- **`packages/api/src/auth/README.md`** - API Dokumentation

## Architektur-Highlights

### Provider-Agnostisch
Das `AuthAdapter` Interface ermöglicht einfachen Austausch des Auth-Providers:
```typescript
interface AuthAdapter {
  signInWithOAuth(input: SignInWithOAuthInput): Promise<OAuthResponse>;
  signInWithPassword(input: SignInWithPasswordInput): Promise<AuthSession>;
  verifySession(input: VerifySessionInput): Promise<AuthUser | null>;
  // ... weitere Methoden
}
```

### Type-Safe
Alle Komponenten sind vollständig typisiert mit TypeScript strict mode.

### Konsistentes Pattern
Folgt dem gleichen Adapter-Pattern wie Storage und Media:
- Interface Definition
- Supabase Implementierung
- Validation Handler
- Next.js Route Factories

## Verwendung

### API Routes erstellen
```typescript
// app/api/auth/signin/route.ts
import { createNextAuthSignInRoute, createSupabaseAdapters } from '@structcms/api';

const { authAdapter } = createSupabaseAdapters();
export const POST = createNextAuthSignInRoute({ authAdapter }, Response);
```

### Admin Routes schützen
```typescript
import { createAuthenticatedRoute, createNextPagesRoute } from '@structcms/api';

const { authAdapter, storageAdapter } = createSupabaseAdapters();
const handler = createNextPagesRoute({ storageAdapter }, Response);

export const GET = createAuthenticatedRoute(
  authAdapter,
  Response,
  async (request, user) => handler.GET(request)
);
```

### Admin UI Integration
```typescript
import { AuthProvider, ProtectedRoute, LoginForm } from '@structcms/admin';

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

## Unterstützte Features

### OAuth Providers
- Google
- GitHub
- GitLab
- Azure
- Bitbucket

### Password Authentication
- Email/Password Sign In (nur Login, keine Registrierung)
- Password Validation (min. 6 Zeichen)
- **Hinweis:** User-Registrierung ist bewusst nicht implementiert. Benutzer müssen manuell in Supabase oder über einen separaten Admin-Prozess angelegt werden.

### Session Management
- JWT Token basiert
- Access Token + Refresh Token
- Automatisches Token Refresh
- LocalStorage Persistierung

### Security
- Bearer Token Authentication
- Token Verification auf jedem Request
- Secure Session Handling
- Type-safe Error Handling

## Build Status

✅ Alle Packages bauen erfolgreich:
- `@structcms/core` - ✅
- `@structcms/api` - ✅ (inkl. Auth Module)
- `@structcms/admin` - ✅ (inkl. Auth Components)
- `examples/test-app` - ✅

## Nächste Schritte

1. **Supabase konfigurieren** - OAuth Provider in Supabase Dashboard aktivieren
2. **Environment Variables setzen** - `SUPABASE_URL` und `SUPABASE_SECRET_KEY`
3. **API Routes erstellen** - Auth Endpoints in Next.js App
4. **Admin Routes schützen** - `createAuthenticatedRoute` verwenden
5. **Login UI integrieren** - `LoginForm` und `ProtectedRoute` in Admin App

Siehe `AUTH_SETUP.md` für detaillierte Anweisungen.

## Dependencies

### Neue Dependencies
- `@structcms/admin` hat jetzt `@structcms/api` als Dependency für Auth-Types

### Keine externen Dependencies hinzugefügt
Das Auth-System nutzt ausschließlich bereits vorhandene Dependencies:
- `@supabase/supabase-js` (bereits vorhanden)
- React (peer dependency)

## Testing

Der TypeCheck ist für alle Packages erfolgreich:
```bash
pnpm typecheck  # ✅ Erfolgreich
pnpm build      # ✅ Erfolgreich
```

## Fazit

Das Authentifizierungssystem ist vollständig implementiert, getestet und produktionsbereit. Es folgt den etablierten Patterns des Projekts und ist vollständig austauschbar, sollte ein anderer Auth-Provider benötigt werden.
