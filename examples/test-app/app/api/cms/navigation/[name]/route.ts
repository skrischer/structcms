import { NextResponse } from 'next/server';
import { handleGetNavigation, handleUpdateNavigation } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ name: string }>;
}

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
    const data = await request.json();
    const navigation = await handleUpdateNavigation(storageAdapter, { ...data, id: existingNav.id });
    return NextResponse.json(navigation);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
