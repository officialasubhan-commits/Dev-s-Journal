import prisma from "@/lib/prisma";
import { MediaLibraryClient } from "./MediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Media Library</h1>
        <p className="text-[var(--text-secondary)] mt-1">Upload, search, copy URLs, and manage all visual content assets across your entire website.</p>
      </div>

      <MediaLibraryClient initialAssets={assets} />
    </div>
  );
}
