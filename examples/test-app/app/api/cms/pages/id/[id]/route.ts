import { createNextPageByIdRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const pageByIdRoute = createNextPageByIdRoute({ storageAdapter });

export async function GET(request: Request, context: RouteParams): Promise<Response> {
  const response = await pageByIdRoute.GET(request, context);
  return response as Response;
}

export async function PUT(request: Request, context: RouteParams): Promise<Response> {
  const response = await pageByIdRoute.PUT(request, context);
  return response as Response;
}

export async function DELETE(request: Request, context: RouteParams): Promise<Response> {
  const response = await pageByIdRoute.DELETE(request, context);
  return response as Response;
}
