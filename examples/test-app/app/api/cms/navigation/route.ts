import { NextResponse } from 'next/server';
import { storageAdapter } from '@/lib/adapters';

export async function GET() {
  try {
    const navigations = await storageAdapter.listNavigations();
    return NextResponse.json(navigations);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
