import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit3, Trash2, Eye, EyeOff, Code } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { deleteProject } from "../actions";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Projects</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your portfolio projects and case studies.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all" asChild>
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      <Card className="bg-[var(--card)] border-[var(--border-color)] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--background)]/50">
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Project</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Status</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Date Added</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Tech Stack</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center">
                        <Code className="w-6 h-6 text-[var(--secondary)]/50" />
                      </div>
                      <p>No projects yet. Showcase your first piece of work!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-[var(--background)]/30 transition-colors group">
                    <td className="p-4">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate max-w-[250px]">{project.description}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium ${project.published ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {project.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {project.published ? 'Public' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                      {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {project.technologies.slice(0, 3).map((tech: any) => (
                          <span key={tech} className="px-2 py-0.5 bg-[var(--background)] border border-[var(--border-color)] rounded-md text-[10px]">{tech}</span>
                        ))}
                        {project.technologies.length > 3 && <span className="px-2 py-0.5 text-[10px]">+{project.technologies.length - 3}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]" asChild>
                          <Link href={`/admin/projects/${project.id}`}>
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <form action={deleteProject.bind(null, project.id)}>
                          <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[var(--error)]/10 hover:text-[var(--error)]">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
