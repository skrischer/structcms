export {
  createNextPagesRoute,
  createNextPageBySlugRoute,
  createNextPageByIdRoute,
  createNextMediaRoute,
  createNextMediaByIdRoute,
  createNextNavigationRoute,
  createNextNavigationByIdRoute,
} from './factories';

export type {
  NextPagesRouteConfig,
  NextPageBySlugRouteConfig,
  NextPageByIdRouteConfig,
  NextMediaRouteConfig,
  NextMediaByIdRouteConfig,
  NextNavigationRouteConfig,
  NextNavigationByIdRouteConfig,
} from './factories';

export {
  createNextAuthOAuthRoute,
  createNextAuthSignInRoute,
  createNextAuthSignOutRoute,
  createNextAuthVerifyRoute,
  createNextAuthRefreshRoute,
  createNextAuthCurrentUserRoute,
  createAuthenticatedRoute,
} from './auth-factories';

export type {
  NextAuthOAuthRouteConfig,
  NextAuthSignInRouteConfig,
  NextAuthSignOutRouteConfig,
  NextAuthVerifyRouteConfig,
  NextAuthRefreshRouteConfig,
  NextAuthCurrentUserRouteConfig,
} from './auth-factories';
