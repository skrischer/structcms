import { storageAdapter } from '@/lib/adapters';
import { createNextNavigationRoute } from '@structcms/api/next';

const navigationRoute = createNextNavigationRoute({ storageAdapter });

export async function GET(request: Request): Promise<Response> {
  const response = await navigationRoute.GET(request);
  return response as Response;
}

export async function POST(request: Request): Promise<Response> {
  const response = await navigationRoute.POST(request);
  return response as Response;
}
