"use client";

import React, { createContext, useContext } from "react";

export type SiteSettingsType = {
  siteTitle: string;
  siteTagline: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  siteUrl: string;
  authorName: string;
  authorEmail: string;
  contactEmail: string;
  availabilityStatus: string;
  contactHeading: string;
  contactDescription: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  discordUsername: string;
  telegramUsername: string;
  enableComments: boolean;
  enableGallery: boolean;
  enableLearning: boolean;
  enableNotifications: boolean;
  
  // Homepage Customization
  heroTitle: string;
  heroHighlighted: string;
  heroDescription: string;
  heroProfileImage: string;
  heroBgDecor: string;
  heroBtnPrimaryText: string;
  heroBtnPrimaryLink: string;
  heroBtnSecondaryText: string;
  heroBtnSecondaryLink: string;
  authorTitle: string;
  authorBio: string;
  featuredProjects: string[];
  featuredPosts: string[];
  featuredCertificates: string[];
  featuredCourses: string[];
};

const SiteSettingsContext = createContext<SiteSettingsType | null>(null);

export function SiteSettingsProvider({ 
  value, 
  children 
}: { 
  value: SiteSettingsType; 
  children: React.ReactNode 
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      siteTitle: "Dev's Journal",
      siteTagline: "My personal portfolio, journal, and digital headquarters.",
      siteDescription: "My personal portfolio, journal, and digital headquarters.",
      siteLogo: "",
      siteFavicon: "",
      siteUrl: "http://localhost:3000",
      authorName: "Abdus Subhan",
      authorEmail: "",
      contactEmail: "",
      availabilityStatus: "Available",
      contactHeading: "Get In Touch",
      contactDescription: "Have a project in mind, want to collaborate, or just want to say hi? Send me a message!",
      githubUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      discordUsername: "",
      telegramUsername: "",
      enableComments: true,
      enableGallery: true,
      enableLearning: true,
      enableNotifications: true,
      heroTitle: "Designing simple, warm & premium digital experiences.",
      heroHighlighted: "warm & premium",
      heroDescription: "I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.",
      heroProfileImage: "",
      heroBgDecor: "glow",
      heroBtnPrimaryText: "Explore Projects",
      heroBtnPrimaryLink: "/projects",
      heroBtnSecondaryText: "Read Journal",
      heroBtnSecondaryLink: "/journal",
      authorTitle: "Software Engineer & UI/UX Designer",
      authorBio: "Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.",
      featuredProjects: [] as string[],
      featuredPosts: [] as string[],
      featuredCertificates: [] as string[],
      featuredCourses: [] as string[],
    };
  }
  return context;
}
