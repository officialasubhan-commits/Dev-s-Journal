"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function saveBrandingSettings(formData: FormData): Promise<void> {
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
  // Revalidate entire app to instantly display branding updates
  revalidatePath("/", "layout");
}

export async function saveGeneralSettings(formData: FormData): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      siteTitle: formData.get("siteTitle") as string,
      siteDescription: formData.get("siteDescription") as string,
      siteUrl: formData.get("siteUrl") as string,
      authorName: formData.get("authorName") as string,
      authorEmail: formData.get("authorEmail") as string,
    },
    create: { id: "singleton" },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

export async function saveContactSettings(formData: FormData): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      contactEmail: formData.get("contactEmail") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      country: formData.get("country") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      fullAddress: formData.get("fullAddress") as string,
      googleMapsUrl: formData.get("googleMapsUrl") as string,
      resumePdf: formData.get("resumePdf") as string,
    },
    create: { id: "singleton" },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  revalidatePath("/about");
}

export async function saveSeoSettings(formData: FormData): Promise<void> {
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
}

export async function saveAppearanceSettings(formData: FormData): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      defaultTheme: formData.get("defaultTheme") as string,
    },
    create: { id: "singleton" },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}


export async function saveFeatureFlags(formData: FormData): Promise<void> {
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
}

export async function saveMaintenanceSettings(formData: FormData): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      maintenanceMode: formData.get("maintenanceMode") === "on",
      maintenanceMessage: formData.get("maintenanceMessage") as string,
    },
    create: { id: "singleton" },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
