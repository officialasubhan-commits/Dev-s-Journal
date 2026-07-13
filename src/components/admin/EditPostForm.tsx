"use client";

import { updatePost } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { SmartEditor } from "@/components/admin/SmartEditor";
import { useState } from "react";
import { MediaUploader } from "./MediaUploader";
import { Post } from "@prisma/client";
import { Loader2 } from "lucide-react";

export function EditPostForm({ post }: { post: Post }) {
  const [coverImage, setCoverImage] = useState(post.coverImage || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Controlled form state
  const [formData, setFormData] = useState({
    title: post.title || "",
    slug: post.slug || "",
    content: post.content || "",
    mood: post.mood || "",
    readingTime: post.readingTime || 5,
    tags: post.tags?.join(", ") || "",
    seoTitle: post.seoTitle || "",
    seoDescription: post.seoDescription || "",
  });

  const updateField = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    try {
      const res = await updatePost(post.id, data);
      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log("Post updated successfully. Redirecting...");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-[var(--card)] border border-[var(--border-color)] p-6 rounded-xl shadow-lg">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Cover Image</label>
          <MediaUploader 
            value={coverImage} 
            onChange={(url) => setCoverImage(url)} 
            onRemove={() => setCoverImage("")} 
            aspect={16/9}
          />
          <input type="hidden" name="coverImage" value={coverImage} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              Title
            </label>
            <input 
              name="title" 
              required 
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Post Title"
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              Slug (URL)
            </label>
            <input 
              name="slug" 
              required 
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="post-title"
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
            Content
          </label>
          <SmartEditor 
            name="content"
            value={formData.content} 
            onChange={(val) => updateField("content", val)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              Mood
            </label>
            <input 
              name="mood" 
              value={formData.mood}
              onChange={(e) => updateField("mood", e.target.value)}
              placeholder="e.g. Happy, Reflective"
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              Reading Time (mins)
            </label>
            <input 
              name="readingTime" 
              type="number"
              value={formData.readingTime}
              onChange={(e) => updateField("readingTime", parseInt(e.target.value) || 5)}
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              Tags (comma separated)
            </label>
            <input 
              name="tags" 
              value={formData.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="react, tech, life"
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              SEO Title
            </label>
            <input 
              name="seoTitle" 
              value={formData.seoTitle}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              placeholder="SEO Optimized Title"
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
              SEO Description
            </label>
            <input 
              name="seoDescription" 
              value={formData.seoDescription}
              onChange={(e) => updateField("seoDescription", e.target.value)}
              placeholder="Meta description for search engines"
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Schedule Date (Optional)</label>
            <input 
              name="scheduledFor" 
              type="datetime-local"
              defaultValue={post.scheduledFor ? new Date(new Date(post.scheduledFor).getTime() - new Date().getTimezoneOffset()*60000).toISOString().slice(0, 16) : ""}
              disabled={isLoading}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="published" id="published" defaultChecked={post.published} disabled={isLoading} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="published" className="font-medium cursor-pointer">Published to public</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="pinned" id="pinned" defaultChecked={post.pinned} disabled={isLoading} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="pinned" className="font-medium cursor-pointer">Pinned</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="archived" id="archived" defaultChecked={post.archived} disabled={isLoading} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="archived" className="font-medium cursor-pointer text-[var(--error)]">Archived</label>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-4 border-t border-[var(--border-color)]">
          <Button variant="outline" type="button" onClick={() => window.history.back()} disabled={isLoading}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
