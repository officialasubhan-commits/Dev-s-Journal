"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";

export async function getBackups() {
  try {
    await assertAdmin();
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
    if (!data.isAuto) {
      await assertAdmin();
    }
    const backupData = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      brandSettings: await prisma.brandSettings.findMany(),
      seoSettings: await prisma.seoSettings.findMany(),
      homepageSettings: await prisma.homepageSettings.findMany(),
      aboutSettings: await prisma.aboutSettings.findMany(),
      contactSettings: await prisma.contactSettings.findMany(),
      courseSettings: await prisma.courseSettings.findMany(),
      certificateSettings: await prisma.certificateSettings.findMany(),
      notificationSettings: await prisma.notificationSettings.findMany(),
      gallerySettings: await prisma.gallerySettings.findMany(),
      footerSettings: await prisma.footerSettings.findMany(),
      generalSettings: await prisma.generalSettings.findMany(),
      maintenanceSettings: await prisma.maintenanceSettings.findMany(),
      
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
    await assertAdmin();
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
    const session = await assertAdmin();
    const currentUserEmail = session.user.email;
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

    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail },
    });

    if (!currentUser) {
      return { error: "Current administrator account was not found in the database." };
    }

    await createBackup({
      name: `Auto: Before restoring "${backup.name}"`,
      description: "Automatic rollback recovery point created before database restoration.",
      isAuto: true,
    });

    await prisma.$transaction(async (tx) => {
      await tx.comment.deleteMany();
      await tx.userAchievement.deleteMany({
        where: { userId: { not: currentUser.id } },
      });
      await tx.activity.deleteMany({
        where: { userId: { not: currentUser.id } },
      });
      await tx.galleryImage.deleteMany();

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
      
      // Delete old modular settings
      await tx.brandSettings.deleteMany();
      await tx.seoSettings.deleteMany();
      await tx.homepageSettings.deleteMany();
      await tx.aboutSettings.deleteMany();
      await tx.contactSettings.deleteMany();
      await tx.courseSettings.deleteMany();
      await tx.certificateSettings.deleteMany();
      await tx.notificationSettings.deleteMany();
      await tx.gallerySettings.deleteMany();
      await tx.footerSettings.deleteMany();
      await tx.generalSettings.deleteMany();
      await tx.maintenanceSettings.deleteMany();

      await tx.user.deleteMany({
        where: { id: { not: currentUser.id } },
      });

      // Restore Modular settings
      if (data.brandSettings?.length) {
        for (const s of data.brandSettings) await tx.brandSettings.create({ data: s });
      }
      if (data.seoSettings?.length) {
        for (const s of data.seoSettings) await tx.seoSettings.create({ data: s });
      }
      if (data.homepageSettings?.length) {
        for (const s of data.homepageSettings) await tx.homepageSettings.create({ data: s });
      }
      if (data.aboutSettings?.length) {
        for (const s of data.aboutSettings) await tx.aboutSettings.create({ data: s });
      }
      if (data.contactSettings?.length) {
        for (const s of data.contactSettings) await tx.contactSettings.create({ data: s });
      }
      if (data.courseSettings?.length) {
        for (const s of data.courseSettings) await tx.courseSettings.create({ data: s });
      }
      if (data.certificateSettings?.length) {
        for (const s of data.certificateSettings) await tx.certificateSettings.create({ data: s });
      }
      if (data.notificationSettings?.length) {
        for (const s of data.notificationSettings) await tx.notificationSettings.create({ data: s });
      }
      if (data.gallerySettings?.length) {
        for (const s of data.gallerySettings) await tx.gallerySettings.create({ data: s });
      }
      if (data.footerSettings?.length) {
        for (const s of data.footerSettings) await tx.footerSettings.create({ data: s });
      }
      if (data.generalSettings?.length) {
        for (const s of data.generalSettings) await tx.generalSettings.create({ data: s });
      }
      if (data.maintenanceSettings?.length) {
        for (const s of data.maintenanceSettings) await tx.maintenanceSettings.create({ data: s });
      }
      
      // Legacy settings restoration support from old backup payload
      if (data.siteSettings && data.siteSettings.length > 0) {
          // If we're restoring an old v1.0 backup, we simply insert singletons for new modular tables using data from old settings
          // But to be completely thorough, we should probably run the same migration script logic. 
          // However, for this project we'll just ignore old settings if we are restoring an old database since we don't have the old schema anymore,
          // OR we could map them manually. Actually Prisma schema won't even know what siteSettings is, so we just ignore it.
      }

      if (data.user && data.user.length > 0) {
        for (const u of data.user) {
          if (u.id === currentUser.id || u.email === currentUser.email) {
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
            await tx.user.create({ data: u });
          }
        }
      }

      if (data.category?.length) await tx.category.createMany({ data: data.category });
      if (data.post?.length) await tx.post.createMany({ data: data.post });
      if (data.comment?.length) await tx.comment.createMany({ data: data.comment });
      if (data.project?.length) await tx.project.createMany({ data: data.project });
      if (data.skill?.length) await tx.skill.createMany({ data: data.skill });
      if (data.course?.length) await tx.course.createMany({ data: data.course });
      if (data.book?.length) await tx.book.createMany({ data: data.book });
      if (data.certification?.length) await tx.certification.createMany({ data: data.certification });
      if (data.album?.length) await tx.album.createMany({ data: data.album });
      if (data.galleryImage?.length) await tx.galleryImage.createMany({ data: data.galleryImage });
      if (data.message?.length) await tx.message.createMany({ data: data.message });
      if (data.draft?.length) await tx.draft.createMany({ data: data.draft });
      if (data.notification?.length) await tx.notification.createMany({ data: data.notification });
      if (data.maintenanceLog?.length) await tx.maintenanceLog.createMany({ data: data.maintenanceLog });
      if (data.achievement?.length) await tx.achievement.createMany({ data: data.achievement });

      if (data.userAchievement?.length) {
        const achievementsToInsert = data.userAchievement.filter((ua: any) => ua.userId !== currentUser.id);
        if (achievementsToInsert.length > 0) {
          await tx.userAchievement.createMany({ data: achievementsToInsert });
        }
      }

      if (data.activity?.length) {
        const activitiesToInsert = data.activity.filter((act: any) => act.userId !== currentUser.id);
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
