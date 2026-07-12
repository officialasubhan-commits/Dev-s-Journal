import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditPostForm } from "@/components/admin/EditPostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Post</h1>
      </div>
      <EditPostForm post={post} />
    </div>
  );
}
