"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";

export async function saveContactSettings(formData: FormData) {
  try {
    await assertAdmin();

    const contactHeading = (formData.get("contactHeading") as string) || "Get In Touch";
    const contactDescription = (formData.get("contactDescription") as string) || "";
    const availabilityStatus = (formData.get("availabilityStatus") as string) || "Available";
    
    const contactEmail = (formData.get("contactEmail") as string) || "";
    const phoneNumber = (formData.get("phoneNumber") as string) || "";
    const whatsappNumber = (formData.get("whatsappNumber") as string) || "";
    
    const country = (formData.get("country") as string) || "";
    const state = (formData.get("state") as string) || "";
    const city = (formData.get("city") as string) || "";
    const fullAddress = (formData.get("fullAddress") as string) || "";
    const googleMapsUrl = (formData.get("googleMapsUrl") as string) || "";
    
    const githubUrl = (formData.get("githubUrl") as string) || "";
    const linkedinUrl = (formData.get("linkedinUrl") as string) || "";
    const twitterUrl = (formData.get("twitterUrl") as string) || "";
    const instagramUrl = (formData.get("instagramUrl") as string) || "";
    const facebookUrl = (formData.get("facebookUrl") as string) || "";
    const youtubeUrl = (formData.get("youtubeUrl") as string) || "";
    const discordUsername = (formData.get("discordUsername") as string) || "";
    const telegramUsername = (formData.get("telegramUsername") as string) || "";

    const resumePdf = (formData.get("resumePdf") as string) || "";

    await Promise.all([
      prisma.contactSettings.upsert({
        where: { id: "singleton" },
        update: {
          contactHeading,
          contactDescription,
          availabilityStatus,
          contactEmail,
          phoneNumber,
          whatsappNumber,
          country,
          state,
          city,
          fullAddress,
          googleMapsUrl,
          githubUrl,
          linkedinUrl,
          twitterUrl,
          instagramUrl,
          facebookUrl,
          youtubeUrl,
          discordUsername,
          telegramUsername,
        },
        create: {
          id: "singleton",
          contactHeading,
          contactDescription,
          availabilityStatus,
          contactEmail,
          phoneNumber,
          whatsappNumber,
          country,
          state,
          city,
          fullAddress,
          googleMapsUrl,
          githubUrl,
          linkedinUrl,
          twitterUrl,
          instagramUrl,
          facebookUrl,
          youtubeUrl,
          discordUsername,
          telegramUsername,
        }
      }),
      prisma.aboutSettings.upsert({
        where: { id: "singleton" },
        update: { resumePdf },
        create: { id: "singleton", resumePdf }
      })
    ]);
    
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/", "layout");

    const { triggerRealtimeUpdate } = await import("@/lib/pusher");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

    return { success: "All contact and social settings saved successfully!" };
  } catch (error: any) {
    console.error("saveContactSettings error:", error);
    return { error: error?.message || "Failed to save contact settings." };
  }
}

export async function resetContactSettings() {
  try {
    await assertAdmin();

    await Promise.all([
      prisma.contactSettings.update({
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
          githubUrl: "",
          linkedinUrl: "",
          twitterUrl: "",
          instagramUrl: "",
          facebookUrl: "",
          youtubeUrl: "",
          discordUsername: "",
          telegramUsername: "",
        }
      }),
      prisma.aboutSettings.update({
        where: { id: "singleton" },
        data: { resumePdf: "" }
      })
    ]);
    
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/", "layout");

    const { triggerRealtimeUpdate } = await import("@/lib/pusher");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

    return { success: "Contact and social settings reset successfully!" };
  } catch (error: any) {
    console.error("resetContactSettings error:", error);
    return { error: error?.message || "Failed to reset settings." };
  }
}
