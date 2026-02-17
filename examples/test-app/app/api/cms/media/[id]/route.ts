import { createNextMediaByIdRoute } from '@structcms/api/next';
import { mediaAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const mediaByIdRoute = createNextMediaByIdRoute({ mediaAdapter });

export async function GET(request: Request, context: RouteParams): Promise<Response> {
  const response = await mediaByIdRoute.GET(request, context);
  return response as Response;
}

export async function DELETE(request: Request, context: RouteParams): Promise<Response> {
  const response = await mediaByIdRoute.DELETE(request, context);
  return response as Response;
}
