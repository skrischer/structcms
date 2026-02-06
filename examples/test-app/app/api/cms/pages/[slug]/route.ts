import { NextResponse } from 'next/server';
import { handleGetPageBySlug, handleUpdatePage, handleDeletePage } from '@structcms/api';
import { storageAdapter } from '@/lib/adapters';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const page = await handleGetPageBySlug(storageAdapter, slug);
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const existingPage = await handleGetPageBySlug(storageAdapter, slug);
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    const data = await request.json();
    const page = await handleUpdatePage(storageAdapter, { ...data, id: existingPage.id });
    return NextResponse.json(page);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const existingPage = await handleGetPageBySlug(storageAdapter, slug);
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    await handleDeletePage(storageAdapter, existingPage.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
