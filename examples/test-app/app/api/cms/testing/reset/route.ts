import { mediaAdapter, storageAdapter } from '@/lib/adapters';
import {
  handleDeleteMedia,
  handleDeletePage,
  handleListMedia,
  handleListPages,
} from '@structcms/api';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const pages = await handleListPages(storageAdapter);
    for (const page of pages) {
      await handleDeletePage(storageAdapter, page.id);
    }

    const navigations = await storageAdapter.listNavigations();
    for (const nav of navigations) {
      await storageAdapter.deleteNavigation(nav.id);
    }

    const media = await handleListMedia(mediaAdapter);
    for (const file of media) {
      await handleDeleteMedia(mediaAdapter, file.id);
    }

    return NextResponse.json({ status: 'reset' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
