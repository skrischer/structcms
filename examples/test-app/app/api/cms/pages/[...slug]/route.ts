import { createNextPageBySlugRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ slug: string | string[] }>;
}

const pageBySlugRoute = createNextPageBySlugRoute({ storageAdapter });

export async function GET(request: Request, context: RouteParams): Promise<Response> {
  const response = await pageBySlugRoute.GET(request, context);
  return response as Response;
}
