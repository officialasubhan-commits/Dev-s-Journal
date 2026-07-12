"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveContactSettings(formData: FormData): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      contactHeading: formData.get("contactHeading") as string,
      contactDescription: formData.get("contactDescription") as string,
      availabilityStatus: formData.get("availabilityStatus") as string,
      
      contactEmail: formData.get("contactEmail") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      
      country: formData.get("country") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      fullAddress: formData.get("fullAddress") as string,
      googleMapsUrl: formData.get("googleMapsUrl") as string,
      resumePdf: formData.get("resumePdf") as string,
      
      githubUrl: formData.get("githubUrl") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      twitterUrl: formData.get("twitterUrl") as string,
      instagramUrl: formData.get("instagramUrl") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      youtubeUrl: formData.get("youtubeUrl") as string,
      discordUsername: formData.get("discordUsername") as string,
      telegramUsername: formData.get("telegramUsername") as string,
    },
    create: { id: "singleton" },
  });
  
  // Revalidate both admin page and public contact page
  revalidatePath("/admin/contact");
  revalidatePath("/contact");
}

export async function resetContactSettings(): Promise<void> {
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
}
