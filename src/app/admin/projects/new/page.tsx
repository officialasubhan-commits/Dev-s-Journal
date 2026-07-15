"use client";

import { createProject } from "../../actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Loader2 } from "lucide-react";

export default function NewProjectPage() {
  const [coverImage, setCoverImage] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [duplicateId, setDuplicateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddImage = (url: string) => setImages(prev => [...prev, url]);
  const handleRemoveImage = (url: string) => setImages(prev => prev.filter(i => i !== url));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    try {
      const res = await createProject(data);
      if (res?.error) {
        if (res.error === "DUPLICATE_ENTRY") {
          setError("DUPLICATE_ENTRY");
          setDuplicateId(res.id || "");
        } else {
          setError(res.error);
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.log("Project created. Redirecting...");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">New Project</h1>
      </div>

      {error === "DUPLICATE_ENTRY" ? (
        <div className="p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] rounded-lg text-sm font-medium flex items-center justify-between">
          <span>A project with this URL slug already exists. Would you like to edit the existing one instead?</span>
          <a href={`/admin/projects/${duplicateId}`} className="underline font-bold hover:opacity-80">
            Edit Existing Project
          </a>
        </div>
      ) : error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl bg-[var(--card)] border border-[var(--border-color)] p-6 rounded-xl shadow-lg">
        
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
            <input name="title" required placeholder="Project Name" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Slug (URL)</label>
            <input name="slug" required placeholder="project-name" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Short Description</label>
          <textarea name="description" required placeholder="Brief summary of the project" rows={3} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)] resize-none" />
        </div>

        {/* URLs & Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">GitHub URL</label>
            <input name="githubUrl" placeholder="https://github.com/..." className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Live Demo URL</label>
            <input name="liveUrl" placeholder="https://..." className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Start Date</label>
            <input type="date" name="startDate" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">End Date</label>
            <input type="date" name="endDate" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Technologies (Comma separated)</label>
          <input name="technologies" placeholder="React, Node.js, PostgreSQL" className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
        </div>

        {/* Rich Text Areas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Full Content / Overview</label>
            <textarea name="content" rows={5} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Features</label>
            <textarea name="features" rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Challenges</label>
            <textarea name="challenges" rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Lessons Learned</label>
            <textarea name="lessonsLearned" rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
          </div>
        </div>
        
        {/* Visibility */}
        <div className="flex flex-wrap items-center gap-4 bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="published" id="published" className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="published" className="font-medium cursor-pointer">Published to public</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="pinned" id="pinned" className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="pinned" className="font-medium cursor-pointer">Pinned (Featured)</label>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-4 border-t border-[var(--border-color)]">
          <Button variant="outline" type="button" onClick={() => window.history.back()} disabled={isLoading}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
