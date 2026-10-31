import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';

function storageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

async function removeLocalFile(relativePath: string) {
  const publicDir = path.join(process.cwd(), 'public');
  const filePath = path.join(publicDir, relativePath.replace(/^\/+/, ''));

  // Guard against path traversal (e.g. "../../.env").
  if (!filePath.startsWith(publicDir + path.sep)) {
    throw new Error('Invalid image path');
  }

  try {
    await fs.unlink(filePath);
    console.log(`[delete-image] Deleted local file: ${relativePath}`);
  } catch (e) {
    // ENOENT = file doesn't exist — treat as success (idempotent)
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
    console.warn(`[delete-image] Local file not found (skipping): ${relativePath}`);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name;
    const url: string | undefined = body?.url;

    if (!name && !url) {
      return NextResponse.json({ error: 'Missing image name or url' }, { status: 400 });
    }

    // 1. Supabase Storage public URL
    if (url && /^https?:\/\//i.test(url) && storageConfigured()) {
      const parsed = new URL(url);
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const markerIndex = parsed.pathname.indexOf(marker);

      if (markerIndex !== -1) {
        const objectPath = decodeURIComponent(
          parsed.pathname.slice(markerIndex + marker.length)
        );
        const { error } = await getSupabase().storage.from(BUCKET).remove([objectPath]);
        if (error) throw error;
        console.log(`[delete-image] Deleted storage object: ${objectPath}`);
        return NextResponse.json({ success: true, storage: 'supabase' });
      }

      // Remote image we don't manage (e.g. Square CDN) — nothing to delete.
      return NextResponse.json({ success: true, skipped: true });
    }

    // 2. Local /public path (legacy images or local dev)
    if (url && url.startsWith('/')) {
      const cleanPath = url.split('?')[0];
      await removeLocalFile(cleanPath);
      return NextResponse.json({ success: true, storage: 'local' });
    }

    // 3. Legacy fallback: filename derived from the product name
    if (name) {
      const fileName = name.replace(/\s+/g, '');
      await removeLocalFile(`${fileName}.webp`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[delete-image] Error:', error);
    return NextResponse.json({ error: 'Image deletion failed' }, { status: 500 });
  }
}
