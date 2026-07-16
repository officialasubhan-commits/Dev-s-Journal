"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { triggerRealtimeUpdate } from "@/lib/pusher";
import { getCachedSettings } from "@/lib/cache";
import { cache } from "react";

export async function initializeSettings() {
  try {
    const brandExist = await prisma.brandSettings.findUnique({
      where: { id: "singleton" }
    });
    if (brandExist) return;

    await Promise.all([
      prisma.brandSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.seoSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.homepageSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.aboutSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.contactSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.courseSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.certificateSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.notificationSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.gallerySettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.footerSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.generalSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      }),
      prisma.maintenanceSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" }
      })
    ]);
    revalidateTag("site-settings", "max");
  } catch (error: any) {
    // Ignore the P2002 error (Unique constraint failed) caused by concurrent SSG rendering
    if (error.code !== 'P2002') {
      console.error("Settings initialization error:", error);
    }
  }
}

/**
 * Fetches the site settings singleton, creating it with defaults if it doesn't exist.
 */
export const getSiteSettings = cache(async () => {
  const cached = await getCachedSettings();

  const {
    brand,
    seo,
    homepage,
    about,
    contact,
    course,
    certificate,
    notification,
    gallery,
    footer,
    general,
    maintenance
  } = cached;

  return {
    id: "singleton",
    siteTitle: brand?.siteTitle || "Boss Journal",
    siteTagline: brand?.siteTagline || "My personal portfolio, journal, and digital headquarters.",
    siteDescription: brand?.siteDescription || "My personal portfolio, journal, and digital headquarters.",
    siteLogo: brand?.siteLogo || "",
    siteFavicon: brand?.siteFavicon || "",
    defaultTheme: brand?.defaultTheme || "light",
    defaultLanguage: brand?.defaultLanguage || "en",
    siteUrl: brand?.siteUrl || "http://localhost:3000",
    brandColors: brand?.brandColors || { primary: "#F97316", accent: "#FB7185" },

    seoTitle: seo?.seoTitle || "Boss Journal | Portfolio & Digital Home",
    seoDescription: seo?.seoDescription || "My digital home, where I document my journey, learning, projects, and daily life.",
    seoKeywords: seo?.seoKeywords || "",
    ogImage: seo?.ogImage || "",
    robots: seo?.robots || "index, follow",
    canonicalUrl: seo?.canonicalUrl || "",
    twitterCards: seo?.twitterCards || "summary_large_image",
    structuredData: seo?.structuredData || {},

    heroTitle: homepage?.heroTitle || "Designing simple, warm & premium digital experiences.",
    heroHighlighted: homepage?.heroHighlighted || "warm & premium",
    heroDescription: homepage?.heroDescription || "I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.",
    heroProfileImage: homepage?.heroProfileImage || "",
    heroBgDecor: homepage?.heroBgDecor || "glow",
    heroBtnPrimaryText: homepage?.heroBtnPrimaryText || "Explore Projects",
    heroBtnPrimaryLink: homepage?.heroBtnPrimaryLink || "/projects",
    heroBtnSecondaryText: homepage?.heroBtnSecondaryText || "Read Journal",
    heroBtnSecondaryLink: homepage?.heroBtnSecondaryLink || "/journal",
    authorTitle: homepage?.authorTitle || "Software Engineer & UI/UX Designer",
    authorBio: homepage?.authorBio || "Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.",
    featuredProjects: homepage?.featuredProjects || [],
    featuredPosts: homepage?.featuredPosts || [],
    featuredCertificates: homepage?.featuredCertificates || [],
    featuredCourses: homepage?.featuredCourses || [],
    typingConfig: homepage?.typingConfig || {
      textColor: "#F97316",
      cursorColor: "#F97316",
      cursorWidth: "3px",
      cursorBlinkSpeed: "1s",
      typingSpeed: 100,
      deleteSpeed: 50,
      delayBetweenWords: 2000,
      animationDelay: 800,
      fontWeight: "700",
      fontSize: "inherit",
      textTransform: "none",
      letterSpacing: "normal",
      gradientEnabled: false,
      gradientStart: "#F97316",
      gradientEnd: "#FB7185",
      shadowEnabled: false,
      animationEnabled: true,
      fontFamily: "inherit",
      lineHeight: "normal",
      wordSpacing: "normal"
    },

    aboutTitle: about?.aboutTitle || "About Me",
    aboutDescription: about?.aboutDescription || "",
    aboutImage: about?.aboutImage || "",
    resumePdf: about?.resumePdf || "",
    timeline: about?.timeline || [],

    contactHeading: contact?.contactHeading || "Get In Touch",
    contactDescription: contact?.contactDescription || "",
    availabilityStatus: contact?.availabilityStatus || "Available",
    contactEmail: contact?.contactEmail || "",
    phoneNumber: contact?.phoneNumber || "",
    whatsappNumber: contact?.whatsappNumber || "",
    country: contact?.country || "",
    state: contact?.state || "",
    city: contact?.city || "",
    fullAddress: contact?.fullAddress || "",
    googleMapsUrl: contact?.googleMapsUrl || "",
    githubUrl: contact?.githubUrl || "",
    linkedinUrl: contact?.linkedinUrl || "",
    twitterUrl: contact?.twitterUrl || "",
    instagramUrl: contact?.instagramUrl || "",
    facebookUrl: contact?.facebookUrl || "",
    youtubeUrl: contact?.youtubeUrl || "",
    discordUsername: contact?.discordUsername || "",
    telegramUsername: contact?.telegramUsername || "",

    welcomeNotification: notification?.welcomeNotification || "Welcome to your Admin Dashboard!",
    announcementBanner: notification?.announcementBanner || "",
    bannerEnabled: notification?.bannerEnabled || false,

    enableComments: general?.enableComments ?? true,
    enableGallery: general?.enableGallery ?? true,
    enableLearning: general?.enableLearning ?? true,
    enableNotifications: general?.enableNotifications ?? true,
    googleAnalyticsId: general?.googleAnalyticsId || "",
    maxUploadSizeMb: general?.maxUploadSizeMb ?? 5,
    launchedAt: general?.launchedAt || new Date(),
    authorName: general?.authorName || "Abdus Subhan",
    authorEmail: general?.authorEmail || "",

    maintenanceEnabled: maintenance?.maintenanceEnabled ?? false,
    maintenanceMessage: maintenance?.maintenanceMessage ?? "We'll be back soon!",
    
    // Remaining specific settings just in case
    homepageFeaturedCourses: course?.homepageFeaturedCourses || [],
    defaultInstructor: course?.defaultInstructor || "",
    defaultCurrency: course?.defaultCurrency || "USD",
    defaultCourseLanguage: course?.defaultLanguage || "English",
    
    homepageFeaturedCertificates: certificate?.homepageFeaturedCertificates || [],
    enableVerification: certificate?.enableVerification ?? true,

    featuredImages: gallery?.featuredImages || [],
    galleryBanner: gallery?.galleryBanner || "",

    copyright: footer?.copyright || "© All rights reserved.",
    footerLinks: footer?.footerLinks || [],
    footerLogo: footer?.footerLogo || "",
  };
});

export async function saveBrandingSettings(formData: FormData) {
  try {
    await assertAdmin();
    const siteTitle = (formData.get("siteTitle") as string) || "Boss Journal";
    const siteTagline = (formData.get("siteTagline") as string) || "";
    const siteDescription = (formData.get("siteDescription") as string) || "";
    const siteLogo = (formData.get("siteLogo") as string) || "";
    const siteFavicon = (formData.get("siteFavicon") as string) || "";

    await prisma.brandSettings.upsert({
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
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Branding settings saved successfully!" };
  } catch (error: any) {
    console.error("saveBrandingSettings error:", error);
    return { error: error?.message || "Failed to save branding settings." };
  }
}

export async function saveGeneralSettings(formData: FormData) {
  try {
    await assertAdmin();
    const launchedAtInput = formData.get("launchedAt") as string;
    const launchedAt = launchedAtInput ? new Date(launchedAtInput) : new Date();

    const siteUrl = formData.get("siteUrl") as string;
    const defaultLanguage = (formData.get("defaultLanguage") as string) || "en";
    const authorName = formData.get("authorName") as string;
    const authorEmail = formData.get("authorEmail") as string;

    await Promise.all([
      prisma.brandSettings.upsert({
        where: { id: "singleton" },
        update: {
          siteUrl,
          defaultLanguage,
        },
        create: {
          id: "singleton",
          siteUrl,
          defaultLanguage,
        }
      }),
      prisma.generalSettings.upsert({
        where: { id: "singleton" },
        update: {
          authorName,
          authorEmail,
          launchedAt,
        },
        create: {
          id: "singleton",
          authorName,
          authorEmail,
          launchedAt,
        }
      })
    ]);

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "General settings saved successfully!" };
  } catch (error: any) {
    console.error("saveGeneralSettings error:", error);
    return { error: error?.message || "Failed to save general settings." };
  }
}

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
    const resumePdf = (formData.get("resumePdf") as string) || "";
    
    // Social links
    const githubUrl = (formData.get("githubUrl") as string) || "";
    const linkedinUrl = (formData.get("linkedinUrl") as string) || "";
    const twitterUrl = (formData.get("twitterUrl") as string) || "";
    const instagramUrl = (formData.get("instagramUrl") as string) || "";
    const facebookUrl = (formData.get("facebookUrl") as string) || "";
    const youtubeUrl = (formData.get("youtubeUrl") as string) || "";
    const discordUsername = (formData.get("discordUsername") as string) || "";
    const telegramUsername = (formData.get("telegramUsername") as string) || "";

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
        update: {
          resumePdf,
        },
        create: {
          id: "singleton",
          resumePdf,
        }
      })
    ]);

    revalidatePath("/admin/settings");
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Contact settings saved successfully!" };
  } catch (error: any) {
    console.error("saveContactSettings error:", error);
    return { error: error?.message || "Failed to save contact settings." };
  }
}

export async function saveSeoSettings(formData: FormData) {
  try {
    await assertAdmin();
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const seoKeywords = formData.get("seoKeywords") as string;
    const ogImage = formData.get("ogImage") as string;
    const robots = formData.get("robots") as string || "index, follow";
    const canonicalUrl = formData.get("canonicalUrl") as string || "";
    const twitterCards = formData.get("twitterCards") as string || "summary_large_image";

    await prisma.seoSettings.upsert({
      where: { id: "singleton" },
      update: {
        seoTitle,
        seoDescription,
        seoKeywords,
        ogImage,
        robots,
        canonicalUrl,
        twitterCards,
      },
      create: { 
        id: "singleton",
        seoTitle,
        seoDescription,
        seoKeywords,
        ogImage,
        robots,
        canonicalUrl,
        twitterCards,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "SEO settings saved successfully!" };
  } catch (error: any) {
    console.error("saveSeoSettings error:", error);
    return { error: error?.message || "Failed to save SEO settings." };
  }
}

export async function saveAppearanceSettings(formData: FormData) {
  try {
    await assertAdmin();
    const defaultTheme = formData.get("defaultTheme") as string;
    const brandColor = (formData.get("brandColor") as string) || "#F97316";
    const accentColor = (formData.get("accentColor") as string) || "#FB7185";

    const brandColors = {
      primary: brandColor,
      accent: accentColor
    };

    await prisma.brandSettings.upsert({
      where: { id: "singleton" },
      update: {
        defaultTheme,
        brandColors,
      },
      create: { 
        id: "singleton",
        defaultTheme,
        brandColors,
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Appearance settings saved successfully!" };
  } catch (error: any) {
    console.error("saveAppearanceSettings error:", error);
    return { error: error?.message || "Failed to save appearance settings." };
  }
}

export async function saveFeatureFlags(formData: FormData) {
  try {
    await assertAdmin();
    await prisma.generalSettings.upsert({
      where: { id: "singleton" },
      update: {
        enableComments: formData.get("enableComments") === "on",
        enableGallery: formData.get("enableGallery") === "on",
        enableLearning: formData.get("enableLearning") === "on",
        enableNotifications: formData.get("enableNotifications") === "on",
      },
      create: { 
        id: "singleton",
        enableComments: formData.get("enableComments") === "on",
        enableGallery: formData.get("enableGallery") === "on",
        enableLearning: formData.get("enableLearning") === "on",
        enableNotifications: formData.get("enableNotifications") === "on",
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Feature flags saved successfully!" };
  } catch (error: any) {
    console.error("saveFeatureFlags error:", error);
    return { error: error?.message || "Failed to save feature flags." };
  }
}

export async function saveMaintenanceSettings(formData: FormData) {
  try {
    const session = await assertAdmin();
    const adminEmail = session.user.email || "unknown";

    const maintenanceEnabled = formData.get("maintenanceEnabled") === "on";
    const maintenanceMessage = (formData.get("maintenanceMessage") as string) || "We'll be back soon!";

    const current = await prisma.maintenanceSettings.findUnique({
      where: { id: "singleton" },
      select: { maintenanceEnabled: true }
    });

    const isStateChanged = !current || current.maintenanceEnabled !== maintenanceEnabled;

    await prisma.maintenanceSettings.upsert({
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

    if (isStateChanged) {
      if (maintenanceEnabled) {
        await prisma.maintenanceLog.create({
          data: { enabledAt: new Date() }
        });
      } else {
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
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Maintenance settings saved successfully!" };
  } catch (error: any) {
    console.error("saveMaintenanceSettings error:", error);
    return { error: error?.message || "Failed to save maintenance settings." };
  }
}

export async function saveSocialSettings(formData: FormData) {
  try {
    await assertAdmin();
    const githubUrl = (formData.get("githubUrl") as string) || "";
    const linkedinUrl = (formData.get("linkedinUrl") as string) || "";
    const twitterUrl = (formData.get("twitterUrl") as string) || "";
    const instagramUrl = (formData.get("instagramUrl") as string) || "";
    const facebookUrl = (formData.get("facebookUrl") as string) || "";
    const youtubeUrl = (formData.get("youtubeUrl") as string) || "";
    const discordUsername = (formData.get("discordUsername") as string) || "";
    const telegramUsername = (formData.get("telegramUsername") as string) || "";

    await prisma.contactSettings.upsert({
      where: { id: "singleton" },
      update: {
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
        githubUrl,
        linkedinUrl,
        twitterUrl,
        instagramUrl,
        facebookUrl,
        youtubeUrl,
        discordUsername,
        telegramUsername,
      }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Social settings saved successfully!" };
  } catch (error: any) {
    console.error("saveSocialSettings error:", error);
    return { error: error?.message || "Failed to save social settings." };
  }
}

export async function saveAnalyticsUploadSettings(formData: FormData) {
  try {
    await assertAdmin();
    const googleAnalyticsId = (formData.get("googleAnalyticsId") as string) || "";
    const maxUploadSizeMb = parseInt((formData.get("maxUploadSizeMb") as string) || "5", 10);

    await prisma.generalSettings.upsert({
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
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Analytics and Upload settings saved successfully!" };
  } catch (error: any) {
    console.error("saveAnalyticsUploadSettings error:", error);
    return { error: error?.message || "Failed to save analytics and upload settings." };
  }
}

export async function saveHomepageSettings(formData: FormData) {
  try {
    await assertAdmin();

    const heroTitle = (formData.get("heroTitle") as string) || "";
    const heroHighlighted = (formData.get("heroHighlighted") as string) || "";
    const heroDescription = (formData.get("heroDescription") as string) || "";
    const heroProfileImage = (formData.get("heroProfileImage") as string) || "";
    const heroBgDecor = (formData.get("heroBgDecor") as string) || "glow";
    const heroBtnPrimaryText = (formData.get("heroBtnPrimaryText") as string) || "";
    const heroBtnPrimaryLink = (formData.get("heroBtnPrimaryLink") as string) || "";
    const heroBtnSecondaryText = (formData.get("heroBtnSecondaryText") as string) || "";
    const heroBtnSecondaryLink = (formData.get("heroBtnSecondaryLink") as string) || "";
    const authorTitle = (formData.get("authorTitle") as string) || "";
    const authorBio = (formData.get("authorBio") as string) || "";

    const featuredProjects = formData.getAll("featuredProjects") as string[];
    const featuredPosts = formData.getAll("featuredPosts") as string[];
    const featuredCertificates = formData.getAll("featuredCertificates") as string[];
    const featuredCourses = formData.getAll("featuredCourses") as string[];

    const typingConfigRaw = formData.get("typingConfig") as string;
    let typingConfig = null;
    if (typingConfigRaw) {
      try {
        typingConfig = JSON.parse(typingConfigRaw);
      } catch (e) {
        console.error("Failed to parse typingConfig", e);
      }
    }

    await prisma.homepageSettings.upsert({
      where: { id: "singleton" },
      update: {
        heroTitle,
        heroHighlighted,
        heroDescription,
        heroProfileImage,
        heroBgDecor,
        heroBtnPrimaryText,
        heroBtnPrimaryLink,
        heroBtnSecondaryText,
        heroBtnSecondaryLink,
        authorTitle,
        authorBio,
        featuredProjects,
        featuredPosts,
        featuredCertificates,
        featuredCourses,
        typingConfig: typingConfig || undefined
      },
      create: {
        id: "singleton",
        heroTitle,
        heroHighlighted,
        heroDescription,
        heroProfileImage,
        heroBgDecor,
        heroBtnPrimaryText,
        heroBtnPrimaryLink,
        heroBtnSecondaryText,
        heroBtnSecondaryLink,
        authorTitle,
        authorBio,
        featuredProjects,
        featuredPosts,
        featuredCertificates,
        featuredCourses,
        typingConfig: typingConfig || undefined
      },
    });

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Homepage customization parameters updated successfully!" };
  } catch (error: any) {
    console.error("saveHomepageSettings error:", error);
    return { error: error?.message || "Failed to save homepage settings." };
  }
}

export async function saveAboutSettings(formData: FormData) {
  try {
    await assertAdmin();
    const aboutTitle = (formData.get("aboutTitle") as string) || "About Me";
    const aboutDescription = (formData.get("aboutDescription") as string) || "";
    const aboutImage = (formData.get("aboutImage") as string) || "";
    const resumePdf = (formData.get("resumePdf") as string) || "";

    await prisma.aboutSettings.upsert({
      where: { id: "singleton" },
      update: {
        aboutTitle,
        aboutDescription,
        aboutImage,
        resumePdf
      },
      create: {
        id: "singleton",
        aboutTitle,
        aboutDescription,
        aboutImage,
        resumePdf
      }
    });

    revalidatePath("/admin/about");
    revalidatePath("/about");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "About settings saved successfully!" };
  } catch (error: any) {
    console.error("saveAboutSettings error:", error);
    return { error: error?.message || "Failed to save About settings." };
  }
}

export async function saveFooterSettings(formData: FormData) {
  try {
    await assertAdmin();
    const copyright = (formData.get("copyright") as string) || "";
    const footerLogo = (formData.get("footerLogo") as string) || "";

    await prisma.footerSettings.upsert({
      where: { id: "singleton" },
      update: {
        copyright,
        footerLogo
      },
      create: {
        id: "singleton",
        copyright,
        footerLogo
      }
    });

    revalidatePath("/");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Footer settings saved successfully!" };
  } catch (error: any) {
    console.error("saveFooterSettings error:", error);
    return { error: error?.message || "Failed to save Footer settings." };
  }
}

export async function saveNotificationSettings(formData: FormData) {
  try {
    await assertAdmin();
    const welcomeNotification = (formData.get("welcomeNotification") as string) || "Welcome!";
    const announcementBanner = (formData.get("announcementBanner") as string) || "";
    const bannerEnabled = formData.get("bannerEnabled") === "on";

    await prisma.notificationSettings.upsert({
      where: { id: "singleton" },
      update: {
        welcomeNotification,
        announcementBanner,
        bannerEnabled
      },
      create: {
        id: "singleton",
        welcomeNotification,
        announcementBanner,
        bannerEnabled
      }
    });

    revalidatePath("/");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Notification settings saved successfully!" };
  } catch (error: any) {
    console.error("saveNotificationSettings error:", error);
    return { error: error?.message || "Failed to save Notification settings." };
  }
}

export async function saveGallerySettings(formData: FormData) {
  try {
    await assertAdmin();
    const galleryBanner = (formData.get("galleryBanner") as string) || "";

    await prisma.gallerySettings.upsert({
      where: { id: "singleton" },
      update: {
        galleryBanner
      },
      create: {
        id: "singleton",
        galleryBanner
      }
    });

    revalidatePath("/admin/gallery-settings");
    revalidatePath("/gallery");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Gallery settings saved successfully!" };
} catch (error: any) {
    console.error("saveGallerySettings error:", error);
    return { error: error?.message || "Failed to save Gallery settings." };
  }
}

export async function saveCourseSettings(formData: FormData) {
  try {
    await assertAdmin();
    const defaultInstructor = (formData.get("defaultInstructor") as string) || "";
    const defaultCurrency = (formData.get("defaultCurrency") as string) || "USD";
    const defaultLanguage = (formData.get("defaultLanguage") as string) || "English";

    await prisma.courseSettings.upsert({
      where: { id: "singleton" },
      update: {
        defaultInstructor,
        defaultCurrency,
        defaultLanguage
      },
      create: {
        id: "singleton",
        defaultInstructor,
        defaultCurrency,
        defaultLanguage
      }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/courses");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Course settings saved successfully!" };
  } catch (error: any) {
    console.error("saveCourseSettings error:", error);
    return { error: error?.message || "Failed to save Course settings." };
  }
}

export async function saveCertificateSettings(formData: FormData) {
  try {
    await assertAdmin();
    const enableVerification = formData.get("enableVerification") === "on";

    await prisma.certificateSettings.upsert({
      where: { id: "singleton" },
      update: {
        enableVerification
      },
      create: {
        id: "singleton",
        enableVerification
      }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/certifications");
    revalidatePath("/", "layout");
    revalidateTag("site-settings", "max");
    revalidateTag("homepage-data", "max");
    await triggerRealtimeUpdate("devs-journal-sync", "content-updated");
    return { success: "Certificate settings saved successfully!" };
  } catch (error: any) {
    console.error("saveCertificateSettings error:", error);
    return { error: error?.message || "Failed to save Certificate settings." };
  }
}

