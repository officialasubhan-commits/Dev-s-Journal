// src/lib/services/homepage.ts
import { getSiteSettings } from "@/app/admin/settings/actions";
import { getCachedHomepageData } from "@/lib/cache";

/**
 * Service to fetch all homepage data, including site settings and cached widgets data.
 */
export async function getHomepageData() {
  const settings = await getSiteSettings();

  const projectIds = settings?.featuredProjects || [];
  const postIds = settings?.featuredPosts || [];

  const cachedData = await getCachedHomepageData(projectIds, postIds);

  return {
    settings,
    ...cachedData,
  };
}
