/*
  Warnings:

  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "BrandSettings" ADD COLUMN     "brandColors" JSONB NOT NULL DEFAULT '{"primary": "#F97316", "accent": "#FB7185"}',
ADD COLUMN     "siteFavicon" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SeoSettings" ADD COLUMN     "canonicalUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "structuredData" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "twitterCards" TEXT NOT NULL DEFAULT 'summary_large_image';

-- CreateTable
CREATE TABLE "GeneralSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "enableComments" BOOLEAN NOT NULL DEFAULT true,
    "enableGallery" BOOLEAN NOT NULL DEFAULT true,
    "enableLearning" BOOLEAN NOT NULL DEFAULT true,
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    "googleAnalyticsId" TEXT NOT NULL DEFAULT '',
    "maxUploadSizeMb" INTEGER NOT NULL DEFAULT 5,
    "launchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "maintenanceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT NOT NULL DEFAULT 'We''ll be back soon!',
    "maintenanceUpdatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceSettings_pkey" PRIMARY KEY ("id")
);

-- Data Migration
INSERT INTO "GeneralSettings" ("id", "enableComments", "enableGallery", "enableLearning", "enableNotifications", "googleAnalyticsId", "maxUploadSizeMb", "launchedAt", "updatedAt")
SELECT 'singleton', "enableComments", "enableGallery", "enableLearning", "enableNotifications", "googleAnalyticsId", "maxUploadSizeMb", "launchedAt", CURRENT_TIMESTAMP
FROM "SiteSettings"
WHERE "id" = 'singleton'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "MaintenanceSettings" ("id", "maintenanceEnabled", "maintenanceMessage", "maintenanceUpdatedBy", "updatedAt")
SELECT 'singleton', "maintenanceEnabled", "maintenanceMessage", "maintenanceUpdatedBy", CURRENT_TIMESTAMP
FROM "SiteSettings"
WHERE "id" = 'singleton'
ON CONFLICT ("id") DO NOTHING;

-- Update BrandSettings
UPDATE "BrandSettings"
SET 
  "siteTitle" = s."siteTitle",
  "siteTagline" = s."siteTagline",
  "siteDescription" = s."siteDescription",
  "siteLogo" = s."siteLogo",
  "siteFavicon" = s."siteFavicon",
  "siteUrl" = s."siteUrl",
  "defaultTheme" = s."defaultTheme",
  "brandColors" = jsonb_build_object('primary', s."themePrimary", 'accent', s."themeAccent")
FROM "SiteSettings" s
WHERE "BrandSettings"."id" = 'singleton' AND s."id" = 'singleton';

-- Update SeoSettings
UPDATE "SeoSettings"
SET
  "seoTitle" = s."seoTitle",
  "seoDescription" = s."seoDescription",
  "seoKeywords" = s."seoKeywords",
  "ogImage" = s."ogImage"
FROM "SiteSettings" s
WHERE "SeoSettings"."id" = 'singleton' AND s."id" = 'singleton';

-- Update HomepageSettings
UPDATE "HomepageSettings"
SET
  "heroTitle" = s."heroTitle",
  "heroHighlighted" = s."heroHighlighted",
  "heroDescription" = s."heroDescription",
  "heroProfileImage" = s."heroProfileImage",
  "heroBgDecor" = s."heroBgDecor",
  "heroBtnPrimaryText" = s."heroBtnPrimaryText",
  "heroBtnPrimaryLink" = s."heroBtnPrimaryLink",
  "heroBtnSecondaryText" = s."heroBtnSecondaryText",
  "heroBtnSecondaryLink" = s."heroBtnSecondaryLink",
  "authorTitle" = s."authorTitle",
  "authorBio" = s."authorBio",
  "featuredProjects" = s."featuredProjects",
  "featuredPosts" = s."featuredPosts",
  "featuredCertificates" = s."featuredCertificates",
  "featuredCourses" = s."featuredCourses"
FROM "SiteSettings" s
WHERE "HomepageSettings"."id" = 'singleton' AND s."id" = 'singleton';

-- Update ContactSettings
UPDATE "ContactSettings"
SET
  "contactHeading" = s."contactHeading",
  "contactDescription" = s."contactDescription",
  "availabilityStatus" = s."availabilityStatus",
  "contactEmail" = s."contactEmail",
  "phoneNumber" = s."phoneNumber",
  "whatsappNumber" = s."whatsappNumber",
  "country" = s."country",
  "state" = s."state",
  "city" = s."city",
  "fullAddress" = s."fullAddress",
  "googleMapsUrl" = s."googleMapsUrl",
  "githubUrl" = s."githubUrl",
  "linkedinUrl" = s."linkedinUrl",
  "twitterUrl" = s."twitterUrl",
  "instagramUrl" = s."instagramUrl",
  "facebookUrl" = s."facebookUrl",
  "youtubeUrl" = s."youtubeUrl",
  "discordUsername" = s."discordUsername",
  "telegramUsername" = s."telegramUsername"
FROM "SiteSettings" s
WHERE "ContactSettings"."id" = 'singleton' AND s."id" = 'singleton';

-- DropTable
DROP TABLE "SiteSettings";
