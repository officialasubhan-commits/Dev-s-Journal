import prisma from "@/lib/prisma";
import CertificationsClient from "./CertificationsClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const dbCerts = await prisma.certification.findMany({
    orderBy: {
      date: 'desc'
    }
  });

  const certs = dbCerts.map(c => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    date: c.date.toISOString(),
    url: c.url,
    image: c.image,
    pdfUrl: c.pdfUrl,
    skills: c.skills,
    published: c.published
  }));

  return <CertificationsClient initialCerts={certs} />;
}
