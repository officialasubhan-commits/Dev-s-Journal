"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCertificate(data: {
  title: string;
  issuer: string;
  date: Date;
  url?: string;
  image?: string;
  pdfUrl?: string;
  skills: string[];
  published?: boolean;
}) {
  try {
    const cert = await prisma.certification.create({
      data: {
        ...data,
        published: data.published ?? true
      },
    });
    revalidatePath("/admin/certifications");
    return { success: true, id: cert.id };
  } catch (error) {
    console.error("Error creating certificate:", error);
    return { success: false, error: "Failed to create certificate" };
  }
}

export async function updateCertificate(id: string, data: Partial<{
  title: string;
  issuer: string;
  date: Date;
  url: string;
  image: string;
  pdfUrl: string;
  skills: string[];
  published: boolean;
}>) {
  try {
    const cert = await prisma.certification.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/certifications");
    return { success: true, id: cert.id };
  } catch (error) {
    console.error("Error updating certificate:", error);
    return { success: false, error: "Failed to update certificate" };
  }
}

export async function deleteCertificate(id: string) {
  try {
    await prisma.certification.delete({
      where: { id },
    });
    revalidatePath("/admin/certifications");
    return { success: true };
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return { success: false, error: "Failed to delete certificate" };
  }
}

export async function toggleCertificatePublish(id: string, published: boolean) {
  try {
    await prisma.certification.update({
      where: { id },
      data: { published },
    });
    revalidatePath("/admin/certifications");
    return { success: true };
  } catch (error) {
    console.error("Error toggling certificate publish status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}
