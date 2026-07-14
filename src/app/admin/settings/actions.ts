"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Fetches the site settings singleton, creating it with defaults if it doesn't exist.
 */
export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

export async function saveBrandingSettings(formData: FormData) {
  try {
    const siteTitle = (formData.get("siteTitle") as string) || "Boss Journal";
    const siteTagline = (formData.get("siteTagline") as string) || "";
    const siteDescription = (formData.get("siteDescription") as string) || "";
    const siteLogo = (formData.get("siteLogo") as string) || "";
    const siteFavicon = (formData.get("siteFavicon") as string) || "";

    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        siteTitle,
        siteTagline,
        siteDescription,
        siteLogo,
        siteFavicon,
      },
      create: { 
        id: "singleton",
        siteTitle,
        siteTagline,
        siteDescription,
        siteLogo,
        siteFavicon,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "Branding settings saved successfully!" };
  } catch (error: any) {
    console.error("saveBrandingSettings error:", error);
    return { error: error?.message || "Failed to save branding settings." };
  }
}

export async function saveGeneralSettings(formData: FormData) {
  try {
    const launchedAtInput = formData.get("launchedAt") as string;
    const launchedAt = launchedAtInput ? new Date(launchedAtInput) : new Date();

    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        siteTitle: formData.get("siteTitle") as string,
        siteDescription: formData.get("siteDescription") as string,
        siteUrl: formData.get("siteUrl") as string,
        authorName: formData.get("authorName") as string,
        authorEmail: formData.get("authorEmail") as string,
        launchedAt,
      },
      create: { 
        id: "singleton",
        siteTitle: formData.get("siteTitle") as string,
        siteDescription: formData.get("siteDescription") as string,
        siteUrl: formData.get("siteUrl") as string,
        authorName: formData.get("authorName") as string,
        authorEmail: formData.get("authorEmail") as string,
        launchedAt,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "General settings saved successfully!" };
  } catch (error: any) {
    console.error("saveGeneralSettings error:", error);
    return { error: error?.message || "Failed to save general settings." };
  }
}

export async function saveContactSettings(formData: FormData) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        contactHeading: (formData.get("contactHeading") as string) || "Get In Touch",
        contactDescription: (formData.get("contactDescription") as string) || "",
        availabilityStatus: (formData.get("availabilityStatus") as string) || "Available",
        contactEmail: (formData.get("contactEmail") as string) || "",
        phoneNumber: (formData.get("phoneNumber") as string) || "",
        whatsappNumber: (formData.get("whatsappNumber") as string) || "",
        country: (formData.get("country") as string) || "",
        state: (formData.get("state") as string) || "",
        city: (formData.get("city") as string) || "",
        fullAddress: (formData.get("fullAddress") as string) || "",
        googleMapsUrl: (formData.get("googleMapsUrl") as string) || "",
        resumePdf: (formData.get("resumePdf") as string) || "",
      },
      create: { id: "singleton" },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/", "layout");
    return { success: "Contact settings saved successfully!" };
  } catch (error: any) {
    console.error("saveContactSettings error:", error);
    return { error: error?.message || "Failed to save contact settings." };
  }
}

export async function saveSeoSettings(formData: FormData) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        seoTitle: formData.get("seoTitle") as string,
        seoDescription: formData.get("seoDescription") as string,
        seoKeywords: formData.get("seoKeywords") as string,
        ogImage: formData.get("ogImage") as string,
      },
      create: { id: "singleton" },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "SEO settings saved successfully!" };
  } catch (error: any) {
    console.error("saveSeoSettings error:", error);
    return { error: error?.message || "Failed to save SEO settings." };
  }
}

export async function saveAppearanceSettings(formData: FormData) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        defaultTheme: formData.get("defaultTheme") as string,
      },
      create: { id: "singleton" },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "Appearance settings saved successfully!" };
  } catch (error: any) {
    console.error("saveAppearanceSettings error:", error);
    return { error: error?.message || "Failed to save appearance settings." };
  }
}

export async function saveFeatureFlags(formData: FormData) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        enableComments: formData.get("enableComments") === "on",
        enableGallery: formData.get("enableGallery") === "on",
        enableLearning: formData.get("enableLearning") === "on",
        enableNotifications: formData.get("enableNotifications") === "on",
      },
      create: { id: "singleton" },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "Feature flags saved successfully!" };
  } catch (error: any) {
    console.error("saveFeatureFlags error:", error);
    return { error: error?.message || "Failed to save feature flags." };
  }
}

export async function saveMaintenanceSettings(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = session?.user?.email || "unknown";

    const maintenanceEnabled = formData.get("maintenanceEnabled") === "on";
    const maintenanceMessage = (formData.get("maintenanceMessage") as string) || "We'll be back soon!";

    // Query active settings to check if state changed
    const current = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
      select: { maintenanceEnabled: true }
    });

    const isStateChanged = !current || current.maintenanceEnabled !== maintenanceEnabled;

    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        maintenanceEnabled,
        maintenanceMessage,
        maintenanceUpdatedBy: adminEmail,
      },
      create: { 
        id: "singleton",
        maintenanceEnabled,
        maintenanceMessage,
        maintenanceUpdatedBy: adminEmail,
      },
    });

    // If state changed, update the MaintenanceLog!
    if (isStateChanged) {
      if (maintenanceEnabled) {
        // Create a new log
        await prisma.maintenanceLog.create({
          data: { enabledAt: new Date() }
        });
      } else {
        // Find the active log and close it
        const activeLog = await prisma.maintenanceLog.findFirst({
          where: { disabledAt: null },
          orderBy: { enabledAt: "desc" }
        });
        if (activeLog) {
          await prisma.maintenanceLog.update({
            where: { id: activeLog.id },
            data: { disabledAt: new Date() }
          });
        }
      }
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "Maintenance settings saved successfully!" };
  } catch (error: any) {
    console.error("saveMaintenanceSettings error:", error);
    return { error: error?.message || "Failed to save maintenance settings." };
  }
}

export async function saveSocialSettings(formData: FormData) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        githubUrl: (formData.get("githubUrl") as string) || "",
        linkedinUrl: (formData.get("linkedinUrl") as string) || "",
        twitterUrl: (formData.get("twitterUrl") as string) || "",
        instagramUrl: (formData.get("instagramUrl") as string) || "",
        facebookUrl: (formData.get("facebookUrl") as string) || "",
        youtubeUrl: (formData.get("youtubeUrl") as string) || "",
        discordUsername: (formData.get("discordUsername") as string) || "",
        telegramUsername: (formData.get("telegramUsername") as string) || "",
      },
      create: { id: "singleton" },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/", "layout");
    return { success: "Social settings saved successfully!" };
  } catch (error: any) {
    console.error("saveSocialSettings error:", error);
    return { error: error?.message || "Failed to save social settings." };
  }
}

export async function saveAnalyticsUploadSettings(formData: FormData) {
  try {
    const googleAnalyticsId = (formData.get("googleAnalyticsId") as string) || "";
    const maxUploadSizeMb = parseInt((formData.get("maxUploadSizeMb") as string) || "5", 10);

    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        googleAnalyticsId,
        maxUploadSizeMb,
      },
      create: {
        id: "singleton",
        googleAnalyticsId,
        maxUploadSizeMb,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { success: "Analytics and Upload settings saved successfully!" };
  } catch (error: any) {
    console.error("saveAnalyticsUploadSettings error:", error);
    return { error: error?.message || "Failed to save analytics and upload settings." };
  }
}
