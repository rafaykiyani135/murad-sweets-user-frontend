import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name;

    if (!name) {
      return NextResponse.json({ error: 'Missing product name' }, { status: 400 });
    }

    // Strip spaces to match the upload naming convention
    const fileName = name.replace(/\s+/g, '');
    const filePath = path.join(process.cwd(), 'public', `${fileName}.webp`);

    try {
      await fs.unlink(filePath);
      console.log(`[delete-image] Deleted: ${fileName}.webp`);
    } catch (e: any) {
      // ENOENT = file doesn't exist — treat as success (idempotent)
      if (e.code !== 'ENOENT') {
        throw e;
      }
      console.warn(`[delete-image] File not found (skipping): ${fileName}.webp`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[delete-image] Error:', error);
    return NextResponse.json({ error: 'Image deletion failed' }, { status: 500 });
  }
}
