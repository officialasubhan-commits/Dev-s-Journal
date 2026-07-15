"use server";

import prisma from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import { join } from "path";

export async function deleteMediaAsset(id: string) {
  try {
    await assertAdmin();

    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return { error: "Asset not found" };
    }

    // If local file, delete it from filesystem
    if (asset.url.startsWith("/uploads/")) {
      const filepath = join(process.cwd(), "public", asset.url);
      await unlink(filepath).catch((err) => {
        console.error("Failed to delete local file:", err);
      });
    }

    // Delete record from database
    await prisma.mediaAsset.delete({
      where: { id }
    });

    revalidatePath("/admin/media");
    return { success: "Asset deleted successfully!" };
  } catch (error: any) {
    console.error("deleteMediaAsset error:", error);
    return { error: error?.message || "Failed to delete media asset." };
  }
}
