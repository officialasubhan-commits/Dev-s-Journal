"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { broadcastNotification } from "@/lib/notifications";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createAlbum(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const coverImage = formData.get("coverImage") as string | null;

  if (!title) return;

  await prisma.album.create({
    data: {
      title,
      description,
      coverImage,
      userId,
    },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function uploadImages(urls: string[], albumId: string | null = null) {
  const session = await getServerSession(authOptions);
  const authorId = session?.user?.id;

  if (!urls.length) return;

  const data = urls.map(url => ({
    url,
    albumId: albumId || null,
    authorId
  }));

  await prisma.galleryImage.createMany({
    data
  });

  await broadcastNotification(
    "GALLERY",
    `Added ${urls.length} new image${urls.length === 1 ? '' : 's'} to the gallery`,
    "🖼️ New Gallery Upload",
    "/gallery"
  );

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteAlbum(id: string) {
  // Prisma SetNull will detach images, or we can delete them. We will just delete the album.
  await prisma.album.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
