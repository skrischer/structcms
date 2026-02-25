import { storageAdapter } from '@/lib/adapters';
import { createNextPageBySlugRoute } from '@structcms/api/next';

interface RouteParams {
  params: Promise<{ slug: string | string[] }>;
}

const pageBySlugRoute = createNextPageBySlugRoute({ storageAdapter });

export async function GET(request: Request, context: RouteParams): Promise<Response> {
  const response = await pageBySlugRoute.GET(request, context);
  return response as Response;
}
