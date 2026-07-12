import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure dir exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    let originalName = file.name || 'image.webp';
    
    // Clean filename
    originalName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Force webp extension since we process client-side as webp
    if (!originalName.toLowerCase().endsWith('.webp')) {
      originalName = originalName.substring(0, originalName.lastIndexOf('.')) + '.webp';
      if (originalName === '.webp') originalName = `image_${uniqueSuffix}.webp`;
    }

    const finalName = `${uniqueSuffix}-${originalName}`;
    const filepath = join(uploadsDir, finalName);
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${finalName}` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
