import { createNextMediaRoute } from '@structcms/api/next';
import { mediaAdapter } from '@/lib/adapters';

const mediaRoute = createNextMediaRoute({ mediaAdapter });

export async function GET(request: Request): Promise<Response> {
  const response = await mediaRoute.GET(request);
  return response as Response;
}

export async function POST(request: Request): Promise<Response> {
  const response = await mediaRoute.POST(request);
  return response as Response;
}
