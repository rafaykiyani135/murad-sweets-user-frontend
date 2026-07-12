import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;

    if (!file || !name) {
      return NextResponse.json({ error: 'Missing file or name' }, { status: 400 });
    }

    // Strip all whitespace to form the filename: "Gulab Jamun" → "GulabJamun"
    const fileName = name.replace(/\s+/g, '');
    if (!fileName) {
      return NextResponse.json({ error: 'Product name is empty after stripping spaces' }, { status: 400 });
    }

    // Resolve to public/ in the Next.js project root
    const outputPath = path.join(process.cwd(), 'public', `${fileName}.webp`);

    // Read uploaded file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP using sharp (quality 85 — good balance of size vs quality)
    await sharp(buffer)
      .webp({ quality: 85 })
      .toFile(outputPath);

    const timestamp = Date.now();
    return NextResponse.json({
      success: true,
      fileName: `${fileName}.webp`,
      publicPath: `/${fileName}.webp?v=${timestamp}`,
    });
  } catch (error) {
    console.error('[upload-image] Error:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
