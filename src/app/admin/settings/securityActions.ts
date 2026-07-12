"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateAdminSecurity(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newEmail = formData.get("newEmail") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword) {
    return { error: "Current password is required" };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password!);

  if (!isPasswordValid) {
    return { error: "Incorrect current password" };
  }

  const updateData: any = {};
  
  if (newEmail && newEmail !== user.email) {
    // Check if new email is taken
    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) {
      return { error: "Email is already in use" };
    }
    updateData.email = newEmail;
  }

  if (newPassword && newPassword.length >= 8) {
    updateData.password = await bcrypt.hash(newPassword, 10);
  } else if (newPassword) {
    return { error: "New password must be at least 8 characters long" };
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
    return { success: "Security settings updated successfully" };
  }

  return { success: "No changes made" };
}
