"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getSiteSettings } from "@/app/admin/settings/actions";

export type AboutFormData = {
  // User Model
  name: string;
  displayName: string;
  occupation: string;
  shortIntroduction: string;
  biography: string;
  college: string;
  course: string;
  company: string;
  country: string;
  state: string;
  city: string;
  skills: string[];
  technologies: string[];
  spokenLanguages: string[];
  image: string;
  customStats: any;

  // Settings Models
  resumePdf: string;
  githubUrl: string;
  linkedinUrl: string;
  discordUsername: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
};

export async function getAboutData() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  const settings = await getSiteSettings();

  return { admin, settings };
}

export async function updateAboutProfile(data: Partial<AboutFormData>) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) throw new Error("Admin not found");

  const userUpdates = {
    name: data.name !== undefined ? data.name : admin.name,
    displayName: data.displayName !== undefined ? data.displayName : admin.displayName,
    occupation: data.occupation !== undefined ? data.occupation : admin.occupation,
    shortIntroduction: data.shortIntroduction !== undefined ? data.shortIntroduction : admin.shortIntroduction,
    biography: data.biography !== undefined ? data.biography : admin.biography,
    college: data.college !== undefined ? data.college : admin.college,
    course: data.course !== undefined ? data.course : admin.course,
    company: data.company !== undefined ? data.company : admin.company,
    country: data.country !== undefined ? data.country : admin.country,
    state: data.state !== undefined ? data.state : admin.state,
    city: data.city !== undefined ? data.city : admin.city,
    skills: data.skills !== undefined ? data.skills : admin.skills,
    technologies: data.technologies !== undefined ? data.technologies : admin.technologies,
    spokenLanguages: data.spokenLanguages !== undefined ? data.spokenLanguages : admin.spokenLanguages,
    image: data.image !== undefined ? data.image : admin.image,
    customStats: data.customStats !== undefined ? data.customStats : admin.customStats,
  };

  await prisma.user.update({
    where: { id: admin.id },
    data: userUpdates,
  });

  const hasAboutSettingsUpdate = data.resumePdf !== undefined;
  const hasContactSettingsUpdate = 
    data.githubUrl !== undefined ||
    data.linkedinUrl !== undefined ||
    data.discordUsername !== undefined ||
    data.instagramUrl !== undefined ||
    data.facebookUrl !== undefined ||
    data.youtubeUrl !== undefined;

  if (hasAboutSettingsUpdate || hasContactSettingsUpdate) {
    const settings = await getSiteSettings();

    if (hasAboutSettingsUpdate) {
      await prisma.aboutSettings.upsert({
        where: { id: "singleton" },
        update: {
          resumePdf: data.resumePdf !== undefined ? data.resumePdf : settings.resumePdf,
        },
        create: {
          id: "singleton",
          resumePdf: data.resumePdf !== undefined ? data.resumePdf : settings.resumePdf,
        }
      });
    }

    if (hasContactSettingsUpdate) {
      await prisma.contactSettings.upsert({
        where: { id: "singleton" },
        update: {
          githubUrl: data.githubUrl !== undefined ? data.githubUrl : settings.githubUrl,
          linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : settings.linkedinUrl,
          discordUsername: data.discordUsername !== undefined ? data.discordUsername : settings.discordUsername,
          instagramUrl: data.instagramUrl !== undefined ? data.instagramUrl : settings.instagramUrl,
          facebookUrl: data.facebookUrl !== undefined ? data.facebookUrl : settings.facebookUrl,
          youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : settings.youtubeUrl,
        },
        create: {
          id: "singleton",
          githubUrl: data.githubUrl !== undefined ? data.githubUrl : settings.githubUrl,
          linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : settings.linkedinUrl,
          discordUsername: data.discordUsername !== undefined ? data.discordUsername : settings.discordUsername,
          instagramUrl: data.instagramUrl !== undefined ? data.instagramUrl : settings.instagramUrl,
          facebookUrl: data.facebookUrl !== undefined ? data.facebookUrl : settings.facebookUrl,
          youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : settings.youtubeUrl,
        }
      });
    }
  }

  // Instantly revalidate public pages and layout to display updates
  revalidatePath("/about");
  revalidatePath("/");
  revalidatePath("/admin/about");

  const { triggerRealtimeUpdate } = await import("@/lib/pusher");
  await triggerRealtimeUpdate("devs-journal-sync", "content-updated");

  return { success: true };
}
