import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';

function storageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabase(): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

function toUnsharedBytes(data: Uint8Array): Uint8Array {
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy;
}

// Make a safe, lowercase storage key. "Gulab Jamun" → "gulab-jamun"
function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Create the public bucket on first use so no manual dashboard setup is needed.
async function ensureBucket(supabase: SupabaseClient) {
  const { error } = await supabase.storage.getBucket(BUCKET);
  if (!error) {
    // Make sure an existing bucket is publicly readable.
    await supabase.storage.updateBucket(BUCKET, { public: true });
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });

  // Another request may have created it a moment ago — that's fine.
  if (createError && !/already exists/i.test(createError.message)) {
    throw createError;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = (formData.get('name') as string | null) ?? '';
    // Product id (when editing an existing product) keeps the storage key stable
    // and avoids collisions between products that share the same name.
    const productId = (formData.get('productId') as string | null) ?? '';

    if (!file || !name) {
      return NextResponse.json({ error: 'Missing file or name' }, { status: 400 });
    }

    if (file.type && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 415 });
    }

    const input = Buffer.from(await file.arrayBuffer());

    // Convert to WebP once (quality 85 — good balance of size vs quality)
    const webpRaw = await sharp(input).webp({ quality: 85 }).toBuffer();
    // Sharp 0.35 (wasm fallback under Next.js) can return a Buffer view over a
    // SharedArrayBuffer. undici/File reject that with:
    // "ArrayBuffer: SharedArrayBuffer is not allowed."
    const webp = toUnsharedBytes(webpRaw);

    const slug = toSlug(productId || name);
    if (!slug) {
      return NextResponse.json({ error: 'Product name is empty' }, { status: 400 });
    }

    // Existing product → deterministic key (replace in place).
    // New product → unique key so two products with the same name never collide.
    const key = productId ? slug : `${slug}-${Date.now()}`;
    const objectPath = `products/${key}.webp`;
    const timestamp = Date.now();

    if (storageConfigured()) {
      const supabase = getSupabase();
      await ensureBucket(supabase);

      const { error } = await supabase.storage.from(BUCKET).upload(objectPath, webp, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
      // ?v= busts Next.js/CDN caches when an image is replaced.
      return NextResponse.json({
        success: true,
        fileName: `${key}.webp`,
        publicPath: `${data.publicUrl}?v=${timestamp}`,
        storage: 'supabase',
      });
    }

    // Never silently fall back to the ephemeral disk in production.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error:
            'Image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.',
        },
        { status: 500 }
      );
    }

    // Local development fallback: write to public/ (this is fine on your own machine).
    const publicDir = path.join(process.cwd(), 'public');
    const outputPath = path.join(publicDir, 'products', `${key}.webp`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, webp);

    return NextResponse.json({
      success: true,
      fileName: `${key}.webp`,
      publicPath: `/products/${key}.webp?v=${timestamp}`,
      storage: 'local',
    });
  } catch (error) {
    console.error('[upload-image] Error:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
