import CertificationsClient from "./CertificationsClient";
import { getCertifications } from "@/lib/services/certifications";

export default async function CertificationsPage() {
  const dbCerts = await getCertifications();

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
