"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { triggerRealtimeUpdate } from "@/lib/pusher";

export async function approveComment(id: string): Promise<void> {
  await assertAdmin();
  const comment = await prisma.comment.update({
    where: { id },
    data: { approved: true },
    select: { post: { select: { slug: true } } }
  });
  if (comment?.post?.slug) {
    revalidatePath(`/journal/${comment.post.slug}`);
  }
  revalidatePath("/admin/comments");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function rejectComment(id: string): Promise<void> {
  await assertAdmin();
  const comment = await prisma.comment.update({
    where: { id },
    data: { approved: false },
    select: { post: { select: { slug: true } } }
  });
  if (comment?.post?.slug) {
    revalidatePath(`/journal/${comment.post.slug}`);
  }
  revalidatePath("/admin/comments");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function deleteComment(id: string): Promise<void> {
  await assertAdmin();
  const comment = await prisma.comment.delete({
    where: { id },
    select: { post: { select: { slug: true } } }
  });
  if (comment?.post?.slug) {
    revalidatePath(`/journal/${comment.post.slug}`);
  }
  revalidatePath("/admin/comments");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function markMessageRead(id: string): Promise<void> {
  await assertAdmin();
  await prisma.message.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

export async function deleteMessage(id: string): Promise<void> {
  await assertAdmin();
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
}

