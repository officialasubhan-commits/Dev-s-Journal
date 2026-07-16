// src/lib/services/certifications.ts
import prisma from "@/lib/prisma";
import { getCachedCertificationsList } from "@/lib/cache";

/**
 * Service to fetch public certificates (uses cache).
 */
export async function getCertifications() {
  return getCachedCertificationsList();
}

/**
 * Service to verify a single certificate by ID.
 * Returns only the necessary public verification details.
 */
export async function verifyCertificate(id: string) {
  return prisma.certification.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      issuer: true,
      date: true,
      url: true,
      image: true,
      pdfUrl: true,
      skills: true,
      published: true,
      user: {
        select: {
          name: true,
          displayName: true,
        }
      }
    }
  });
}
