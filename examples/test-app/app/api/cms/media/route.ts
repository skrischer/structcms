import { NextResponse } from 'next/server';
import { handleListMedia, handleUploadMedia } from '@structcms/api';
import { mediaAdapter } from '@/lib/adapters';

export async function GET() {
  try {
    const media = await handleListMedia(mediaAdapter);
    return NextResponse.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const mediaFile = await handleUploadMedia(mediaAdapter, {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: arrayBuffer,
    });
    
    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
