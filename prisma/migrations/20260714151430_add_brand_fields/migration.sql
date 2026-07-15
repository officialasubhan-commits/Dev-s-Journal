-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "authorBio" TEXT NOT NULL DEFAULT 'Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.',
ADD COLUMN     "authorTitle" TEXT NOT NULL DEFAULT 'Software Engineer & UI/UX Designer',
ADD COLUMN     "featuredCertificates" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuredCourses" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuredPosts" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "featuredProjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "googleAnalyticsId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "heroBgDecor" TEXT NOT NULL DEFAULT 'glow',
ADD COLUMN     "heroBtnPrimaryLink" TEXT NOT NULL DEFAULT '/projects',
ADD COLUMN     "heroBtnPrimaryText" TEXT NOT NULL DEFAULT 'Explore Projects',
ADD COLUMN     "heroBtnSecondaryLink" TEXT NOT NULL DEFAULT '/journal',
ADD COLUMN     "heroBtnSecondaryText" TEXT NOT NULL DEFAULT 'Read Journal',
ADD COLUMN     "heroDescription" TEXT NOT NULL DEFAULT 'I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.',
ADD COLUMN     "heroHighlighted" TEXT NOT NULL DEFAULT 'warm & premium',
ADD COLUMN     "heroProfileImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT 'Designing simple, warm & premium digital experiences.',
ADD COLUMN     "launchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maxUploadSizeMb" INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "enabledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "isAuto" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteTitle" TEXT NOT NULL DEFAULT 'Boss Journal',
    "siteTagline" TEXT NOT NULL DEFAULT 'My personal portfolio, journal, and digital headquarters.',
    "siteDescription" TEXT NOT NULL DEFAULT 'My personal portfolio, journal, and digital headquarters.',
    "siteLogo" TEXT NOT NULL DEFAULT '',
    "siteUrl" TEXT NOT NULL DEFAULT '',
    "defaultTheme" TEXT NOT NULL DEFAULT 'light',
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "seoTitle" TEXT NOT NULL DEFAULT 'Boss Journal | Portfolio & Digital Home',
    "seoDescription" TEXT NOT NULL DEFAULT 'My digital home, where I document my journey, learning, projects, and daily life.',
    "seoKeywords" TEXT NOT NULL DEFAULT '',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "robots" TEXT NOT NULL DEFAULT 'index, follow',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroTitle" TEXT NOT NULL DEFAULT 'Designing simple, warm & premium digital experiences.',
    "heroHighlighted" TEXT NOT NULL DEFAULT 'warm & premium',
    "heroDescription" TEXT NOT NULL DEFAULT 'I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.',
    "heroProfileImage" TEXT NOT NULL DEFAULT '',
    "heroBgDecor" TEXT NOT NULL DEFAULT 'glow',
    "heroBtnPrimaryText" TEXT NOT NULL DEFAULT 'Explore Projects',
    "heroBtnPrimaryLink" TEXT NOT NULL DEFAULT '/projects',
    "heroBtnSecondaryText" TEXT NOT NULL DEFAULT 'Read Journal',
    "heroBtnSecondaryLink" TEXT NOT NULL DEFAULT '/journal',
    "authorTitle" TEXT NOT NULL DEFAULT 'Software Engineer & UI/UX Designer',
    "authorBio" TEXT NOT NULL DEFAULT 'Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.',
    "featuredProjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuredPosts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuredCertificates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuredCourses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "aboutTitle" TEXT NOT NULL DEFAULT 'About Me',
    "aboutDescription" TEXT NOT NULL DEFAULT '',
    "aboutImage" TEXT NOT NULL DEFAULT '',
    "resumePdf" TEXT NOT NULL DEFAULT '',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "contactHeading" TEXT NOT NULL DEFAULT 'Get In Touch',
    "contactDescription" TEXT NOT NULL DEFAULT 'Have a project in mind, want to collaborate, or just want to say hi? Send me a message!',
    "availabilityStatus" TEXT NOT NULL DEFAULT 'Available',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "fullAddress" TEXT NOT NULL DEFAULT '',
    "googleMapsUrl" TEXT NOT NULL DEFAULT '',
    "githubUrl" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "twitterUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "discordUsername" TEXT NOT NULL DEFAULT '',
    "telegramUsername" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "homepageFeaturedCourses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultInstructor" TEXT NOT NULL DEFAULT '',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "defaultLanguage" TEXT NOT NULL DEFAULT 'English',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "homepageFeaturedCertificates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enableVerification" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "welcomeNotification" TEXT NOT NULL DEFAULT 'Welcome to your Admin Dashboard!',
    "announcementBanner" TEXT NOT NULL DEFAULT '',
    "bannerEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GallerySettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "featuredImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "galleryBanner" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GallerySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "copyright" TEXT NOT NULL DEFAULT '© All rights reserved.',
    "footerLinks" JSONB NOT NULL DEFAULT '[]',
    "footerLogo" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_url_key" ON "MediaAsset"("url");
