"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveComment(id: string): Promise<void> {
  await prisma.comment.update({ where: { id }, data: { approved: true } });
  revalidatePath("/admin/comments");
}

export async function rejectComment(id: string): Promise<void> {
  await prisma.comment.update({ where: { id }, data: { approved: false } });
  revalidatePath("/admin/comments");
}

export async function deleteComment(id: string): Promise<void> {
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
}

export async function markMessageRead(id: string): Promise<void> {
  await prisma.message.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string): Promise<void> {
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
