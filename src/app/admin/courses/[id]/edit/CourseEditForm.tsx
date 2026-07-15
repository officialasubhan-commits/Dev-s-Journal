"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateCourse } from "../../actions";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CourseEditForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title,
    slug: initialData.slug,
    instructor: initialData.instructor,
    shortDescription: initialData.shortDescription,
    description: initialData.description,
    coverImage: initialData.coverImage || "",
    difficulty: initialData.difficulty,
    category: initialData.category,
    duration: initialData.duration,
    isFree: initialData.isFree,
    price: initialData.price,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'price' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateCourse(initialData.id, formData);
      if (res.success) {
        alert("Course updated successfully!");
        router.push("/admin/courses");
      } else {
        alert("Failed to update course");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-lg">
            <Link href="/admin/courses"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-[var(--text-main)]">Edit Course</h1>
            <p className="text-xs text-[var(--text-secondary)]">Modify settings and details for {initialData.title}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Slug</label>
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Instructor</label>
            <input type="text" name="instructor" required value={formData.instructor} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Category</label>
            <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Short Description</label>
            <textarea name="shortDescription" required value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium resize-none" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Description</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows={6} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium resize-none" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Cover Image URL</label>
            <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Duration (e.g. 10h 30m)</label>
            <input type="text" name="duration" required value={formData.duration} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Price ($)</label>
            <input type="number" name="price" min={0} required value={formData.price} onChange={handleChange} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
          </div>
          
          <div className="space-y-2 flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer p-3 border border-[var(--border-color)] rounded-xl">
              <input type="checkbox" name="isFree" checked={formData.isFree} onChange={handleChange} className="accent-[var(--primary)] w-4 h-4" />
              <span className="text-sm font-semibold text-[var(--text-main)]">Course is Free</span>
            </label>
          </div>
          
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
          <Button type="submit" disabled={isSubmitting} className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
            <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
