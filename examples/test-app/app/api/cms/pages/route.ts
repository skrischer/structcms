import { storageAdapter } from '@/lib/adapters';
import { createNextPagesRoute } from '@structcms/api/next';

const pagesRoute = createNextPagesRoute({ storageAdapter });

export async function GET(request: Request): Promise<Response> {
  const response = await pagesRoute.GET(request);
  return response as Response;
}

export async function POST(request: Request): Promise<Response> {
  const response = await pagesRoute.POST(request);
  return response as Response;
}
