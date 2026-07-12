import prisma from "./prisma";

export async function logActivity(userId: string, type: string, details?: string) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        details,
      },
    });

    // Check for achievements after logging
    await checkAchievements(userId, type);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function checkAchievements(userId: string, latestActivityType?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        projects: true,
        galleryImages: true,
        userAchievements: {
          include: { achievement: true }
        }
      }
    });

    if (!user) return;

    const unlockedTitles = user.userAchievements.map(ua => ua.achievement.title);
    
    // Helper to grant
    const grant = async (title: string, desc: string) => {
      if (!unlockedTitles.includes(title)) {
        // Upsert achievement globally if it doesn't exist
        const achievement = await prisma.achievement.upsert({
          where: { title },
          update: {},
          create: { title, description: desc }
        });
        
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id
          }
        });
      }
    };

    // Check criteria
    if (latestActivityType === "COMPLETED_PROFILE") {
      await grant("Completed Profile", "You set up your profile!");
    }
    
    if (user.posts.length === 1) {
      await grant("First Journal", "Published your first journal post.");
    }
    
    if (user.posts.length >= 10) {
      await grant("10 Posts", "Published 10 journal posts.");
    }
    
    if (user.projects.length >= 1) {
      await grant("First Project", "Published your first project.");
    }

  } catch (error) {
    console.error("Failed to check achievements:", error);
  }
}
