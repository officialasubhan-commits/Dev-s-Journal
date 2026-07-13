"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



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

  // SiteSettings Model
  resumePdf: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
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

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

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

  if (data.resumePdf !== undefined || data.githubUrl !== undefined) {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: "singleton" },
        data: {
          resumePdf: data.resumePdf !== undefined ? data.resumePdf : settings.resumePdf,
          githubUrl: data.githubUrl !== undefined ? data.githubUrl : settings.githubUrl,
          linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : settings.linkedinUrl,
          twitterUrl: data.twitterUrl !== undefined ? data.twitterUrl : settings.twitterUrl,
          instagramUrl: data.instagramUrl !== undefined ? data.instagramUrl : settings.instagramUrl,
          facebookUrl: data.facebookUrl !== undefined ? data.facebookUrl : settings.facebookUrl,
          youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : settings.youtubeUrl,
        }
      });
    }
  }

  return { success: true };
}

