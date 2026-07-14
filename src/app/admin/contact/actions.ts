"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    
    // Revalidate all pages using contact or layout parameters
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/", "layout");

    return { success: "All contact and social settings saved successfully!" };
  } catch (error: any) {
    console.error("saveContactSettings error:", error);
    return { error: error?.message || "Failed to save contact settings." };
  }
}

export async function resetContactSettings() {
  try {
    await prisma.siteSettings.update({
      where: { id: "singleton" },
      data: {
        contactHeading: "Get In Touch",
        contactDescription: "Have a project in mind, want to collaborate, or just want to say hi? Send me a message!",
        availabilityStatus: "Available",
        contactEmail: "",
        phoneNumber: "",
        whatsappNumber: "",
        country: "",
        state: "",
        city: "",
        fullAddress: "",
        googleMapsUrl: "",
        resumePdf: "",
        githubUrl: "",
        linkedinUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        facebookUrl: "",
        youtubeUrl: "",
        discordUsername: "",
        telegramUsername: "",
      }
    });
    
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/", "layout");

    return { success: "Contact and social settings reset successfully!" };
  } catch (error: any) {
    console.error("resetContactSettings error:", error);
    return { error: error?.message || "Failed to reset settings." };
  }
}
