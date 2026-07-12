import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2, FolderPlus, UploadCloud, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { deleteAlbum, deleteImage } from "./actions";
import { GalleryUploadButton } from "./gallery-upload-button";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const albums = await prisma.album.findMany({
    include: { _count: { select: { images: true } } },
    orderBy: { createdAt: "desc" },
  });

  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50, // Limit for performance on admin
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your albums and images.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline"><FolderPlus className="w-4 h-4 mr-2"/> New Album</Button>
          <GalleryUploadButton />
        </div>
      </div>

      {/* Albums Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-[var(--border-color)] pb-2">Albums</h2>
        {albums.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No albums yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="bg-[var(--card)] border border-[var(--border-color)] rounded-xl overflow-hidden group">
                <div className="h-40 bg-[var(--background)] relative">
                  {album.coverImage ? (
                    <Image src={album.coverImage} alt={album.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <form action={deleteAlbum.bind(null, album.id as string)}>
                      <Button type="submit" variant="destructive" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate">{album.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{album._count.images} images</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold border-b border-[var(--border-color)] pb-2">Recent Images</h2>
        {images.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No images uploaded.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-square bg-[var(--card)] border border-[var(--border-color)] rounded-lg overflow-hidden group">
                {image.url?.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={image.url} className="object-cover w-full h-full" />
                ) : (
                  <Image src={image.url} alt="Gallery Image" fill className="object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <form action={deleteImage.bind(null, image.id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
