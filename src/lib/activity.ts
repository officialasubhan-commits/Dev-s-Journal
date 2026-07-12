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


  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}


