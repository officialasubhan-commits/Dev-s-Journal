"use client";

import { updatePost } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { SmartEditor } from "@/components/admin/SmartEditor";
import { useState } from "react";
import { MediaUploader } from "./MediaUploader";

export function EditPostForm({ post }: { post: any }) {
  const updatePostWithId = updatePost.bind(null, post.id);
  const [coverImage, setCoverImage] = useState(post.coverImage || "");

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

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <form action={updatePostWithId} className="space-y-6 max-w-4xl bg-[var(--card)] border border-[var(--border-color)] p-6 rounded-xl shadow-lg">
        
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
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
            Content
          </label>
          <input type="hidden" name="content" id="hidden_content" />
          <SmartEditor 
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
              defaultValue={post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : ""}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:outline-none focus:border-[var(--primary)]" 
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]">
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="published" id="published" defaultChecked={post.published} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="published" className="font-medium cursor-pointer">Published to public</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="pinned" id="pinned" defaultChecked={post.pinned} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="pinned" className="font-medium cursor-pointer">Pinned</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="archived" id="archived" defaultChecked={post.archived} className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer" />
            <label htmlFor="archived" className="font-medium cursor-pointer text-[var(--error)]">Archived</label>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-4 border-t border-[var(--border-color)]">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
          <Button type="submit" onClick={() => {
            const editorTextarea = document.querySelector('.smart-editor-textarea') as HTMLTextAreaElement;
            if (editorTextarea) {
              (document.getElementById('hidden_content') as HTMLInputElement).value = editorTextarea.value;
            } else if (formData.content) {
              (document.getElementById('hidden_content') as HTMLInputElement).value = formData.content;
            }
          }}>Update Post</Button>
        </div>
      </form>
    </div>
  );
}
