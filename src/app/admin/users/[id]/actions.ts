"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateUserRole(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;

  if (userId === (session?.user as any)?.id) {
    throw new Error("You cannot change your own role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath(`/admin/users`);
}

export async function toggleSuspension(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const userId = formData.get("userId") as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const isSuspended = user.lockedUntil && user.lockedUntil > new Date();
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      lockedUntil: isSuspended ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Suspend for 7 days
    },
  });

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath(`/admin/users`);
}

export async function deleteUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const userId = formData.get("userId") as string;

  // Prevent admin from deleting themselves
  if (userId === (session?.user as any)?.id) {
    throw new Error("Cannot delete yourself");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  redirect("/admin/users");
}
