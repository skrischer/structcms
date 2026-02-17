import { createNextNavigationByIdRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const navigationByIdRoute = createNextNavigationByIdRoute({ storageAdapter });

export async function GET(request: Request, context: RouteParams): Promise<Response> {
  const response = await navigationByIdRoute.GET(request, context);
  return response as Response;
}

export async function PUT(request: Request, context: RouteParams): Promise<Response> {
  const response = await navigationByIdRoute.PUT(request, context);
  return response as Response;
}

export async function DELETE(request: Request, context: RouteParams): Promise<Response> {
  const response = await navigationByIdRoute.DELETE(request, context);
  return response as Response;
}
