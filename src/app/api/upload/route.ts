import { NextResponse } from 'next/server';
import { getSiteSettings } from "@/app/admin/settings/actions";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Administrator access required" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // File Size Validation (dynamically query from settings, default to 5MB)
    let maxUploadSizeMb = 5;
    try {
      const settings = await getSiteSettings();
      if (settings?.maxUploadSizeMb) {
        maxUploadSizeMb = settings.maxUploadSizeMb;
      }
    } catch (e) {
      console.error("Failed to query maxUploadSizeMb from settings:", e);
    }
    const MAX_SIZE = maxUploadSizeMb * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: `File size exceeds ${maxUploadSizeMb}MB limit` }, { status: 400 });
    }

    // Robust File Type Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    let fileType = file.type;

    // Detect MIME type from extension if browser sends generic binary/empty type
    if (!fileType || fileType === 'application/octet-stream') {
      const ext = file.name?.split('.').pop()?.toLowerCase();
      if (ext === 'webp') fileType = 'image/webp';
      else if (ext === 'png') fileType = 'image/png';
      else if (ext === 'jpg' || ext === 'jpeg') fileType = 'image/jpeg';
    }

    if (!validTypes.includes(fileType) && !fileType.startsWith('video/')) {
       return NextResponse.json({ error: `Only JPG, JPEG, PNG, and WEBP image formats are allowed. (Received Type: ${fileType || 'unknown'})` }, { status: 400 });
    }

    // Cloudinary Secure Serverless Signed Upload Integration (Vercel Compatibility)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const isCloudinaryConfigured =
      cloudName &&
      cloudName !== 'your_cloud_name' &&
      apiKey &&
      apiKey !== 'your_api_key' &&
      apiSecret &&
      apiSecret !== 'your_api_secret';

    if (isCloudinaryConfigured) {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const signature = crypto
        .createHash('sha1')
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest('hex');

      const cloudinaryFormData = new FormData();
      const base64Data = buffer.toString('base64');
      const fileData = `data:${fileType};base64,${base64Data}`;

      cloudinaryFormData.append('file', fileData);
      cloudinaryFormData.append('api_key', apiKey);
      cloudinaryFormData.append('timestamp', timestamp);
      cloudinaryFormData.append('signature', signature);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const cloudErrText = await cloudinaryResponse.text();
        let cloudErrMsg = "Cloudinary Upload Failed";
        try {
          const parsed = JSON.parse(cloudErrText);
          cloudErrMsg = parsed.error?.message || cloudErrMsg;
        } catch (_) {
          cloudErrMsg = `${cloudErrMsg}: ${cloudErrText}`;
        }
        return NextResponse.json({ error: cloudErrMsg }, { status: 500 });
      }

      const cloudData = await cloudinaryResponse.json();
      const url = cloudData.secure_url || cloudData.url;

      // Save to Media Library
      await prisma.mediaAsset.create({
        data: {
          url,
          filename: file.name || 'image.webp',
          fileSize: buffer.length,
          mimeType: fileType || 'image/webp'
        }
      }).catch((err: any) => console.error("Failed to save media asset to DB:", err));

      return NextResponse.json({ url });
    }

    // Development Environment Fallback: Local Filesystem Upload
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
    const url = `/uploads/${finalName}`;

    // Save to Media Library
    await prisma.mediaAsset.create({
      data: {
        url,
        filename: originalName,
        fileSize: buffer.length,
        mimeType: fileType || 'image/webp'
      }
    }).catch((err: any) => console.error("Failed to save media asset to DB:", err));

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: `Upload failed: ${error?.message || error}` }, { status: 500 });
  }
}
