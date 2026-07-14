"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getBackups() {
  try {
    return await prisma.backup.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch backups:", error);
    return [];
  }
}

export async function createBackup(data: { name: string; description?: string; isAuto?: boolean }) {
  try {
    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      siteSettings: await prisma.siteSettings.findMany(),
      post: await prisma.post.findMany(),
      category: await prisma.category.findMany(),
      comment: await prisma.comment.findMany(),
      project: await prisma.project.findMany(),
      skill: await prisma.skill.findMany(),
      course: await prisma.course.findMany(),
      book: await prisma.book.findMany(),
      certification: await prisma.certification.findMany(),
      achievement: await prisma.achievement.findMany(),
      userAchievement: await prisma.userAchievement.findMany(),
      activity: await prisma.activity.findMany(),
      album: await prisma.album.findMany(),
      galleryImage: await prisma.galleryImage.findMany(),
      message: await prisma.message.findMany(),
      draft: await prisma.draft.findMany(),
      notification: await prisma.notification.findMany(),
      maintenanceLog: await prisma.maintenanceLog.findMany(),
      user: await prisma.user.findMany(),
    };

    const payload = JSON.stringify(backupData);
    const size = Buffer.byteLength(payload, "utf-8");

    const backup = await prisma.backup.create({
      data: {
        name: data.name,
        description: data.description || "",
        size,
        status: "SUCCESS",
        payload,
        isAuto: data.isAuto || false,
      },
    });

    revalidatePath("/admin/backups");
    return { success: "Backup created successfully!", backupId: backup.id };
  } catch (error: any) {
    console.error("Backup creation failed:", error);
    return { error: error?.message || "Backup creation failed." };
  }
}

export async function deleteBackup(id: string) {
  try {
    await prisma.backup.delete({
      where: { id },
    });
    revalidatePath("/admin/backups");
    return { success: "Backup deleted successfully!" };
  } catch (error: any) {
    console.error("Failed to delete backup:", error);
    return { error: error?.message || "Failed to delete backup." };
  }
}

export async function restoreBackup(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email;
    if (!currentUserEmail) {
      return { error: "Authentication required to perform restoration." };
    }

    const backup = await prisma.backup.findUnique({
      where: { id },
    });

    if (!backup || backup.status !== "SUCCESS") {
      return { error: "Selected backup was not found or is invalid." };
    }

    const data = JSON.parse(backup.payload);

    // Get current administrator user to preserve session
    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail },
    });

    if (!currentUser) {
      return { error: "Current administrator account was not found in the database." };
    }

    // Safety: Auto backup of the current database state first
    await createBackup({
      name: `Auto: Before restoring "${backup.name}"`,
      description: "Automatic rollback recovery point created before database restoration.",
      isAuto: true,
    });

    // Run delete and insert operations in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Clear child records first to satisfy foreign key constraints
      await tx.comment.deleteMany();
      await tx.userAchievement.deleteMany({
        where: { userId: { not: currentUser.id } },
      });
      await tx.activity.deleteMany({
        where: { userId: { not: currentUser.id } },
      });
      await tx.galleryImage.deleteMany();

      // 2. Clear other parent records
      await tx.post.deleteMany();
      await tx.category.deleteMany();
      await tx.album.deleteMany();
      await tx.course.deleteMany();
      await tx.book.deleteMany();
      await tx.certification.deleteMany();
      await tx.project.deleteMany();
      await tx.skill.deleteMany();
      await tx.achievement.deleteMany();
      await tx.message.deleteMany();
      await tx.notification.deleteMany();
      await tx.draft.deleteMany();
      await tx.maintenanceLog.deleteMany();
      await tx.siteSettings.deleteMany();

      // Delete other users
      await tx.user.deleteMany({
        where: { id: { not: currentUser.id } },
      });

      // 3. Restore records in parent-child hierarchy
      // Site settings
      if (data.siteSettings && data.siteSettings.length > 0) {
        for (const settings of data.siteSettings) {
          await tx.siteSettings.upsert({
            where: { id: settings.id },
            update: settings,
            create: settings,
          });
        }
      }

      // Users
      if (data.user && data.user.length > 0) {
        for (const u of data.user) {
          if (u.id === currentUser.id || u.email === currentUser.email) {
            // Update current user details from backup, keeping credentials intact
            await tx.user.update({
              where: { id: currentUser.id },
              data: {
                name: u.name,
                image: u.image,
                role: u.role,
                twoFactorEnabled: u.twoFactorEnabled,
                twoFactorSecret: u.twoFactorSecret,
              },
            });
          } else {
            // Insert other users
            await tx.user.create({ data: u });
          }
        }
      }

      // Categories
      if (data.category && data.category.length > 0) {
        await tx.category.createMany({ data: data.category });
      }

      // Posts
      if (data.post && data.post.length > 0) {
        await tx.post.createMany({ data: data.post });
      }

      // Comments
      if (data.comment && data.comment.length > 0) {
        await tx.comment.createMany({ data: data.comment });
      }

      // Projects
      if (data.project && data.project.length > 0) {
        await tx.project.createMany({ data: data.project });
      }

      // Skills
      if (data.skill && data.skill.length > 0) {
        await tx.skill.createMany({ data: data.skill });
      }

      // Courses
      if (data.course && data.course.length > 0) {
        await tx.course.createMany({ data: data.course });
      }

      // Books
      if (data.book && data.book.length > 0) {
        await tx.book.createMany({ data: data.book });
      }

      // Certifications
      if (data.certification && data.certification.length > 0) {
        await tx.certification.createMany({ data: data.certification });
      }

      // Albums
      if (data.album && data.album.length > 0) {
        await tx.album.createMany({ data: data.album });
      }

      // Gallery Images
      if (data.galleryImage && data.galleryImage.length > 0) {
        await tx.galleryImage.createMany({ data: data.galleryImage });
      }

      // Messages
      if (data.message && data.message.length > 0) {
        await tx.message.createMany({ data: data.message });
      }

      // Drafts
      if (data.draft && data.draft.length > 0) {
        await tx.draft.createMany({ data: data.draft });
      }

      // Notifications
      if (data.notification && data.notification.length > 0) {
        await tx.notification.createMany({ data: data.notification });
      }

      // Maintenance Logs
      if (data.maintenanceLog && data.maintenanceLog.length > 0) {
        await tx.maintenanceLog.createMany({ data: data.maintenanceLog });
      }

      // Achievements
      if (data.achievement && data.achievement.length > 0) {
        await tx.achievement.createMany({ data: data.achievement });
      }

      // User Achievements
      if (data.userAchievement && data.userAchievement.length > 0) {
        // filter out current user achievements if they already have unlocks
        const achievementsToInsert = data.userAchievement.filter(
          (ua: any) => ua.userId !== currentUser.id
        );
        if (achievementsToInsert.length > 0) {
          await tx.userAchievement.createMany({ data: achievementsToInsert });
        }
      }

      // Activities
      if (data.activity && data.activity.length > 0) {
        const activitiesToInsert = data.activity.filter(
          (act: any) => act.userId !== currentUser.id
        );
        if (activitiesToInsert.length > 0) {
          await tx.activity.createMany({ data: activitiesToInsert });
        }
      }
    });

    revalidatePath("/admin/backups");
    revalidatePath("/admin/dashboard");
    revalidatePath("/", "layout");

    return { success: "Website successfully restored to the backup point!" };
  } catch (error: any) {
    console.error("Restoration failed, database transaction rolled back:", error);
    return { error: error?.message || "Restoration failed. Database transaction rolled back." };
  }
}

export async function autoBackup(actionName: string) {
  try {
    await createBackup({
      name: `Auto: Before ${actionName}`,
      description: `Automatically created before: ${actionName}`,
      isAuto: true,
    });
  } catch (error) {
    console.error("Auto backup helper encountered an error:", error);
  }
}
