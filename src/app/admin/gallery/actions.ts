"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { broadcastNotification } from "@/lib/notifications";

import { assertAdmin } from "@/lib/auth";
import { triggerRealtimeUpdate } from "@/lib/pusher";

export async function createAlbum(formData: FormData) {
  const session = await assertAdmin();
  const userId = session.user.id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const coverImage = formData.get("coverImage") as string | null;

  if (!title) {
    return { error: "Album title is required" };
  }

  const existing = await prisma.album.findFirst({
    where: { title, userId }
  });

  if (existing) {
    console.warn(`[createAlbum] Duplicate album violation: ${title}`);
    return { error: "DUPLICATE_ENTRY", id: existing.id };
  }

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
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function uploadImages(urls: string[], albumId: string | null = null) {
  const session = await assertAdmin();
  const authorId = session.user.id;

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
  await triggerRealtimeUpdate("devs-journal-sync", "notifications-updated");

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function deleteAlbum(id: string) {
  await assertAdmin();
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Album Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  // Prisma SetNull will detach images, or we can delete them. We will just delete the album.
  await prisma.album.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function deleteImage(id: string) {
  await assertAdmin();
  try {
    const { autoBackup } = await import("../backups/actions");
    await autoBackup("Gallery Image Deletion");
  } catch (err) {
    console.error("Auto-backup failed before deletion:", err);
  }

  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}
