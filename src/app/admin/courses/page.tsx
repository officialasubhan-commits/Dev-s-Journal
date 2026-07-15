"use client";

import { useState } from "react";
import { mockCourses, Course } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  DollarSign, 
  BookOpen, 
  Users, 
  Layers, 
  Tag, 
  Calendar,
  Sparkles
} from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add course form states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Development");
  const [newPrice, setNewPrice] = useState(49);
  const [newDifficulty, setNewDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course from the public academy catalog?")) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: newTitle,
      instructor: "Abdus Subhan",
      shortDescription: "Newly created educational program template.",
      description: "Complete course description body goes here.",
      coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop",
      difficulty: newDifficulty,
      category: newCategory,
      tags: [newCategory.toLowerCase(), "programming"],
      duration: "10h 30m",
      lessonsCount: 12,
      rating: 5.0,
      studentsCount: 0,
      language: "English",
      lastUpdated: "Just Now",
      isFree: newPrice === 0,
      price: newPrice,
      outcomes: ["Learning outcome number one"],
      requirements: ["Familiarity with basic CLI coding concepts"],
      targetAudience: ["All software developers"],
      curriculum: [
        {
          id: "sec-1",
          title: "Section 1: Get Started",
          lessons: [{ id: "l-1", title: "1. Overview", duration: "05:00", isPreview: true }]
        }
      ],
      faqs: [],
      reviews: [],
      certificateInfo: "Includes an official digital badge of completion."
    };

    setCourses(prev => [newCourseObj, ...prev]);
    setNewTitle("");
    setNewPrice(49);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">
            Academy Course Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Configure learning paths, curriculum syllabi, and price tags for public enrollments.
          </p>
        </div>

        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Course Template
        </Button>
      </div>

      {/* Course Analytics Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Syllabi", value: courses.length, desc: "Created courses" },
          { label: "Total Students Enrolled", value: 2766, desc: "Active users logs" },
          { label: "Average Academy Rating", value: "4.8 / 5.0", desc: "Verifiable reviews" },
          { label: "Total Paid Subscriptions", value: "$134,800", desc: "Calculated transactions" }
        ].map((widget, idx) => (
          <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/70 p-4 rounded-2xl shadow-sm space-y-1">
            <span className="text-xl md:text-2xl font-black text-[var(--text-main)] font-heading">{widget.value}</span>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{widget.label}</p>
            <p className="text-[9px] text-[var(--text-muted)] font-normal">{widget.desc}</p>
          </div>
        ))}
      </div>

      {/* Add Course Form Dialog Mockup */}
      {showAddForm && (
        <form onSubmit={handleAddCourse} className="bg-[var(--card)] border border-[var(--primary)]/20 p-5 rounded-2xl space-y-4 shadow-md max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] pb-2 border-b border-[var(--border-color)]/60">
            <Sparkles className="w-4.5 h-4.5" />
            <span>Create New Academy Course Template</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                type="text"
                required
                placeholder="e.g. Docker and Kubernetes Production Bootcamp"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="courseCategory">Category Category</label>
              <select
                id="courseCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="coursePrice">Price ($)</label>
              <input
                id="coursePrice"
                type="number"
                min={0}
                required
                value={newPrice}
                onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="courseDifficulty">Difficulty Level</label>
              <select
                id="courseDifficulty"
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as any)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]/60">
            <Button variant="outline" type="button" size="sm" onClick={() => setShowAddForm(false)} className="rounded-lg text-xs font-semibold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-lg text-xs font-semibold cursor-pointer">
              Add Course
            </Button>
          </div>
        </form>
      )}

      {/* Courses List Table Grid */}
      <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--secondary-bg)]/40 border-b border-[var(--border-color)]/60 text-[var(--text-secondary)] font-bold">
                <th className="p-4">Cover & Title</th>
                <th className="p-4">Topic / Level</th>
                <th className="p-4">Stats</th>
                <th className="p-4">Pricing</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--secondary-bg)]/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 relative rounded overflow-hidden bg-[var(--secondary-bg)] border border-[var(--border-color)]/50 shrink-0">
                        <SafeImage src={c.coverImage} alt={c.title} fill className="object-cover" />
                      </div>
                      <div className="font-semibold text-[var(--text-main)] truncate max-w-xs">{c.title}</div>
                    </div>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <div className="font-semibold text-[var(--text-main)]">{c.category}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-medium uppercase">{c.difficulty}</div>
                  </td>
                  <td className="p-4 space-y-0.5 text-[10px] font-medium">
                    <div className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {c.lessonsCount} lessons</div>
                    <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.studentsCount} students</div>
                  </td>
                  <td className="p-4 font-bold text-[var(--text-main)]">
                    {c.isFree ? "Free" : `$${c.discountPrice || c.price}`}
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="View catalog page" asChild>
                      <a href={`/courses/${c.id}`}>
                        <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="Edit course metadata" onClick={() => alert("Loading metadata fields...")}>
                      <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="Delete course" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
