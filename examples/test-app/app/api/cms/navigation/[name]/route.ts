import { NextResponse } from 'next/server';
import { handleGetNavigation } from '@structcms/api';
import { createNextNavigationByIdRoute } from '@structcms/api/next';
import { storageAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ name: string }>;
}

const navigationByIdRoute = createNextNavigationByIdRoute({ storageAdapter });

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { name } = await params;
    const navigation = await handleGetNavigation(storageAdapter, name);
    if (!navigation) {
      return NextResponse.json({ error: 'Navigation not found' }, { status: 404 });
    }
    return NextResponse.json(navigation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { name } = await params;
    const existingNav = await handleGetNavigation(storageAdapter, name);
    if (!existingNav) {
      return NextResponse.json({ error: 'Navigation not found' }, { status: 404 });
    }

    const response = await navigationByIdRoute.PUT(request, {
      params: Promise.resolve({ id: existingNav.id }),
    });

    return response as Response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
