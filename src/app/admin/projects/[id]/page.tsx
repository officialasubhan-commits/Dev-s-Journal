import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditProjectForm } from "@/components/admin/EditProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>
      <EditProjectForm project={project} />
    </div>
  );
}
