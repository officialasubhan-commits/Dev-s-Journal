-- AlterTable
ALTER TABLE "SiteSettings" RENAME COLUMN "maintenanceMode" TO "maintenanceEnabled";
ALTER TABLE "SiteSettings" ADD COLUMN "maintenanceUpdatedBy" TEXT;
