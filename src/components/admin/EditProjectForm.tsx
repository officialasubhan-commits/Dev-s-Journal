"use client";

import { updateProject } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { SmartEditor } from "@/components/admin/SmartEditor";
import { useState } from "react";
import { MediaUploader } from "./MediaUploader";
import { Project } from "@prisma/client";

export function EditProjectForm({ project }: { project: Project }) {
  const updateProjectWithId = updateProject.bind(null, project.id);
  const [coverImage, setCoverImage] = useState(project.coverImage || "");
  const [demoVideo, setDemoVideo] = useState(project.demoVideo || "");
  const [images, setImages] = useState<string[]>(project.images || []);

  const handleAddImage = (url: string) => setImages(prev => [...prev, url]);
  const handleRemoveImage = (url: string) => setImages(prev => prev.filter(i => i !== url));

  return (
    <form action={updateProjectWithId} className="space-y-8 max-w-5xl bg-[var(--card)] border border-[var(--border-color)] p-6 rounded-xl shadow-lg">
      
      {/* Media Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[var(--border-color)] pb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Cover Image</label>
          <MediaUploader value={coverImage} onChange={setCoverImage} onRemove={() => setCoverImage("")} aspect={16/9} />
          <input type="hidden" name="coverImage" value={coverImage} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Demo Video</label>
          <MediaUploader value={demoVideo} onChange={setDemoVideo} onRemove={() => setDemoVideo("")} />
          <input type="hidden" name="demoVideo" value={demoVideo} />
        </div>
      </div>

      {/* Screenshots */}
      <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Project Screenshots (Gallery)</label>
        <MediaUploader multiple value={images} onChange={handleAddImage} onRemove={handleRemoveImage} />
        <input type="hidden" name="images" value={images.join(",")} />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Project Title</label>
          <input name="title" required defaultValue={project.title} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Slug (URL)</label>
          <input name="slug" required defaultValue={project.slug} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Short Description</label>
        <textarea name="description" required defaultValue={project.description} rows={3} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)] resize-none" />
      </div>

      {/* URLs & Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">GitHub URL</label>
          <input name="githubUrl" defaultValue={project.githubUrl || ""} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Live Demo URL</label>
          <input name="liveUrl" defaultValue={project.liveUrl || ""} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Start Date</label>
          <input type="date" name="startDate" defaultValue={project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : ""} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">End Date</label>
          <input type="date" name="endDate" defaultValue={project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : ""} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Technologies (Comma separated)</label>
        <input name="technologies" defaultValue={project.technologies?.join(", ")} placeholder="React, Node.js, PostgreSQL" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
      </div>

      {/* Rich Text Areas */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Full Content / Overview</label>
          <textarea name="content" defaultValue={project.content || ""} rows={5} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Features</label>
          <textarea name="features" defaultValue={project.features || ""} rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Challenges</label>
          <textarea name="challenges" defaultValue={project.challenges || ""} rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Lessons Learned</label>
          <textarea name="lessonsLearned" defaultValue={project.lessonsLearned || ""} rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>
      </div>
      
      {/* Visibility */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]">
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="published" id="published" defaultChecked={project.published} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
          <label htmlFor="published" className="font-medium cursor-pointer">Published</label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" name="pinned" id="pinned" defaultChecked={project.pinned} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
          <label htmlFor="pinned" className="font-medium cursor-pointer">Pinned (Featured)</label>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end space-x-4 border-t border-[var(--border-color)]">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit">Update Project</Button>
      </div>
    </form>
  );
}
